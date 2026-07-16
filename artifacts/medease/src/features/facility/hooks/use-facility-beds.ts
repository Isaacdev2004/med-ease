import { useQuery } from '@tanstack/react-query';

import { facilityQueries } from '@/features/facility/queries/facility.queries';

export function useFacilityBeds(facilityId: string) {
  return useQuery({
    ...facilityQueries.beds(facilityId),
    enabled: Boolean(facilityId),
  });
}
