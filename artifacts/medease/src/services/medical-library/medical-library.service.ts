import type {
  MedicationFilters,
} from '@/services/medical-library/medical-library.types';
import { medicalLibraryRepository } from '@/services/medical-library/repository';

const SIMULATED_DELAY_MS = 250;

function delay(ms = SIMULATED_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const medicalLibraryService = {
  async search(filters: MedicationFilters = {}) {
    await delay();
    return medicalLibraryRepository.search(filters);
  },

  async getMedication(id: string) {
    await delay();
    return medicalLibraryRepository.getMedication(id);
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
