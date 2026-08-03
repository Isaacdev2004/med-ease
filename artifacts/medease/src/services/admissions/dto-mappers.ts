import type { QueryParams } from '@workspace/repository-transport';
import type {
  Admission,
  AdmissionBoardResult,
  AdmissionFilters,
  AdmissionListResult,
  PatientTransfer,
  TransferFilters,
  TransferListResult,
} from '@medease/admissions-contract';

export function admissionFiltersToQuery(
  filters?: AdmissionFilters,
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    facilityId: filters.facilityId,
    patientId: filters.patientId,
    status: filters.status,
    priority: filters.priority,
    ward: filters.ward,
    q: filters.q,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

export function transferFiltersToQuery(
  filters?: TransferFilters,
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    patientId: filters.patientId,
    status: filters.status,
    fromFacilityId: filters.fromFacilityId,
    toFacilityId: filters.toFacilityId,
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

export function mapAdmission(dto: unknown): Admission {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    patientMrn: asString(row.patientMrn),
    facilityId: asString(row.facilityId),
    facilityName: asString(row.facilityName),
    ward: asString(row.ward),
    bedId: asOptionalString(row.bedId),
    bedLabel: asOptionalString(row.bedLabel),
    status: asString(row.status, 'requested') as Admission['status'],
    priority: asString(row.priority, 'routine') as Admission['priority'],
    reason: asOptionalString(row.reason),
    requestedAt: asString(row.requestedAt),
    triagedAt: asOptionalString(row.triagedAt),
    admittedAt: asOptionalString(row.admittedAt),
    dischargedAt: asOptionalString(row.dischargedAt),
    cancelledAt: asOptionalString(row.cancelledAt),
    notes: asOptionalString(row.notes),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapTransfer(dto: unknown): PatientTransfer {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    admissionId: asOptionalString(row.admissionId),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    fromFacilityId: asString(row.fromFacilityId),
    fromFacilityName: asString(row.fromFacilityName),
    fromWard: asString(row.fromWard),
    fromBedId: asOptionalString(row.fromBedId),
    toFacilityId: asString(row.toFacilityId),
    toFacilityName: asString(row.toFacilityName),
    toWard: asString(row.toWard),
    toBedId: asOptionalString(row.toBedId),
    toBedLabel: asOptionalString(row.toBedLabel),
    status: asString(row.status, 'requested') as PatientTransfer['status'],
    reason: asOptionalString(row.reason),
    requestedAt: asString(row.requestedAt),
    approvedAt: asOptionalString(row.approvedAt),
    startedAt: asOptionalString(row.startedAt),
    completedAt: asOptionalString(row.completedAt),
    cancelledAt: asOptionalString(row.cancelledAt),
    notes: asOptionalString(row.notes),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapAdmissionArray(dto: unknown): Admission[] {
  return Array.isArray(dto) ? dto.map(mapAdmission) : [];
}

export function mapTransferArray(dto: unknown): PatientTransfer[] {
  return Array.isArray(dto) ? dto.map(mapTransfer) : [];
}

export function mapPaginatedAdmissions(dto: unknown): AdmissionListResult {
  const row = asRecord(dto);
  return {
    items: mapAdmissionArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapPaginatedTransfers(dto: unknown): TransferListResult {
  const row = asRecord(dto);
  return {
    items: mapTransferArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapAdmissionBoard(dto: unknown): AdmissionBoardResult {
  const row = asRecord(dto);
  const summary = asRecord(row.summary);
  return {
    summary: {
      facilityId: asOptionalString(summary.facilityId),
      total: asNumber(summary.total),
      pending: asNumber(summary.pending),
      admitted: asNumber(summary.admitted),
      discharged: asNumber(summary.discharged),
      cancelled: asNumber(summary.cancelled),
      urgent: asNumber(summary.urgent),
    },
    admissions: mapAdmissionArray(row.admissions),
  };
}
