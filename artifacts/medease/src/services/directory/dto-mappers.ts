import type { QueryParams } from '@workspace/repository-transport';
import type { HealthcareStatus } from '@/config/design-tokens';
import type {
  DirectoryAddress,
  DirectoryFilters,
  DirectoryProvider,
  DirectorySearchResult,
  DirectoryStats,
  ProviderType,
} from '@/services/directory/directory.types';

const PROVIDER_TYPES = new Set<ProviderType>([
  'professional',
  'facility',
  'pharmacy',
  'transport',
  'nursing_home',
  'medical_center',
]);

const HEALTHCARE_STATUSES = new Set<HealthcareStatus>([
  'critical',
  'stable',
  'observation',
  'discharged',
  'transferred',
  'pending',
  'success',
  'warning',
  'error',
  'info',
  'neutral',
]);

export function directoryFiltersToQuery(
  filters?: DirectoryFilters,
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    q: filters.q,
    type: filters.type,
    specialty: filters.specialty,
    department: filters.department,
    city: filters.city,
    postalCode: filters.postalCode,
    distanceMax: filters.distanceMax,
    teleconsultation: filters.teleconsultation,
    emergency: filters.emergency,
    openNow: filters.openNow,
    favoritesOnly: filters.favoritesOnly,
    sort: filters.sort,
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

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : [];
}

function asOptionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((v): v is string => typeof v === 'string');
}

function asProviderType(value: unknown): ProviderType {
  const raw = asString(value);
  return PROVIDER_TYPES.has(raw as ProviderType)
    ? (raw as ProviderType)
    : 'facility';
}

function asHealthcareStatus(value: unknown): HealthcareStatus {
  const raw = asString(value);
  return HEALTHCARE_STATUSES.has(raw as HealthcareStatus)
    ? (raw as HealthcareStatus)
    : 'stable';
}

function asOpeningHours(
  value: unknown,
): Record<string, string> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const out: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === 'string') out[key] = entry;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function mapAddress(dto: unknown): DirectoryAddress {
  const row = asRecord(dto);
  return {
    street: asString(row.street),
    city: asString(row.city),
    department: asString(row.department),
    postalCode: asString(row.postalCode),
    country: asString(row.country, 'France'),
    latitude: asOptionalNumber(row.latitude),
    longitude: asOptionalNumber(row.longitude),
  };
}

export function mapDirectoryProvider(dto: unknown): DirectoryProvider {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    finessNumber: asOptionalString(row.finessNumber),
    type: asProviderType(row.type),
    name: asString(row.name),
    title: asOptionalString(row.title),
    specialty: asOptionalString(row.specialty),
    medicalSpecialty: asOptionalString(row.medicalSpecialty),
    facilityType: asOptionalString(row.facilityType),
    address: mapAddress(row.address),
    distanceKm: asOptionalNumber(row.distanceKm),
    phone: asOptionalString(row.phone),
    email: asOptionalString(row.email),
    website: asOptionalString(row.website),
    availability: asOptionalString(row.availability),
    status: asHealthcareStatus(row.status),
    languages: asStringArray(row.languages),
    insuranceAccepted: asOptionalStringArray(row.insuranceAccepted),
    teleconsultation:
      typeof row.teleconsultation === 'boolean'
        ? row.teleconsultation
        : undefined,
    emergencyServices:
      typeof row.emergencyServices === 'boolean'
        ? row.emergencyServices
        : undefined,
    accessibility: asOptionalStringArray(row.accessibility),
    openingHours: asOpeningHours(row.openingHours),
    services: asOptionalStringArray(row.services),
    qualifications: asOptionalStringArray(row.qualifications),
    associatedFacilityIds: asOptionalStringArray(row.associatedFacilityIds),
    relatedProfessionalIds: asOptionalStringArray(row.relatedProfessionalIds),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapDirectoryProviderArray(dto: unknown): DirectoryProvider[] {
  return Array.isArray(dto) ? dto.map(mapDirectoryProvider) : [];
}

export function mapDirectorySearchResult(dto: unknown): DirectorySearchResult {
  const row = asRecord(dto);
  const facets = asRecord(row.facets);
  return {
    items: mapDirectoryProviderArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 12),
    facets: {
      specialties: asStringArray(facets.specialties),
      departments: asStringArray(facets.departments),
      cities: asStringArray(facets.cities),
    },
  };
}

export function mapDirectoryStats(dto: unknown): DirectoryStats {
  const row = asRecord(dto);
  return {
    total: asNumber(row.total),
    professionals: asNumber(row.professionals),
    facilities: asNumber(row.facilities),
    pharmacies: asNumber(row.pharmacies),
    transport: asNumber(row.transport),
    favorites: asNumber(row.favorites),
  };
}

export function mapStringArray(dto: unknown): string[] {
  return asStringArray(dto);
}

export function mapToggleFavorite(dto: unknown): boolean {
  return asBoolean(asRecord(dto).isFavorite);
}
