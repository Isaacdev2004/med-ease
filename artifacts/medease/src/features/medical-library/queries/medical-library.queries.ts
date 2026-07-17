import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import type { MedicationFilters } from '@/services/medical-library/medical-library.types';
import { medicalLibraryService } from '@/services/medical-library/medical-library.service';

export const medicalLibraryQueries = {
  search: (filters?: MedicationFilters) => ({
    queryKey: queryKeys.medicalLibrary.search(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => medicalLibraryService.search(filters),
    staleTime: CACHE_TIMES.reference,
  }),
  detail: (id: string) => ({
    queryKey: queryKeys.medicalLibrary.detail(id),
    queryFn: () => medicalLibraryService.getMedication(id),
    staleTime: CACHE_TIMES.reference,
  }),
  related: (id: string) => ({
    queryKey: queryKeys.medicalLibrary.related(id),
    queryFn: () => medicalLibraryService.getRelatedMedications(id),
    staleTime: CACHE_TIMES.reference,
  }),
  categories: () => ({
    queryKey: queryKeys.medicalLibrary.categories(),
    queryFn: () => medicalLibraryService.getCategories(),
    staleTime: CACHE_TIMES.reference,
  }),
  stats: (userId: string) => ({
    queryKey: queryKeys.medicalLibrary.stats(userId),
    queryFn: () => medicalLibraryService.getStats(userId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  favorites: (userId: string) => ({
    queryKey: queryKeys.medicalLibrary.favorites(userId),
    queryFn: () => medicalLibraryService.listFavorites(userId),
    staleTime: CACHE_TIMES.patientList,
  }),
};
