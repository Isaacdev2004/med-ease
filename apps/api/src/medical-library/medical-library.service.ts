import { Injectable } from '@nestjs/common';

import type { MedicationFilters } from '@medease/medical-library-contract';

import { MedicalLibraryRepository } from './medical-library.repository';

@Injectable()
export class MedicalLibraryService {
  constructor(private readonly repository: MedicalLibraryRepository) {}

  search(filters?: MedicationFilters) {
    return this.repository.search(filters);
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  getRelated(id: string) {
    return this.repository.getRelated(id);
  }

  getCategories() {
    return this.repository.getCategories();
  }

  getStats(userId: string) {
    return this.repository.getStats(userId);
  }

  listFavorites(userId: string) {
    return this.repository.listFavorites(userId);
  }

  toggleFavorite(userId: string, medicationId: string) {
    return this.repository.toggleFavorite(userId, medicationId);
  }

  getSuggestions(q: string) {
    return this.repository.getSuggestions(q);
  }

  getPopular() {
    return this.repository.getPopular();
  }
}
