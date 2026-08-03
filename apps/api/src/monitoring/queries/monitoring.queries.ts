import type { MonitoringFilters } from '@medease/monitoring-contract';
import type { Prisma } from '@medease/prisma';

export function buildVitalWhere(
  tenantId: string,
  filters: MonitoringFilters = {},
): Prisma.MonitoringVitalWhereInput {
  const where: Prisma.MonitoringVitalWhereInput = { tenantId };
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.metric) where.type = filters.metric;
  if (filters.context) where.context = filters.context;
  if (filters.from || filters.to) {
    where.recordedAt = {};
    if (filters.from) where.recordedAt.gte = new Date(filters.from);
    if (filters.to) where.recordedAt.lte = new Date(filters.to);
  }
  if (filters.q) {
    where.OR = [
      { valueText: { contains: filters.q, mode: 'insensitive' } },
      { unit: { contains: filters.q, mode: 'insensitive' } },
      { recordedBy: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}

export function buildObservationWhere(
  tenantId: string,
  filters: MonitoringFilters = {},
): Prisma.MonitoringObservationWhereInput {
  const where: Prisma.MonitoringObservationWhereInput = { tenantId };
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.category) where.category = filters.category;
  if (filters.context) where.context = filters.context;
  if (filters.from || filters.to) {
    where.recordedAt = {};
    if (filters.from) where.recordedAt.gte = new Date(filters.from);
    if (filters.to) where.recordedAt.lte = new Date(filters.to);
  }
  if (filters.q) {
    where.OR = [
      { display: { contains: filters.q, mode: 'insensitive' } },
      { code: { contains: filters.q, mode: 'insensitive' } },
      { notes: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}

export function buildAlertWhere(
  tenantId: string,
  filters: MonitoringFilters = {},
): Prisma.MonitoringAlertWhereInput {
  const where: Prisma.MonitoringAlertWhereInput = { tenantId };
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.status) where.status = filters.status;
  if (filters.severity) where.severity = filters.severity;
  if (filters.metric) where.metric = filters.metric;
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) where.createdAt.lte = new Date(filters.to);
  }
  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: 'insensitive' } },
      { message: { contains: filters.q, mode: 'insensitive' } },
      { patientName: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}
