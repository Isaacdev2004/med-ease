import type {
  PatientFilters,
  PatientSearchFilters,
} from '@medease/patients-contract';
import { buildOrContains, type Prisma } from '@medease/prisma';

function buildPatientTextSearchOr(
  tenantId: string,
  query: string,
): Prisma.PatientWhereInput[] {
  return [
    ...buildOrContains(['fullName', 'mrn'], query),
    {
      identifiers: {
        some: {
          tenantId,
          value: { contains: query, mode: 'insensitive' },
        },
      },
    },
    {
      contacts: {
        some: {
          tenantId,
          value: { contains: query, mode: 'insensitive' },
        },
      },
    },
  ];
}

export function buildPatientListWhere(
  tenantId: string,
  filters: PatientFilters = {},
): Prisma.PatientWhereInput {
  const where: Prisma.PatientWhereInput = { tenantId };

  if (!filters.includeArchived) {
    where.deletedAt = null;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.facilityId) {
    where.facilityId = filters.facilityId;
  }

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.primaryProviderId) {
    where.primaryProviderId = filters.primaryProviderId;
  }

  if (filters.q?.trim()) {
    where.OR = buildPatientTextSearchOr(tenantId, filters.q.trim());
  }

  return where;
}

export function buildPatientSearchWhere(
  tenantId: string,
  filters: PatientSearchFilters,
): Prisma.PatientWhereInput {
  const query = filters.q.trim();
  const where = buildPatientListWhere(tenantId, filters);
  where.OR = buildPatientTextSearchOr(tenantId, query);
  return where;
}

export function buildPatientExportWhere(
  tenantId: string,
  filters: { status?: PatientFilters['status']; facilityId?: string } = {},
): Prisma.PatientWhereInput {
  const where: Prisma.PatientWhereInput = {
    tenantId,
    deletedAt: null,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.facilityId) {
    where.facilityId = filters.facilityId;
  }

  return where;
}
