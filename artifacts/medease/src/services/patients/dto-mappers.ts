import type {
  ExportResult,
  PaginatedResult,
  Patient,
  PatientAddress,
  PatientAllergy,
  PatientContact,
  PatientEmergencyContact,
  PatientFilters,
  PatientIdentifier,
  PatientPreference,
  PatientSearchFilters,
  PatientStatus,
} from '@medease/patients-contract';

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function asPatientStatus(value: unknown, fallback: PatientStatus = 'active'): PatientStatus {
  const status = asString(value, fallback);
  return status === 'inactive' || status === 'observation' ? status : 'active';
}

function asCommunication(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

export function mapPatientDto(dto: unknown): Patient {
  const raw = asRecord(dto);
  return {
    patientId: asString(raw.patientId),
    tenantId: asString(raw.tenantId),
    facilityId: asOptionalString(raw.facilityId),
    userId: asOptionalString(raw.userId),
    mrn: asString(raw.mrn),
    fullName: asString(raw.fullName),
    dateOfBirth: asString(raw.dateOfBirth),
    gender:
      raw.gender === 'male' || raw.gender === 'female' || raw.gender === 'other' || raw.gender === 'unknown'
        ? raw.gender
        : undefined,
    status: asPatientStatus(raw.status),
    primaryProviderId: asOptionalString(raw.primaryProviderId),
    fhirResourceId: asString(raw.fhirResourceId),
    createdBy: asString(raw.createdBy),
    updatedBy: asOptionalString(raw.updatedBy),
    createdAt: asString(raw.createdAt),
    updatedAt: asString(raw.updatedAt),
    deletedAt: asOptionalString(raw.deletedAt),
    version: asNumber(raw.version, 1),
  };
}

export function mapPatientIdentifierDto(dto: unknown): PatientIdentifier {
  const raw = asRecord(dto);
  return {
    identifierId: asString(raw.identifierId),
    tenantId: asString(raw.tenantId),
    patientId: asString(raw.patientId),
    type: asString(raw.type) as PatientIdentifier['type'],
    value: asString(raw.value),
    system: asOptionalString(raw.system),
    isPrimary: asBoolean(raw.isPrimary),
    createdAt: asString(raw.createdAt),
    updatedAt: asString(raw.updatedAt),
  };
}

export function mapPatientContactDto(dto: unknown): PatientContact {
  const raw = asRecord(dto);
  return {
    contactId: asString(raw.contactId),
    tenantId: asString(raw.tenantId),
    patientId: asString(raw.patientId),
    type: asString(raw.type) as PatientContact['type'],
    value: asString(raw.value),
    isPrimary: asBoolean(raw.isPrimary),
    createdAt: asString(raw.createdAt),
    updatedAt: asString(raw.updatedAt),
  };
}

export function mapPatientAddressDto(dto: unknown): PatientAddress {
  const raw = asRecord(dto);
  return {
    addressId: asString(raw.addressId),
    tenantId: asString(raw.tenantId),
    patientId: asString(raw.patientId),
    type: asString(raw.type) as PatientAddress['type'],
    street: asString(raw.street),
    city: asString(raw.city),
    state: asOptionalString(raw.state),
    postalCode: asString(raw.postalCode),
    country: asString(raw.country),
    isPrimary: asBoolean(raw.isPrimary),
    createdAt: asString(raw.createdAt),
    updatedAt: asString(raw.updatedAt),
  };
}

export function mapPatientEmergencyContactDto(dto: unknown): PatientEmergencyContact {
  const raw = asRecord(dto);
  return {
    emergencyContactId: asString(raw.emergencyContactId),
    tenantId: asString(raw.tenantId),
    patientId: asString(raw.patientId),
    name: asString(raw.name),
    relationship: asString(raw.relationship),
    phone: asString(raw.phone),
    email: asOptionalString(raw.email),
    isPrimary: asBoolean(raw.isPrimary),
    createdAt: asString(raw.createdAt),
    updatedAt: asString(raw.updatedAt),
  };
}

export function mapPatientAllergyDto(dto: unknown): PatientAllergy {
  const raw = asRecord(dto);
  return {
    allergyId: asString(raw.allergyId),
    tenantId: asString(raw.tenantId),
    patientId: asString(raw.patientId),
    allergen: asString(raw.allergen),
    type: asString(raw.type) as PatientAllergy['type'],
    severity: asString(raw.severity) as PatientAllergy['severity'],
    reaction: asOptionalString(raw.reaction),
    notedAt: asString(raw.notedAt),
    createdAt: asString(raw.createdAt),
    updatedAt: asString(raw.updatedAt),
  };
}

export function mapPatientPreferenceDto(dto: unknown): PatientPreference {
  const raw = asRecord(dto);
  return {
    preferenceId: asString(raw.preferenceId),
    tenantId: asString(raw.tenantId),
    patientId: asString(raw.patientId),
    language: asString(raw.language),
    maritalStatus: asOptionalString(raw.maritalStatus),
    occupation: asOptionalString(raw.occupation),
    nationality: asOptionalString(raw.nationality),
    smoking: asOptionalString(raw.smoking),
    communication: asCommunication(raw.communication),
    createdAt: asString(raw.createdAt),
    updatedAt: asString(raw.updatedAt),
  };
}

export function mapExportResultDto(dto: unknown): ExportResult {
  const raw = asRecord(dto);
  const format = asString(raw.format, 'csv');
  return {
    format: format === 'pdf' || format === 'xlsx' ? format : 'csv',
    exportedAt: asString(raw.exportedAt),
    recordCount: asNumber(raw.recordCount),
  };
}

export function mapPaginatedDto<T>(dto: unknown, mapItem: (item: unknown) => T): PaginatedResult<T> {
  const raw = asRecord(dto);
  const items = Array.isArray(raw.items) ? raw.items.map(mapItem) : [];
  return {
    items,
    total: asNumber(raw.total, items.length),
    page: asNumber(raw.page, 1),
    pageSize: asNumber(raw.pageSize, items.length || 25),
  };
}

export function mapArrayDto<T>(dto: unknown, mapItem: (item: unknown) => T): T[] {
  return Array.isArray(dto) ? dto.map(mapItem) : [];
}

export function filtersToQuery(filters?: PatientFilters | PatientSearchFilters) {
  return filters as Record<string, string | number | boolean | null | undefined> | undefined;
}
