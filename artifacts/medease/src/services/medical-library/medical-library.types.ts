export type MedicationCategory =
  | 'pain_relief'
  | 'antibiotics'
  | 'cardiology'
  | 'diabetes'
  | 'neurology'
  | 'respiratory'
  | 'dermatology'
  | 'vaccines'
  | 'psychiatry'
  | 'gastroenterology'
  | 'endocrinology'
  | 'ophthalmology'
  | 'ent'
  | 'urology'
  | 'emergency';

export type MedicationRoute =
  | 'oral'
  | 'topical'
  | 'injection'
  | 'inhalation'
  | 'sublingual'
  | 'rectal'
  | 'ophthalmic'
  | 'intravenous';

export type MedicationSort =
  | 'alphabetical'
  | 'most_searched'
  | 'updated'
  | 'therapeutic_class'
  | 'manufacturer';

export type MedicationViewMode = 'cards' | 'table' | 'compact' | 'categories';

export type PregnancySafety =
  'safe' | 'caution' | 'contraindicated' | 'unknown';

export interface MedicationInteraction {
  drugName: string;
  severity: 'minor' | 'moderate' | 'major';
  description: string;
}

export interface MedicationDosage {
  population: 'adult' | 'pediatric' | 'geriatric';
  indication: string;
  dose: string;
  frequency: string;
  maxDose?: string;
  notes?: string;
}

export interface MedicationRecord {
  id: string;
  bdpmId?: string;
  name: string;
  brandName?: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  route: MedicationRoute;
  atcCode: string;
  therapeuticClass: string;
  category: MedicationCategory;
  manufacturer?: string;
  prescriptionRequired: boolean;
  controlledSubstance: boolean;
  pregnancySafety: PregnancySafety;
  breastfeedingSafety: PregnancySafety;
  pediatricApproved: boolean;
  geriatricApproved: boolean;
  available: boolean;
  searchCount: number;
  description: string;
  activeIngredients: string[];
  indications: string[];
  contraindications: string[];
  warnings: string[];
  precautions: string[];
  sideEffects: string[];
  administration: string[];
  storage: string;
  patientInformation: string;
  professionalInformation: string;
  references: string[];
  dosages: MedicationDosage[];
  interactions: MedicationInteraction[];
  relatedMedicationIds: string[];
  updatedAt: string;
}

export interface MedicationFilters {
  q?: string;
  category?: MedicationCategory | 'all';
  therapeuticClass?: string;
  atcCode?: string;
  prescriptionRequired?: boolean;
  overTheCounter?: boolean;
  route?: MedicationRoute;
  manufacturer?: string;
  pregnancySafety?: PregnancySafety;
  pediatric?: boolean;
  geriatric?: boolean;
  controlledSubstance?: boolean;
  available?: boolean;
  favoritesOnly?: boolean;
  sort?: MedicationSort;
  page?: number;
  pageSize?: number;
}

export interface MedicationSearchResult {
  items: MedicationRecord[];
  total: number;
  page: number;
  pageSize: number;
  facets: {
    categories: MedicationCategory[];
    therapeuticClasses: string[];
    manufacturers: string[];
    routes: MedicationRoute[];
  };
}

export interface MedicationLibraryStats {
  total: number;
  prescription: number;
  overTheCounter: number;
  categories: number;
  favorites: number;
}

export interface MedicationCategoryInfo {
  id: MedicationCategory;
  label: string;
  description: string;
  count: number;
}

/** Raw BDPM-style record for future API mapping. */
export interface BdpmRecord {
  cis: string;
  name: string;
  form: string;
  route: string;
  status: string;
  authorizationDate?: string;
}

export const MEDICATION_CATEGORY_LABELS: Record<MedicationCategory, string> = {
  pain_relief: 'Pain Relief',
  antibiotics: 'Antibiotics',
  cardiology: 'Cardiology',
  diabetes: 'Diabetes',
  neurology: 'Neurology',
  respiratory: 'Respiratory',
  dermatology: 'Dermatology',
  vaccines: 'Vaccines',
  psychiatry: 'Psychiatry',
  gastroenterology: 'Gastroenterology',
  endocrinology: 'Endocrinology',
  ophthalmology: 'Ophthalmology',
  ent: 'ENT',
  urology: 'Urology',
  emergency: 'Emergency',
};
