import type {
  Appointment,
  CalendarEvent,
  AppointmentStatus,
} from '@/services/appointments/types';

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  scheduled: '#3b82f6',
  confirmed: '#2563eb',
  checked_in: '#8b5cf6',
  in_progress: '#f59e0b',
  completed: '#22c55e',
  cancelled: '#94a3b8',
  no_show: '#ef4444',
  rescheduled: '#6366f1',
  waiting: '#eab308',
  delayed: '#f97316',
};

export function toFhirAppointmentReference(appointment: Appointment) {
  return {
    resourceType: 'Appointment' as const,
    id: appointment.id,
    status: appointment.status,
    start: appointment.scheduledAt,
    minutesDuration: appointment.durationMinutes,
    participant: [
      {
        actor: { reference: `Patient/${appointment.patient.id}` },
        status: 'accepted',
      },
      {
        actor: { reference: `Practitioner/${appointment.provider.id}` },
        status: 'accepted',
      },
    ],
  };
}

export function toFhirScheduleReference(
  providerId: string,
  facilityId: string,
) {
  return {
    resourceType: 'Schedule' as const,
    id: `schedule-${providerId}-${facilityId}`,
    actor: [{ reference: `Practitioner/${providerId}` }],
  };
}

export function toFhirSlotReference(
  slotId: string,
  start: string,
  end: string,
) {
  return {
    resourceType: 'Slot' as const,
    id: slotId,
    start,
    end,
    status: 'free' as const,
  };
}

export function appointmentToCalendarEvent(
  appointment: Appointment,
): CalendarEvent {
  const start = new Date(appointment.scheduledAt);
  const end = new Date(start.getTime() + appointment.durationMinutes * 60_000);
  return {
    id: `evt-${appointment.id}`,
    appointmentId: appointment.id,
    title: `${appointment.patient.fullName} — ${appointment.specialty}`,
    start: start.toISOString(),
    end: end.toISOString(),
    status: appointment.status,
    visitType: appointment.visitType,
    color: STATUS_COLORS[appointment.status],
    providerId: appointment.provider.id,
    patientId: appointment.patient.id,
    facilityId: appointment.facility.id,
  };
}

export function mapAppointmentsToCalendarEvents(
  appointments: Appointment[],
): CalendarEvent[] {
  return appointments.map(appointmentToCalendarEvent);
}
