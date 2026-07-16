import type {
  Appointment,
  PatientDashboardData,
} from '@/features/patient/types';

const DEMO_DELAY_MS = 350;

function delay<T>(value: T, ms = DEMO_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), ms);
  });
}

const demoDashboard: PatientDashboardData = {
  patientId: 'user-patient',
  greetingName: 'Sarah',
  nextAppointment: {
    id: 'appt-001',
    providerName: 'Dr. Emily Chen',
    specialty: 'Cardiology',
    scheduledAt: new Date(Date.now() + 86_400_000).toISOString(),
    location: 'Mount Sinai Main Campus, Room 402',
  },
  recentTestLabel: 'Comprehensive Metabolic Panel',
  medications: [
    {
      id: 'med-001',
      name: 'Atorvastatin',
      dosage: '20mg',
      schedule: 'Take 1 pill daily at bedtime',
      refillsRemaining: 12,
    },
  ],
};

/** Patient domain API — replace internals with generated client / Supabase when ready. */
export const patientService = {
  async getDashboard(patientId: string): Promise<PatientDashboardData> {
    return delay({ ...demoDashboard, patientId });
  },

  async getAppointments(patientId: string): Promise<Appointment[]> {
    const { appointmentService } = await import('@/services/appointments/appointment.service');
    const phrId = await appointmentService.resolvePatientId(patientId, undefined);
    const list = await appointmentService.getUpcoming({ patientId: phrId ?? 'phr-001' });
    return list.map((a) => ({
      id: a.id,
      patientId: a.patient.id,
      providerName: a.provider.fullName,
      specialty: a.specialty,
      scheduledAt: a.scheduledAt,
      location: `${a.facility.name}, ${a.room}`,
      status: a.status === 'completed' ? 'completed' : a.status === 'cancelled' ? 'cancelled' : 'scheduled',
    }));
  },

  async rescheduleAppointment(
    appointmentId: string,
    scheduledAt: string,
  ): Promise<Appointment> {
    const dashboard = await this.getDashboard('user-patient');
    if (!dashboard.nextAppointment || dashboard.nextAppointment.id !== appointmentId) {
      throw new Error('Appointment not found');
    }

    return delay({
      id: appointmentId,
      patientId: dashboard.patientId,
      providerName: dashboard.nextAppointment.providerName,
      specialty: dashboard.nextAppointment.specialty,
      scheduledAt,
      location: dashboard.nextAppointment.location,
      status: 'scheduled',
    });
  },
};
