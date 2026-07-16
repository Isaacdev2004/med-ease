import { CACHE_TIMES, REFETCH_INTERVALS } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { facilitiesService } from '@/services/facilities/facilities.service';

export const facilityQueries = {
  beds: (facilityId: string) => ({
    queryKey: queryKeys.facilities.beds(facilityId),
    queryFn: () => facilitiesService.listBeds(facilityId),
    staleTime: CACHE_TIMES.dashboard,
    refetchInterval: REFETCH_INTERVALS.dashboard,
  }),
};
