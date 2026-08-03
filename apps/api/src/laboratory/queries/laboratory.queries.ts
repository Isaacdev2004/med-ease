import type {
  LabOrderFilters,
  LabResultFilters,
} from '@medease/laboratory-contract';
import type { Prisma } from '@medease/prisma';

export function buildLabOrderWhere(
  tenantId: string,
  filters: LabOrderFilters = {},
): Prisma.LabOrderWhereInput {
  const where: Prisma.LabOrderWhereInput = { tenantId };
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.facilityId) where.facilityId = filters.facilityId;
  if (filters.laboratoryId) where.laboratoryId = filters.laboratoryId;
  if (filters.carePlanId) where.carePlanId = filters.carePlanId;
  if (filters.q) {
    where.OR = [
      { orderNumber: { contains: filters.q, mode: 'insensitive' } },
      { patientName: { contains: filters.q, mode: 'insensitive' } },
      { clinicalIndication: { contains: filters.q, mode: 'insensitive' } },
      { laboratoryName: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}

export function buildLabResultWhere(
  tenantId: string,
  filters: LabResultFilters = {},
): Prisma.LabDiagnosticReportWhereInput {
  const where: Prisma.LabDiagnosticReportWhereInput = { tenantId };
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.status) where.status = filters.status;
  if (filters.category) where.category = filters.category;
  if (filters.q) {
    where.OR = [
      { reportNumber: { contains: filters.q, mode: 'insensitive' } },
      { title: { contains: filters.q, mode: 'insensitive' } },
      { patientName: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}
