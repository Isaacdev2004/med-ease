import type { Prisma } from '@medease/prisma';
import type {
  Appointment as AppointmentContract,
  AppointmentStatus,
  AppointmentPriority,
  CheckInStatus,
  VisitType,
} from '@medease/appointments-contract';

export function mapAppointmentStatus(status: string): AppointmentStatus {
  switch (status) {
    case 'scheduled':
    case 'confirmed':
    case 'checked_in':
    case 'in_progress':
    case 'completed':
    case 'cancelled':
    case 'no_show':
      return status;
    default:
      return 'scheduled';
  }
}

export function mapVisitType(visitType: string): VisitType {
  switch (visitType) {
    case 'in_person':
    case 'telemedicine':
    case 'home_care':
    case 'laboratory':
    case 'radiology':
    case 'pharmacy':
    case 'follow_up':
      return visitType;
    default:
      return 'in_person';
  }
}

export function mapPriority(priority: string): AppointmentPriority {
  switch (priority) {
    case 'routine':
    case 'urgent':
    case 'emergency':
      return priority;
    default:
      return 'routine';
  }
}

export function mapCheckInStatus(status: string): CheckInStatus {
  switch (status) {
    case 'not_checked_in':
    case 'checked_in':
    case 'in_waiting_room':
    case 'with_provider':
      return status;
    default:
      return 'not_checked_in';
  }
}

export function mapAppointment(
  row: Prisma.AppointmentGetPayload<object>,
): AppointmentContract {
  return {
    id: row.id,
    patient: {
      id: row.patientId,
      fullName: row.patientFullName,
      mrn: row.patientMrn,
    },
    provider: {
      id: row.providerId,
      fullName: row.providerFullName,
      specialty: row.providerSpecialty ?? row.specialty ?? '',
      department: row.providerDepartment ?? row.department ?? '',
    },
    facility: {
      id: row.facilityId,
      name: row.facilityName,
      address: row.facilityAddress ?? '',
    },
    department: row.department ?? row.providerDepartment ?? '',
    specialty: row.specialty ?? row.providerSpecialty ?? '',
    room: row.room ?? '',
    scheduledAt: row.scheduledAt.toISOString(),
    durationMinutes: row.durationMinutes,
    status: mapAppointmentStatus(row.status),
    visitType: mapVisitType(row.visitType),
    priority: mapPriority(row.priority),
    insurance: row.insurance ?? '',
    reason: row.reason ?? '',
    clinicalNotes: row.notes ?? undefined,
    followUpRequired: row.followUpRequired,
    referralId: row.referralId ?? undefined,
    checkInStatus: mapCheckInStatus(row.checkInStatus),
    queuePosition: row.queuePosition ?? undefined,
    telehealthLink: row.telehealthLink ?? undefined,
    isRecurring: row.isRecurring,
    recurringPattern: row.recurringPattern ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
