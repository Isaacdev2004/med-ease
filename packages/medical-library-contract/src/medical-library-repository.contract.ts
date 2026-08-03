import type {
  MedicationCategoryInfo,
  MedicationFilters,
  MedicationLibraryStats,
  MedicationRecord,
  MedicationSearchResult,
} from './medical-library.types';

export interface MedicalLibraryRepositoryContract {
  search(filters?: MedicationFilters): Promise<MedicationSearchResult>;
  getById(id: string): Promise<MedicationRecord>;
  getRelated(id: string): Promise<MedicationRecord[]>;
  getCategories(): Promise<MedicationCategoryInfo[]>;
  getStats(userId: string): Promise<MedicationLibraryStats>;
  listFavorites(userId: string): Promise<MedicationRecord[]>;
  toggleFavorite(userId: string, medicationId: string): Promise<boolean>;
  getSuggestions(q: string): Promise<string[]>;
  getPopular(): Promise<string[]>;
}
