import { Injectable } from '@nestjs/common';

import type { DirectoryFilters } from '@medease/directory-contract';

import { DirectoryRepository } from './directory.repository';

@Injectable()
export class DirectoryService {
  constructor(private readonly repository: DirectoryRepository) {}

  search(filters?: DirectoryFilters) {
    return this.repository.search(filters);
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  getRelated(id: string) {
    return this.repository.getRelated(id);
  }

  getStats(userId: string) {
    return this.repository.getStats(userId);
  }

  listFavorites(userId: string) {
    return this.repository.listFavorites(userId);
  }

  toggleFavorite(userId: string, providerId: string) {
    return this.repository.toggleFavorite(userId, providerId);
  }

  getSuggestions(q: string) {
    return this.repository.getSuggestions(q);
  }

  getPopularSearches() {
    return this.repository.getPopularSearches();
  }
}
