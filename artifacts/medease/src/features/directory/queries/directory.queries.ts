import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import type { DirectoryFilters } from '@/services/directory/directory.types';
import { directoryService } from '@/services/directory/directory.service';

export const directoryQueries = {
  search: (filters?: DirectoryFilters) => ({
    queryKey: queryKeys.directory.search(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => directoryService.search(filters),
    staleTime: CACHE_TIMES.reference,
  }),
  detail: (id: string) => ({
    queryKey: queryKeys.directory.detail(id),
    queryFn: () => directoryService.getProvider(id),
    staleTime: CACHE_TIMES.reference,
  }),
  related: (id: string) => ({
    queryKey: queryKeys.directory.related(id),
    queryFn: () => directoryService.getRelatedProviders(id),
    staleTime: CACHE_TIMES.reference,
  }),
  stats: (userId: string) => ({
    queryKey: queryKeys.directory.stats(userId),
    queryFn: () => directoryService.getStats(userId),
    staleTime: CACHE_TIMES.dashboard,
    enabled: Boolean(userId),
  }),
  favorites: (userId: string) => ({
    queryKey: queryKeys.directory.favorites(userId),
    queryFn: () => directoryService.listFavorites(userId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(userId),
  }),
};
