import { httpTransport } from '@workspace/repository-transport';
import type { MedicationFilters } from '@/services/medical-library/medical-library.types';
import {
  mapCategoryInfoArray,
  mapLibraryStats,
  mapMedicationRecord,
  mapMedicationRecordArray,
  mapMedicationSearchResult,
  mapStringArray,
  mapToggleFavorite,
  medicationFiltersToQuery,
} from '@/services/medical-library/dto-mappers';

const BASE = '/api/medical-library';

class MedicalLibraryHttpRepository {
  private readonly transport = httpTransport;

  async search(filters: MedicationFilters = {}) {
    return mapMedicationSearchResult(
      await this.transport.get(`${BASE}/medications`, {
        query: medicationFiltersToQuery(filters),
      }),
    );
  }

  async getMedication(id: string) {
    try {
      return mapMedicationRecord(
        await this.transport.get(`${BASE}/medications/${id}`),
      );
    } catch {
      return null;
    }
  }

  async getRelatedMedications(id: string) {
    return mapMedicationRecordArray(
      await this.transport.get(`${BASE}/medications/${id}/related`),
    );
  }

  async getCategories() {
    return mapCategoryInfoArray(await this.transport.get(`${BASE}/categories`));
  }

  async getStats(_userId: string) {
    return mapLibraryStats(await this.transport.get(`${BASE}/stats`));
  }

  async listFavorites(_userId: string) {
    return mapMedicationRecordArray(
      await this.transport.get(`${BASE}/favorites`),
    );
  }

  async toggleFavorite(_userId: string, medicationId: string) {
    return mapToggleFavorite(
      await this.transport.post(
        `${BASE}/favorites/${medicationId}/toggle`,
        { body: {} },
      ),
    );
  }

  async getPopularMedications() {
    return mapStringArray(await this.transport.get(`${BASE}/popular`));
  }

  async getSuggestions(query: string) {
    return mapStringArray(
      await this.transport.get(`${BASE}/suggestions`, {
        query: { q: query },
      }),
    );
  }
}

export const medicalLibraryHttpRepository = new MedicalLibraryHttpRepository();
