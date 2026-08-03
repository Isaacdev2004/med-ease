import type { QueryParams } from '@workspace/repository-transport';
import type {
  MedicationCategory,
  MedicationCategoryInfo,
  MedicationDosage,
  MedicationFilters,
  MedicationInteraction,
  MedicationLibraryStats,
  MedicationRecord,
  MedicationRoute,
  MedicationSearchResult,
  PregnancySafety,
} from '@/services/medical-library/medical-library.types';

const CATEGORIES = new Set<MedicationCategory>([
  'pain_relief',
  'antibiotics',
  'cardiology',
  'diabetes',
  'neurology',
  'respiratory',
  'dermatology',
  'vaccines',
  'psychiatry',
  'gastroenterology',
  'endocrinology',
  'ophthalmology',
  'ent',
  'urology',
  'emergency',
]);

const ROUTES = new Set<MedicationRoute>([
  'oral',
  'topical',
  'injection',
  'inhalation',
  'sublingual',
  'rectal',
  'ophthalmic',
  'intravenous',
]);

const PREGNANCY = new Set<PregnancySafety>([
  'safe',
  'caution',
  'contraindicated',
  'unknown',
]);

const INTERACTION_SEVERITIES = new Set<MedicationInteraction['severity']>([
  'minor',
  'moderate',
  'major',
]);

const DOSAGE_POPULATIONS = new Set<MedicationDosage['population']>([
  'adult',
  'pediatric',
  'geriatric',
]);

export function medicationFiltersToQuery(
  filters?: MedicationFilters,
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    q: filters.q,
    category:
      filters.category && filters.category !== 'all'
        ? filters.category
        : undefined,
    therapeuticClass: filters.therapeuticClass,
    atcCode: filters.atcCode,
    prescriptionRequired: filters.prescriptionRequired,
    overTheCounter: filters.overTheCounter,
    route: filters.route,
    manufacturer: filters.manufacturer,
    pregnancySafety: filters.pregnancySafety,
    pediatric: filters.pediatric,
    geriatric: filters.geriatric,
    controlledSubstance: filters.controlledSubstance,
    available: filters.available,
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

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : [];
}

function asCategory(value: unknown): MedicationCategory {
  const raw = asString(value);
  return CATEGORIES.has(raw as MedicationCategory)
    ? (raw as MedicationCategory)
    : 'pain_relief';
}

function asRoute(value: unknown): MedicationRoute {
  const raw = asString(value);
  return ROUTES.has(raw as MedicationRoute) ? (raw as MedicationRoute) : 'oral';
}

function asPregnancy(value: unknown): PregnancySafety {
  const raw = asString(value);
  return PREGNANCY.has(raw as PregnancySafety)
    ? (raw as PregnancySafety)
    : 'unknown';
}

function mapDosage(dto: unknown): MedicationDosage {
  const row = asRecord(dto);
  const population = asString(row.population, 'adult');
  return {
    population: DOSAGE_POPULATIONS.has(
      population as MedicationDosage['population'],
    )
      ? (population as MedicationDosage['population'])
      : 'adult',
    indication: asString(row.indication),
    dose: asString(row.dose),
    frequency: asString(row.frequency),
    maxDose: asOptionalString(row.maxDose),
    notes: asOptionalString(row.notes),
  };
}

function mapInteraction(dto: unknown): MedicationInteraction {
  const row = asRecord(dto);
  const severity = asString(row.severity, 'minor');
  return {
    drugName: asString(row.drugName),
    severity: INTERACTION_SEVERITIES.has(
      severity as MedicationInteraction['severity'],
    )
      ? (severity as MedicationInteraction['severity'])
      : 'minor',
    description: asString(row.description),
  };
}

export function mapMedicationRecord(dto: unknown): MedicationRecord {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    bdpmId: asOptionalString(row.bdpmId),
    name: asString(row.name),
    brandName: asOptionalString(row.brandName),
    genericName: asString(row.genericName),
    strength: asString(row.strength),
    dosageForm: asString(row.dosageForm),
    route: asRoute(row.route),
    atcCode: asString(row.atcCode),
    therapeuticClass: asString(row.therapeuticClass),
    category: asCategory(row.category),
    manufacturer: asOptionalString(row.manufacturer),
    prescriptionRequired: asBoolean(row.prescriptionRequired),
    controlledSubstance: asBoolean(row.controlledSubstance),
    pregnancySafety: asPregnancy(row.pregnancySafety),
    breastfeedingSafety: asPregnancy(row.breastfeedingSafety),
    pediatricApproved: asBoolean(row.pediatricApproved),
    geriatricApproved: asBoolean(row.geriatricApproved),
    available: asBoolean(row.available, true),
    searchCount: asNumber(row.searchCount),
    description: asString(row.description),
    activeIngredients: asStringArray(row.activeIngredients),
    indications: asStringArray(row.indications),
    contraindications: asStringArray(row.contraindications),
    warnings: asStringArray(row.warnings),
    precautions: asStringArray(row.precautions),
    sideEffects: asStringArray(row.sideEffects),
    administration: asStringArray(row.administration),
    storage: asString(row.storage),
    patientInformation: asString(row.patientInformation),
    professionalInformation: asString(row.professionalInformation),
    references: asStringArray(row.references),
    dosages: Array.isArray(row.dosages) ? row.dosages.map(mapDosage) : [],
    interactions: Array.isArray(row.interactions)
      ? row.interactions.map(mapInteraction)
      : [],
    relatedMedicationIds: asStringArray(row.relatedMedicationIds),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapMedicationRecordArray(dto: unknown): MedicationRecord[] {
  return Array.isArray(dto) ? dto.map(mapMedicationRecord) : [];
}

export function mapMedicationSearchResult(
  dto: unknown,
): MedicationSearchResult {
  const row = asRecord(dto);
  const facets = asRecord(row.facets);
  return {
    items: mapMedicationRecordArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 12),
    facets: {
      categories: asStringArray(facets.categories).filter(
        (c): c is MedicationCategory => CATEGORIES.has(c as MedicationCategory),
      ),
      therapeuticClasses: asStringArray(facets.therapeuticClasses),
      manufacturers: asStringArray(facets.manufacturers),
      routes: asStringArray(facets.routes).filter((r): r is MedicationRoute =>
        ROUTES.has(r as MedicationRoute),
      ),
    },
  };
}

export function mapCategoryInfo(dto: unknown): MedicationCategoryInfo {
  const row = asRecord(dto);
  return {
    id: asCategory(row.id),
    label: asString(row.label),
    description: asString(row.description),
    count: asNumber(row.count),
  };
}

export function mapCategoryInfoArray(dto: unknown): MedicationCategoryInfo[] {
  return Array.isArray(dto) ? dto.map(mapCategoryInfo) : [];
}

export function mapLibraryStats(dto: unknown): MedicationLibraryStats {
  const row = asRecord(dto);
  return {
    total: asNumber(row.total),
    prescription: asNumber(row.prescription),
    overTheCounter: asNumber(row.overTheCounter),
    categories: asNumber(row.categories),
    favorites: asNumber(row.favorites),
  };
}

export function mapToggleFavorite(dto: unknown): boolean {
  return asBoolean(asRecord(dto).isFavorite);
}

export function mapStringArray(dto: unknown): string[] {
  return asStringArray(dto);
}
