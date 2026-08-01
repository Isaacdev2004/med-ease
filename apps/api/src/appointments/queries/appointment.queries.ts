import type { AppointmentFilters } from '@medease/appointments-contract';
import { buildOrContains, type Prisma } from '@medease/prisma';

const TERMINAL_STATUSES: Prisma.EnumAppointmentStatusFilter['in'] = [
  'cancelled',
  'completed',
  'no_show',
];

function applyCommonFilters(
  where: Prisma.AppointmentWhereInput,
  filters: AppointmentFilters = {},
): Prisma.AppointmentWhereInput {
  if (filters.patientId) {
    where.patientId = filters.patientId;
  }

  if (filters.providerId) {
    where.providerId = filters.providerId;
  }

  if (filters.facilityId) {
    where.facilityId = filters.facilityId;
  }

  if (filters.department) {
    where.department = filters.department;
  }

  if (filters.specialty) {
    where.specialty = filters.specialty;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.visitType) {
    where.visitType = filters.visitType;
  }

  if (filters.priority) {
    where.priority = filters.priority;
  }

  if (filters.telemedicine !== undefined) {
    where.visitType = filters.telemedicine ? 'telemedicine' : { not: 'telemedicine' };
  }

  if (filters.checkedIn !== undefined) {
    where.checkInStatus = filters.checkedIn
      ? { not: 'not_checked_in' }
      : 'not_checked_in';
  }

  if (filters.followUp !== undefined) {
    where.followUpRequired = filters.followUp;
  }

  if (filters.dateFrom || filters.dateTo) {
    where.scheduledAt = {
      ...(filters.dateFrom ? { gte: new Date(filters.dateFrom) } : {}),
      ...(filters.dateTo ? { lte: new Date(filters.dateTo) } : {}),
    };
  }

  if (filters.q?.trim()) {
    const q = filters.q.trim();
    where.OR = [
      ...buildOrContains(
        [
          'patientFullName',
          'patientMrn',
          'providerFullName',
          'facilityName',
          'specialty',
          'reason',
        ],
        q,
      ),
      { id: { contains: q, mode: 'insensitive' } },
    ];
  }

  return where;
}

export function buildAppointmentListWhere(
  tenantId: string,
  filters: AppointmentFilters = {},
): Prisma.AppointmentWhereInput {
  return applyCommonFilters({ tenantId }, filters);
}

export function buildUpcomingWhere(
  tenantId: string,
  filters: AppointmentFilters = {},
): Prisma.AppointmentWhereInput {
  const now = new Date();
  return applyCommonFilters(
    {
      tenantId,
      scheduledAt: { gte: now },
      status: { notIn: TERMINAL_STATUSES },
    },
    filters,
  );
}

export function buildPastWhere(
  tenantId: string,
  filters: AppointmentFilters = {},
): Prisma.AppointmentWhereInput {
  const now = new Date();
  return applyCommonFilters(
    {
      tenantId,
      OR: [{ scheduledAt: { lt: now } }, { status: { in: TERMINAL_STATUSES } }],
    },
    filters,
  );
}

export function buildTodayWhere(
  tenantId: string,
  filters: AppointmentFilters = {},
): Prisma.AppointmentWhereInput {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return applyCommonFilters(
    {
      tenantId,
      scheduledAt: { gte: today, lt: tomorrow },
    },
    filters,
  );
}

export function buildTelemedicineWhere(
  tenantId: string,
  filters: AppointmentFilters = {},
): Prisma.AppointmentWhereInput {
  return applyCommonFilters(
    {
      tenantId,
      visitType: 'telemedicine',
    },
    filters,
  );
}
