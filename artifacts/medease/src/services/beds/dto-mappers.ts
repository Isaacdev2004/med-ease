import type { QueryParams } from '@workspace/repository-transport';
import type {
  Bed,
  BedAssignment,
  BedBoardResult,
  BedFilters,
  BedListResult,
} from '@medease/beds-contract';

export function filtersToQuery(filters?: BedFilters): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    facilityId: filters.facilityId,
    ward: filters.ward,
    status: filters.status,
    patientId: filters.patientId,
    q: filters.q,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export function mapBed(dto: unknown): Bed {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    facilityId: asString(row.facilityId),
    facilityName: asString(row.facilityName),
    label: asString(row.label),
    ward: asString(row.ward),
    roomLabel: asString(row.roomLabel),
    bedType: asString(row.bedType, 'standard'),
    status: asString(row.status, 'available') as Bed['status'],
    patientId: asOptionalString(row.patientId),
    patientName: asOptionalString(row.patientName),
    reservedUntil: asOptionalString(row.reservedUntil),
    notes: asOptionalString(row.notes),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapArray(dto: unknown): Bed[] {
  return Array.isArray(dto) ? dto.map(mapBed) : [];
}

export function mapPaginated(dto: unknown): BedListResult {
  const row = asRecord(dto);
  return {
    items: mapArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapBoard(dto: unknown): BedBoardResult {
  const row = asRecord(dto);
  const summary = asRecord(row.summary);
  return {
    summary: {
      facilityId: asOptionalString(summary.facilityId),
      total: asNumber(summary.total),
      available: asNumber(summary.available),
      occupied: asNumber(summary.occupied),
      reserved: asNumber(summary.reserved),
      cleaning: asNumber(summary.cleaning),
      maintenance: asNumber(summary.maintenance),
      blocked: asNumber(summary.blocked),
      occupancyPercent: asNumber(summary.occupancyPercent),
    },
    beds: mapArray(row.beds),
  };
}

export function mapAssignment(dto: unknown): BedAssignment {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    bedId: asString(row.bedId),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    status: asString(row.status, 'assigned') as BedAssignment['status'],
    assignedAt: asString(row.assignedAt),
    releasedAt: asOptionalString(row.releasedAt),
    notes: asOptionalString(row.notes),
  };
}

export function mapAssignments(dto: unknown): BedAssignment[] {
  return Array.isArray(dto) ? dto.map(mapAssignment) : [];
}
