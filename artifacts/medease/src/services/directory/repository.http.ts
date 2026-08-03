import { httpTransport } from '@workspace/repository-transport';
import type { DirectoryFilters } from '@/services/directory/directory.types';
import {
  directoryFiltersToQuery,
  mapDirectoryProvider,
  mapDirectoryProviderArray,
  mapDirectorySearchResult,
  mapDirectoryStats,
  mapStringArray,
  mapToggleFavorite,
} from '@/services/directory/dto-mappers';

const BASE = '/api/directory';

class DirectoryHttpRepository {
  private readonly transport = httpTransport;

  async search(filters: DirectoryFilters = {}) {
    return mapDirectorySearchResult(
      await this.transport.get(`${BASE}/providers`, {
        query: directoryFiltersToQuery(filters),
      }),
    );
  }

  async getProvider(id: string) {
    try {
      return mapDirectoryProvider(
        await this.transport.get(`${BASE}/providers/${id}`),
      );
    } catch {
      return null;
    }
  }

  async getRelatedProviders(id: string) {
    try {
      return mapDirectoryProviderArray(
        await this.transport.get(`${BASE}/providers/${id}/related`),
      );
    } catch {
      return [];
    }
  }

  async getStats(_userId: string) {
    return mapDirectoryStats(await this.transport.get(`${BASE}/stats`));
  }

  async listFavorites(_userId: string) {
    return mapDirectoryProviderArray(
      await this.transport.get(`${BASE}/favorites`),
    );
  }

  async toggleFavorite(_userId: string, providerId: string) {
    return mapToggleFavorite(
      await this.transport.post(`${BASE}/favorites/${providerId}/toggle`, {
        body: {},
      }),
    );
  }

  async isFavorite(userId: string, providerId: string) {
    try {
      const favorites = await this.listFavorites(userId);
      return favorites.some((provider) => provider.id === providerId);
    } catch {
      return false;
    }
  }

  async getPopularSearches() {
    return mapStringArray(
      await this.transport.get(`${BASE}/popular-searches`),
    );
  }

  async getSuggestions(query: string) {
    return mapStringArray(
      await this.transport.get(`${BASE}/suggestions`, {
        query: { q: query },
      }),
    );
  }
}

export const directoryHttpRepository = new DirectoryHttpRepository();
