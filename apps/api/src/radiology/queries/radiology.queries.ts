import type { ReportFilters, StudyFilters } from '@medease/radiology-contract';
import type { Prisma } from '@medease/prisma';

export function buildStudyWhere(
  tenantId: string,
  filters: StudyFilters = {},
): Prisma.RadiologyStudyWhereInput {
  const where: Prisma.RadiologyStudyWhereInput = { tenantId };
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.modality) where.modality = filters.modality;
  if (filters.bodyPart) where.bodyPart = filters.bodyPart;
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.facilityId) where.facilityId = filters.facilityId;
  if (filters.radiologistId) where.radiologistId = filters.radiologistId;
  if (typeof filters.isCritical === 'boolean') {
    where.isCritical = filters.isCritical;
  }
  if (filters.q) {
    where.OR = [
      { accessionNumber: { contains: filters.q, mode: 'insensitive' } },
      { patientName: { contains: filters.q, mode: 'insensitive' } },
      { reason: { contains: filters.q, mode: 'insensitive' } },
      { clinicalIndication: { contains: filters.q, mode: 'insensitive' } },
      { modality: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}

export function buildReportWhere(
  tenantId: string,
  filters: ReportFilters = {},
): Prisma.RadiologyReportWhereInput {
  const where: Prisma.RadiologyReportWhereInput = { tenantId };
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.status) where.status = filters.status;
  if (typeof filters.isCritical === 'boolean') {
    where.isCritical = filters.isCritical;
  }
  if (filters.q) {
    where.OR = [
      { accessionNumber: { contains: filters.q, mode: 'insensitive' } },
      { title: { contains: filters.q, mode: 'insensitive' } },
      { patientName: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}
