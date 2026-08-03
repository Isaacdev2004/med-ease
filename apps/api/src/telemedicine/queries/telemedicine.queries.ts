import type { TelemedicineFilters } from '@medease/telemedicine-contract';
import type { Prisma } from '@medease/prisma';

export function buildSessionWhere(
  tenantId: string,
  filters: TelemedicineFilters = {},
): Prisma.TelemedicineSessionWhereInput {
  const where: Prisma.TelemedicineSessionWhereInput = { tenantId };
  if (filters.patientId) where.patientId = filters.patientId;
  if (filters.clinicianId) where.clinicianId = filters.clinicianId;
  if (filters.facilityId) where.facilityId = filters.facilityId;
  if (filters.status) where.status = filters.status;
  if (filters.from || filters.to) {
    where.scheduledStart = {};
    if (filters.from) where.scheduledStart.gte = new Date(filters.from);
    if (filters.to) where.scheduledStart.lte = new Date(filters.to);
  }
  if (filters.q) {
    where.OR = [
      { patientName: { contains: filters.q, mode: 'insensitive' } },
      { clinicianName: { contains: filters.q, mode: 'insensitive' } },
      { specialty: { contains: filters.q, mode: 'insensitive' } },
      { meetingNumber: { contains: filters.q, mode: 'insensitive' } },
    ];
  }
  return where;
}
