import type { BedFilters } from '@medease/beds-contract';
import type { Prisma } from '@medease/prisma';

export function buildBedListWhere(
  tenantId: string,
  filters: BedFilters = {},
): Prisma.BedWhereInput {
  const where: Prisma.BedWhereInput = { tenantId };

  if (filters.facilityId) where.facilityId = filters.facilityId;
  if (filters.ward) {
    where.ward = { contains: filters.ward, mode: 'insensitive' };
  }
  if (filters.status) where.status = filters.status;
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.q) {
    where.OR = [
      { label: { contains: filters.q, mode: 'insensitive' } },
      { ward: { contains: filters.q, mode: 'insensitive' } },
      { roomLabel: { contains: filters.q, mode: 'insensitive' } },
      { patientName: { contains: filters.q, mode: 'insensitive' } },
      { facilityName: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}
