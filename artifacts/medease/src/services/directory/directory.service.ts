import type { DirectoryFilters } from '@/services/directory/directory.types';
import { directoryRepository } from '@/services/directory/repository';

const DELAY = 250;
const delay = (ms = DELAY) => new Promise((r) => setTimeout(r, ms));

export const directoryService = {
  async search(filters: DirectoryFilters = {}) {
    await delay();
    return directoryRepository.search(filters);
  },

  async getProvider(id: string) {
    await delay();
    return directoryRepository.getProvider(id);
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
