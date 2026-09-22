import type { DirectoryFilters } from '@/services/directory/directory.types';
import { searchFinessExternal } from '@/services/external/finess-external';
import {
  getCachedDirectoryProvider,
  rememberDirectoryProviders,
} from '@/services/external/search-result-cache';
import { mergeDirectorySearchResults } from '@/services/external/search-merge';
import { directoryRepository } from '@/services/directory/repository';

const DELAY = 250;
const delay = (ms = DELAY) => new Promise((r) => setTimeout(r, ms));

export const directoryService = {
  async search(filters: DirectoryFilters = {}) {
    await delay();
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const local = await directoryRepository.search(filters);
    const q = filters.q?.trim();

    if (!q || q.length < 2) {
      rememberDirectoryProviders(local.items);
      return local;
    }

    const external = await searchFinessExternal({ ...filters, page: 1, pageSize: 50 });
    rememberDirectoryProviders([...local.items, ...external]);
    if (!external.length) return local;

    return mergeDirectorySearchResults(local, external, page, pageSize);
  },

  async getProvider(id: string) {
    await delay();
    const cached = getCachedDirectoryProvider(id);
    if (cached) return cached;

    const local = await directoryRepository.getProvider(id);
    if (local) return local;

    if (id.startsWith('finess-ext-')) {
      const finess = id.replace('finess-ext-', '');
      const results = await searchFinessExternal({ q: finess, pageSize: 25 });
      rememberDirectoryProviders(results);
      return (
        results.find((p) => p.id === id || p.finessNumber === finess) ??
        results[0] ??
        null
      );
    }

    if (id.startsWith('siret-ext-')) {
      const siret = id.replace('siret-ext-', '');
      const results = await searchFinessExternal({ q: siret, pageSize: 25 });
      rememberDirectoryProviders(results);
      return results.find((p) => p.id === id) ?? results[0] ?? null;
    }

    return null;
  },

  async getRelatedProviders(id: string) {
    await delay(150);
    return directoryRepository.getRelatedProviders(id);
  },

  async getStats(userId: string) {
    await delay(100);
    return directoryRepository.getStats(userId);
  },

  async listFavorites(userId: string) {
    await delay();
    return directoryRepository.listFavorites(userId);
  },

  async toggleFavorite(userId: string, providerId: string) {
    await delay(100);
    return directoryRepository.toggleFavorite(userId, providerId);
  },

  async isFavorite(userId: string, providerId: string) {
    await delay(50);
    return directoryRepository.isFavorite(userId, providerId);
  },

  async getPopularSearches() {
    return directoryRepository.getPopularSearches();
  },

  async getSuggestions(query: string) {
    return directoryRepository.getSuggestions(query);
  },
};

export function getProviderProfilePath(portalBase: string, providerId: string) {
  return `${portalBase}/directory/${providerId}`;
}
