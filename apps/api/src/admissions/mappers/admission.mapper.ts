import type { Prisma } from '@medease/prisma';
import type {
  Admission,
  AdmissionPriority,
  AdmissionStatus,
  PatientTransfer,
  TransferStatus,
} from '@medease/admissions-contract';

export function mapAdmissionStatus(status: string): AdmissionStatus {
  switch (status) {
    case 'requested':
    case 'triaged':
    case 'bed_assigned':
    case 'admitted':
    case 'cancelled':
    case 'discharged':
      return status;
    default:
      return 'requested';
  }
}

export function mapPriority(priority: string): AdmissionPriority {
  switch (priority) {
    case 'routine':
    case 'urgent':
    case 'emergency':
      return priority;
    default:
      return 'routine';
  }
}

export function mapTransferStatus(status: string): TransferStatus {
  switch (status) {
    case 'requested':
    case 'approved':
    case 'in_transit':
    case 'completed':
    case 'cancelled':
      return status;
    default:
      return 'requested';
  }
}

export function mapAdmission(
  row: Prisma.AdmissionGetPayload<object>,
): Admission {
  return {
    id: row.id,
    patientId: row.patientId,
    patientName: row.patientName,
    patientMrn: row.patientMrn,
    facilityId: row.facilityId,
    facilityName: row.facilityName,
    ward: row.ward,
    bedId: row.bedId ?? undefined,
    bedLabel: row.bedLabel ?? undefined,
    status: mapAdmissionStatus(row.status),
    priority: mapPriority(row.priority),
    reason: row.reason ?? undefined,
    requestedAt: row.requestedAt.toISOString(),
    triagedAt: row.triagedAt?.toISOString(),
    admittedAt: row.admittedAt?.toISOString(),
    dischargedAt: row.dischargedAt?.toISOString(),
    cancelledAt: row.cancelledAt?.toISOString(),
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapTransfer(
  row: Prisma.PatientTransferGetPayload<object>,
): PatientTransfer {
  return {
    id: row.id,
    admissionId: row.admissionId ?? undefined,
    patientId: row.patientId,
    patientName: row.patientName,
    fromFacilityId: row.fromFacilityId,
    fromFacilityName: row.fromFacilityName,
    fromWard: row.fromWard,
    fromBedId: row.fromBedId ?? undefined,
    toFacilityId: row.toFacilityId,
    toFacilityName: row.toFacilityName,
    toWard: row.toWard,
    toBedId: row.toBedId ?? undefined,
    toBedLabel: row.toBedLabel ?? undefined,
    status: mapTransferStatus(row.status),
    reason: row.reason ?? undefined,
    requestedAt: row.requestedAt.toISOString(),
    approvedAt: row.approvedAt?.toISOString(),
    startedAt: row.startedAt?.toISOString(),
    completedAt: row.completedAt?.toISOString(),
    cancelledAt: row.cancelledAt?.toISOString(),
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
