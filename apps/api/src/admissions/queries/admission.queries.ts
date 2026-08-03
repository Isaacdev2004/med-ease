import type {
  AdmissionFilters,
  TransferFilters,
} from '@medease/admissions-contract';
import type { Prisma } from '@medease/prisma';

export function buildAdmissionListWhere(
  tenantId: string,
  filters: AdmissionFilters = {},
): Prisma.AdmissionWhereInput {
  const where: Prisma.AdmissionWhereInput = { tenantId };

  if (filters.facilityId) where.facilityId = filters.facilityId;
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.ward) {
    where.ward = { contains: filters.ward, mode: 'insensitive' };
  }
  if (filters.q) {
    where.OR = [
      { patientName: { contains: filters.q, mode: 'insensitive' } },
      { patientMrn: { contains: filters.q, mode: 'insensitive' } },
      { ward: { contains: filters.q, mode: 'insensitive' } },
      { facilityName: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

export function buildTransferListWhere(
  tenantId: string,
  filters: TransferFilters = {},
): Prisma.PatientTransferWhereInput {
  const where: Prisma.PatientTransferWhereInput = { tenantId };

  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.status) where.status = filters.status;
  if (filters.fromFacilityId) where.fromFacilityId = filters.fromFacilityId;
  if (filters.toFacilityId) where.toFacilityId = filters.toFacilityId;
  if (filters.q) {
    where.OR = [
      { patientName: { contains: filters.q, mode: 'insensitive' } },
      { fromWard: { contains: filters.q, mode: 'insensitive' } },
      { toWard: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}
