import type { CarePlanFilters } from '@medease/care-pathways-contract';
import type { Prisma } from '@medease/prisma';

export function buildCarePlanListWhere(
  tenantId: string,
  filters: CarePlanFilters = {},
): Prisma.CarePlanWhereInput {
  const where: Prisma.CarePlanWhereInput = { tenantId };

  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.status) where.status = filters.status;
  if (filters.type) where.type = filters.type;
  if (filters.pathwayId) where.pathwayCode = filters.pathwayId;
  if (filters.admissionId) where.admissionId = filters.admissionId;
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: 'insensitive' } },
      { patientName: { contains: filters.q, mode: 'insensitive' } },
      { primaryDiagnosis: { contains: filters.q, mode: 'insensitive' } },
      { pathwayCode: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}
