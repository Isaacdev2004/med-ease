import type {
  Appointment,
  PatientAppointmentSummary,
  PatientDashboardData,
} from '@/features/patient/types';
import { useApiAuth } from '@/services/auth/auth-service';
import { getPatientIdForUser } from '@/services/patient-records/mock-data';
import { patientsService } from '@/services/patients';
import type { Appointment as ApiAppointment } from '@/services/appointments/types';

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

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function mapAppointmentSummary(
  appointment: ApiAppointment,
): PatientAppointmentSummary {
  return {
    id: appointment.id,
    providerName: appointment.provider.fullName,
    specialty: appointment.specialty,
    scheduledAt: appointment.scheduledAt,
    location: `${appointment.facility.name}${appointment.room ? `, ${appointment.room}` : ''}`,
  };
}

function mapAppointment(appointment: ApiAppointment): Appointment {
  return {
    id: appointment.id,
    patientId: appointment.patient.id,
    providerName: appointment.provider.fullName,
    specialty: appointment.specialty,
    scheduledAt: appointment.scheduledAt,
    location: `${appointment.facility.name}${appointment.room ? `, ${appointment.room}` : ''}`,
    status:
      appointment.status === 'completed'
        ? 'completed'
        : appointment.status === 'cancelled'
          ? 'cancelled'
          : 'scheduled',
  };
}

async function resolveClinicalPatientId(authUserId: string): Promise<string | null> {
  if (useApiAuth) {
    try {
      const result = await patientsService.listPatients({
        userId: authUserId,
        page: 1,
        pageSize: 1,
      });
      const patientId = result.items[0]?.patientId;
      if (patientId) {
        return patientId;
      }
    } catch {
      // Fall back to mock resolver below.
    }
  }

  return getPatientIdForUser(authUserId);
}

function emptyDashboard(
  patientId: string,
  greetingName = 'there',
): PatientDashboardData {
  return {
    patientId,
    greetingName,
    nextAppointment: null,
    recentTestLabel: 'Lab results will appear here when available.',
    medications: [],
  };
}

/** Patient domain API — live Supabase data when API auth is enabled. */
export const patientService = {
  async getDashboard(authUserId: string): Promise<PatientDashboardData> {
    const clinicalPatientId = await resolveClinicalPatientId(authUserId);
    if (!clinicalPatientId) {
      if (!useApiAuth) {
        return delay({ ...demoDashboard, patientId: authUserId });
      }
      return emptyDashboard(authUserId);
    }

    if (!useApiAuth) {
      return delay({ ...demoDashboard, patientId: clinicalPatientId });
    }

    const { appointmentService } =
      await import('@/services/appointments/appointment.service');
    const { medicationService } =
      await import('@/services/medications/medication.service');
    const { laboratoryService } =
      await import('@/services/laboratory/laboratory.service');

    const [patient, upcoming, medications, laboratory] = await Promise.all([
      patientsService.getPatient(clinicalPatientId),
      appointmentService.getUpcoming({ patientId: clinicalPatientId }),
      medicationService
        .getMedications({ patientId: clinicalPatientId, status: 'active' })
        .catch(() => []),
      laboratoryService
        .getPatientLaboratory(clinicalPatientId)
        .catch(() => null),
    ]);

    const nextAppointment = upcoming[0]
      ? mapAppointmentSummary(upcoming[0])
      : null;
    const recentObservation = laboratory?.observations[0];

    return {
      patientId: clinicalPatientId,
      greetingName: firstName(patient.fullName),
      nextAppointment,
      recentTestLabel: recentObservation
        ? `${recentObservation.testName}: ${recentObservation.value} ${recentObservation.unit}`
        : 'Lab results will appear here when available.',
      medications: medications.slice(0, 5).map((med) => ({
        id: med.id,
        name: med.name,
        dosage: med.dose || med.strength,
        schedule: med.instructions || med.frequency,
        refillsRemaining: med.refillsRemaining,
      })),
    };
  },

  async getAppointments(authUserId: string): Promise<Appointment[]> {
    const { appointmentService } =
      await import('@/services/appointments/appointment.service');
    const clinicalPatientId = await resolveClinicalPatientId(authUserId);
    if (!clinicalPatientId) {
      return [];
    }

    const list = await appointmentService.getUpcoming({
      patientId: clinicalPatientId,
    });
    return list.map(mapAppointment);
  },

  async rescheduleAppointment(
    appointmentId: string,
    scheduledAt: string,
  ): Promise<Appointment> {
    const { appointmentService } =
      await import('@/services/appointments/appointment.service');

    if (useApiAuth) {
      const updated = await appointmentService.reschedule(appointmentId, {
        scheduledAt,
      });
      return mapAppointment(updated);
    }

    const dashboard = await this.getDashboard('user-patient');
    if (
      !dashboard.nextAppointment ||
      dashboard.nextAppointment.id !== appointmentId
    ) {
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
