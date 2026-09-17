import type {
  MedicationFilters,
} from '@/services/medical-library/medical-library.types';
import {
  getBdpmMedicationByCis,
  searchBdpmExternal,
} from '@/services/external/bdpm-external';
import { mergeMedicationSearchResults } from '@/services/external/search-merge';
import { medicalLibraryRepository } from '@/services/medical-library/repository';

const SIMULATED_DELAY_MS = 250;

function delay(ms = SIMULATED_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const medicalLibraryService = {
  async search(filters: MedicationFilters = {}) {
    await delay();
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const local = await medicalLibraryRepository.search(filters);
    const q = filters.q?.trim();

    if (!q || q.length < 3) return local;

    const external = await searchBdpmExternal(q, Math.max(pageSize, 20));
    if (!external.length) return local;

    return mergeMedicationSearchResults(local, external, page, pageSize);
  },

  async getMedication(id: string) {
    await delay();
    const local = await medicalLibraryRepository.getMedication(id);
    if (local) return local;

    const cis = id.startsWith('bdpm-') ? id.slice(5) : id;
    if (/^\d+$/.test(cis)) {
      return getBdpmMedicationByCis(cis);
    }
    return null;
  },

  async getRelatedMedications(id: string) {
    await delay(150);
    return medicalLibraryRepository.getRelatedMedications(id);
  },

  async getCategories() {
    await delay(100);
    return medicalLibraryRepository.getCategories();
  },

  async getStats(userId: string) {
    await delay(100);
    return medicalLibraryRepository.getStats(userId);
  },

  async listFavorites(userId: string) {
    await delay();
    return medicalLibraryRepository.listFavorites(userId);
  },

  async toggleFavorite(userId: string, medicationId: string) {
    await delay(100);
    return medicalLibraryRepository.toggleFavorite(userId, medicationId);
  },

  async getPopularMedications() {
    await delay(50);
    return medicalLibraryRepository.getPopularMedications();
  },

  async getSuggestions(query: string) {
    await delay(50);
    return medicalLibraryRepository.getSuggestions(query);
  },
};

export function getMedicationProfilePath(
  portalBase: string,
  medicationId: string,
) {
  return `${portalBase}/medical-library/${medicationId}`;
}
