import type {
  Appointment,
  PatientAppointmentSummary,
  PatientDashboardData,
} from '@/features/patient/types';
import { getPatientIdForUser } from '@/services/patient-records/mock-data';
import { patientsService } from '@/services/patients';
import { resolveClinicalPatientId } from '@/services/patients/resolve-patient-id';
import type { Appointment as ApiAppointment } from '@/services/appointments/types';

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

/** Patient domain API — always prefers live Supabase/API data. */
export const patientService = {
  async getDashboard(authUserId: string): Promise<PatientDashboardData> {
    const clinicalPatientId = await resolveClinicalPatientId(authUserId, {
      demoFallback: getPatientIdForUser,
    });
    if (!clinicalPatientId) {
      return emptyDashboard(authUserId);
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
    const recentResult = laboratory?.results[0];
    const recentObservation = laboratory?.observations[0];

    return {
      patientId: clinicalPatientId,
      greetingName: firstName(patient.fullName),
      nextAppointment,
      recentTestLabel: recentObservation
        ? `${recentObservation.testName}: ${recentObservation.value} ${recentObservation.unit}`
        : recentResult
          ? `${recentResult.title} (${recentResult.status})`
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
    const clinicalPatientId = await resolveClinicalPatientId(authUserId, {
      demoFallback: getPatientIdForUser,
    });
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

    const updated = await appointmentService.reschedule(appointmentId, {
      scheduledAt,
    });
    return mapAppointment(updated);
  },
};
