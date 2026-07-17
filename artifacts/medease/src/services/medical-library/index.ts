export {
  MOCK_MEDICATIONS,
  POPULAR_MEDICATIONS,
  RECENT_MEDICATION_SEARCHES_KEY,
  getCategoryCounts,
} from '@/services/medical-library/medical-library.mapper';
export {
  getMedicationProfilePath,
  medicalLibraryService,
} from '@/services/medical-library/medical-library.service';
export { MEDICATION_CATEGORY_LABELS } from '@/services/medical-library/medical-library.types';
export type {
  BdpmRecord,
  MedicationCategory,
  MedicationCategoryInfo,
  MedicationDosage,
  MedicationFilters,
  MedicationInteraction,
  MedicationLibraryStats,
  MedicationRecord,
  MedicationRoute,
  MedicationSearchResult,
  MedicationSort,
  MedicationViewMode,
  PregnancySafety,
} from '@/services/medical-library/medical-library.types';
