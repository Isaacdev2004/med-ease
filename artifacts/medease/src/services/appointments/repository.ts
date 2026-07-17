import type {
  Appointment,
  AppointmentFilters,
  AppointmentListResult,
  BookAppointmentInput,
  WaitlistEntry,
} from '@/services/appointments/types';
import {
  FACILITIES,
  MOCK_APPOINTMENTS,
  MOCK_WAITLIST,
  PROVIDERS,
  buildQueueFromAppointments,
  generateAppointment,
} from '@/services/appointments/mock-data';

function matchesFilters(
  appointment: Appointment,
  filters: AppointmentFilters,
): boolean {
  if (filters.patientId && appointment.patient.id !== filters.patientId)
    return false;
  if (filters.providerId && appointment.provider.id !== filters.providerId)
    return false;
  if (filters.facilityId && appointment.facility.id !== filters.facilityId)
    return false;
  if (filters.department && appointment.department !== filters.department)
    return false;
  if (filters.specialty && appointment.specialty !== filters.specialty)
    return false;
  if (filters.status && appointment.status !== filters.status) return false;
  if (filters.visitType && appointment.visitType !== filters.visitType)
    return false;
  if (filters.priority && appointment.priority !== filters.priority)
    return false;
  if (filters.telemedicine !== undefined) {
    const isTele = appointment.visitType === 'telemedicine';
    if (filters.telemedicine !== isTele) return false;
  }
  if (filters.checkedIn !== undefined) {
    const isCheckedIn = appointment.checkInStatus !== 'not_checked_in';
    if (filters.checkedIn !== isCheckedIn) return false;
  }
  if (
    filters.followUp !== undefined &&
    appointment.followUpRequired !== filters.followUp
  )
    return false;
  if (
    filters.dateFrom &&
    new Date(appointment.scheduledAt) < new Date(filters.dateFrom)
  )
    return false;
  if (
    filters.dateTo &&
    new Date(appointment.scheduledAt) > new Date(filters.dateTo)
  )
    return false;
  if (filters.q) {
    const q = filters.q.toLowerCase();
    const haystack = [
      appointment.id,
      appointment.patient.fullName,
      appointment.provider.fullName,
      appointment.facility.name,
      appointment.specialty,
      appointment.reason,
    ]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

class AppointmentRepository {
  private appointments: Appointment[] = [...MOCK_APPOINTMENTS];
  private waitlist: WaitlistEntry[] = [...MOCK_WAITLIST];

  search(filters?: AppointmentFilters): AppointmentListResult {
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 25;
    const filtered = this.appointments
      .filter((a) => matchesFilters(a, filters ?? {}))
      .sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
      );
    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }

  getAll(filters?: AppointmentFilters): Appointment[] {
    return this.appointments
      .filter((a) => matchesFilters(a, filters ?? {}))
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      );
  }

  getById(id: string): Appointment | null {
    return this.appointments.find((a) => a.id === id) ?? null;
  }

  getUpcoming(filters?: AppointmentFilters): Appointment[] {
    const now = new Date();
    return this.getAll(filters).filter(
      (a) =>
        new Date(a.scheduledAt) >= now &&
        !['cancelled', 'completed', 'no_show'].includes(a.status),
    );
  }

  getPast(filters?: AppointmentFilters): Appointment[] {
    const now = new Date();
    return this.getAll(filters).filter(
      (a) =>
        new Date(a.scheduledAt) < now ||
        ['completed', 'cancelled', 'no_show'].includes(a.status),
    );
  }

  getToday(filters?: AppointmentFilters): Appointment[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.getAll(filters).filter((a) => {
      const d = new Date(a.scheduledAt);
      return d >= today && d < tomorrow;
    });
  }

  getTelemedicine(filters?: AppointmentFilters): Appointment[] {
    return this.getAll({ ...filters, telemedicine: true });
  }

  book(input: BookAppointmentInput): Appointment {
    const provider =
      PROVIDERS.find((p) => p.id === input.providerId) ?? PROVIDERS[0]!;
    const facility =
      FACILITIES.find((f) => f.id === input.facilityId) ?? FACILITIES[0]!;
    const patientIdx = parseInt(input.patientId.replace('phr-', ''), 10) - 1;
    const appointment = generateAppointment(this.appointments.length);
    const created: Appointment = {
      ...appointment,
      id: `apt-${String(this.appointments.length + 1).padStart(4, '0')}`,
      patient: {
        id: input.patientId,
        fullName: appointment.patient.fullName,
        mrn: `MRN-${10000 + (patientIdx >= 0 ? patientIdx : 0)}`,
      },
      provider,
      facility,
      specialty: input.specialty,
      department: provider.department,
      scheduledAt: input.scheduledAt,
      durationMinutes: input.durationMinutes ?? 30,
      visitType: input.visitType,
      reason: input.reason,
      insurance: input.insurance ?? appointment.insurance,
      clinicalNotes: input.notes,
      status: 'scheduled',
      checkInStatus: 'not_checked_in',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.appointments.unshift(created);
    return created;
  }

  reschedule(appointmentId: string, scheduledAt: string): Appointment {
    const idx = this.appointments.findIndex((a) => a.id === appointmentId);
    if (idx === -1) throw new Error('Appointment not found');
    const updated = {
      ...this.appointments[idx]!,
      scheduledAt,
      status: 'rescheduled' as const,
      updatedAt: new Date().toISOString(),
    };
    this.appointments[idx] = updated;
    return updated;
  }

  cancel(appointmentId: string): Appointment {
    const idx = this.appointments.findIndex((a) => a.id === appointmentId);
    if (idx === -1) throw new Error('Appointment not found');
    const updated = {
      ...this.appointments[idx]!,
      status: 'cancelled' as const,
      updatedAt: new Date().toISOString(),
    };
    this.appointments[idx] = updated;
    return updated;
  }

  checkIn(appointmentId: string): Appointment {
    const idx = this.appointments.findIndex((a) => a.id === appointmentId);
    if (idx === -1) throw new Error('Appointment not found');
    const queueLength = buildQueueFromAppointments(this.appointments).length;
    const updated = {
      ...this.appointments[idx]!,
      status: 'checked_in' as const,
      checkInStatus: 'checked_in' as const,
      queuePosition: queueLength + 1,
      updatedAt: new Date().toISOString(),
    };
    this.appointments[idx] = updated;
    return updated;
  }

  getWaitlist(): WaitlistEntry[] {
    return [...this.waitlist].sort((a, b) => a.position - b.position);
  }

  getQueue(
    filters?: AppointmentFilters,
  ): ReturnType<typeof buildQueueFromAppointments> {
    return buildQueueFromAppointments(this.getToday(filters));
  }
}

export const appointmentRepository = new AppointmentRepository();
