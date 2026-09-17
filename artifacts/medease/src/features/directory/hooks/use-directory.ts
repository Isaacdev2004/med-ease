import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { directoryQueries } from '@/features/directory/queries/directory.queries';
import type { DirectoryFilters } from '@/services/directory/directory.types';
import { useAuth } from '@/services/auth/auth-context';
import { useApiAuth } from '@/services/auth/auth-service';

function useApiQueryReady() {
  const { session } = useAuth();
  return !useApiAuth || Boolean(session?.accessToken);
}

export function useDirectory(filters?: DirectoryFilters) {
  const apiReady = useApiQueryReady();
  return useQuery({
    ...directoryQueries.search(filters),
    enabled: apiReady,
  });
}

export function useProvider(providerId: string) {
  return useQuery({
    ...directoryQueries.detail(providerId),
    enabled: Boolean(providerId),
  });
}

export function useRelatedProviders(providerId: string) {
  return useQuery({
    ...directoryQueries.related(providerId),
    enabled: Boolean(providerId),
  });
}

export function useDirectoryStats() {
  const { user } = useAuth();
  return useQuery(directoryQueries.stats(user?.id ?? ''));
}

export function useFavorites() {
  const { user } = useAuth();
  return useQuery(directoryQueries.favorites(user?.id ?? ''));
}

export function useNearbyProviders(filters?: DirectoryFilters) {
  const nearbyFilters = useMemo(
    () => ({
      ...filters,
      sort: 'distance' as const,
      distanceMax: filters?.distanceMax ?? 10,
    }),
    [filters],
  );
  return useDirectory(nearbyFilters);
}
