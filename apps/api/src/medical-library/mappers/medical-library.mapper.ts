import type {
  MedicationCategory,
  MedicationDosage,
  MedicationInteraction,
  MedicationRecord,
  MedicationRoute,
  PregnancySafety,
} from '@medease/medical-library-contract';
import type { Prisma } from '@medease/prisma';

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

const DOSAGE_POPULATIONS = new Set(['adult', 'pediatric', 'geriatric']);
const INTERACTION_SEVERITIES = new Set(['minor', 'moderate', 'major']);

export function mapCategory(value: string): MedicationCategory {
  return CATEGORIES.has(value as MedicationCategory)
    ? (value as MedicationCategory)
    : 'pain_relief';
}

export function mapRoute(value: string): MedicationRoute {
  return ROUTES.has(value as MedicationRoute)
    ? (value as MedicationRoute)
    : 'oral';
}

export function mapPregnancySafety(value: string): PregnancySafety {
  return PREGNANCY.has(value as PregnancySafety)
    ? (value as PregnancySafety)
    : 'unknown';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseDosages(value: Prisma.JsonValue): MedicationDosage[] {
  if (!Array.isArray(value)) return [];

  const dosages: MedicationDosage[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    if (
      typeof item.population !== 'string' ||
      !DOSAGE_POPULATIONS.has(item.population)
    ) {
      continue;
    }
    if (typeof item.indication !== 'string') continue;
    if (typeof item.dose !== 'string') continue;
    if (typeof item.frequency !== 'string') continue;

    const dosage: MedicationDosage = {
      population: item.population as MedicationDosage['population'],
      indication: item.indication,
      dose: item.dose,
      frequency: item.frequency,
    };
    if (typeof item.maxDose === 'string') dosage.maxDose = item.maxDose;
    if (typeof item.notes === 'string') dosage.notes = item.notes;
    dosages.push(dosage);
  }
  return dosages;
}

export function parseInteractions(
  value: Prisma.JsonValue,
): MedicationInteraction[] {
  if (!Array.isArray(value)) return [];

  const interactions: MedicationInteraction[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    if (typeof item.drugName !== 'string') continue;
    if (
      typeof item.severity !== 'string' ||
      !INTERACTION_SEVERITIES.has(item.severity)
    ) {
      continue;
    }
    if (typeof item.description !== 'string') continue;

    interactions.push({
      drugName: item.drugName,
      severity: item.severity as MedicationInteraction['severity'],
      description: item.description,
    });
  }
  return interactions;
}

export function mapMedicationCatalog(
  row: Prisma.MedicationCatalogGetPayload<object>,
): MedicationRecord {
  return {
    id: row.id,
    bdpmId: row.bdpmId ?? undefined,
    name: row.name,
    brandName: row.brandName ?? undefined,
    genericName: row.genericName,
    strength: row.strength,
    dosageForm: row.dosageForm,
    route: mapRoute(row.route),
    atcCode: row.atcCode,
    therapeuticClass: row.therapeuticClass,
    category: mapCategory(row.category),
    manufacturer: row.manufacturer ?? undefined,
    prescriptionRequired: row.prescriptionRequired,
    controlledSubstance: row.controlledSubstance,
    pregnancySafety: mapPregnancySafety(row.pregnancySafety),
    breastfeedingSafety: mapPregnancySafety(row.breastfeedingSafety),
    pediatricApproved: row.pediatricApproved,
    geriatricApproved: row.geriatricApproved,
    available: row.available,
    searchCount: row.searchCount,
    description: row.description,
    activeIngredients: row.activeIngredients ?? [],
    indications: row.indications ?? [],
    contraindications: row.contraindications ?? [],
    warnings: row.warnings ?? [],
    precautions: row.precautions ?? [],
    sideEffects: row.sideEffects ?? [],
    administration: row.administration ?? [],
    storage: row.storage,
    patientInformation: row.patientInformation,
    professionalInformation: row.professionalInformation,
    references: row.references ?? [],
    dosages: parseDosages(row.dosages),
    interactions: parseInteractions(row.interactions),
    relatedMedicationIds: row.relatedMedicationIds ?? [],
    updatedAt: row.updatedAt.toISOString(),
  };
}
