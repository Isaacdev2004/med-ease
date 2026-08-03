import type { Prisma } from '@medease/prisma';
import type {
  Bed,
  BedAssignment,
  BedAssignmentStatus,
  BedStatus,
} from '@medease/beds-contract';

export function mapBedStatus(status: string): BedStatus {
  switch (status) {
    case 'available':
    case 'occupied':
    case 'reserved':
    case 'cleaning':
    case 'maintenance':
    case 'blocked':
      return status;
    default:
      return 'available';
  }
}

export function mapAssignmentStatus(status: string): BedAssignmentStatus {
  switch (status) {
    case 'assigned':
    case 'released':
    case 'transferred':
      return status;
    default:
      return 'assigned';
  }
}

export function mapBed(row: Prisma.BedGetPayload<object>): Bed {
  return {
    id: row.id,
    facilityId: row.facilityId,
    facilityName: row.facilityName,
    label: row.label,
    ward: row.ward,
    roomLabel: row.roomLabel,
    bedType: row.bedType,
    status: mapBedStatus(row.status),
    patientId: row.patientId ?? undefined,
    patientName: row.patientName ?? undefined,
    reservedUntil: row.reservedUntil?.toISOString(),
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapBedAssignment(
  row: Prisma.BedAssignmentGetPayload<object>,
): BedAssignment {
  return {
    id: row.id,
    bedId: row.bedId,
    patientId: row.patientId,
    patientName: row.patientName,
    status: mapAssignmentStatus(row.status),
    assignedAt: row.assignedAt.toISOString(),
    releasedAt: row.releasedAt?.toISOString(),
    notes: row.notes ?? undefined,
  };
}
