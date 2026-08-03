import type {
  DirectoryFilters,
  DirectoryProvider,
  DirectorySearchResult,
  DirectoryStats,
} from './directory.types';

export interface DirectoryRepositoryContract {
  search(filters?: DirectoryFilters): Promise<DirectorySearchResult>;
  getById(id: string): Promise<DirectoryProvider>;
  getRelated(id: string): Promise<DirectoryProvider[]>;
  getStats(userId: string): Promise<DirectoryStats>;
  listFavorites(userId: string): Promise<DirectoryProvider[]>;
  toggleFavorite(userId: string, providerId: string): Promise<boolean>;
  getSuggestions(q: string): Promise<string[]>;
  getPopularSearches(): Promise<string[]>;
}
