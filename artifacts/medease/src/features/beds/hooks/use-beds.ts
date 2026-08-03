import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { bedsService } from '@/services/beds';
import type { BedFilters, UpdateBedStatusInput } from '@/services/beds/types';
import { DEMO_FACILITY_PARIS } from '@/services/beds/types';

export const bedsQueryKeys = {
  all: ['beds'] as const,
  board: (filters?: BedFilters) =>
    [...bedsQueryKeys.all, 'board', filters ?? {}] as const,
  list: (filters?: BedFilters) =>
    [...bedsQueryKeys.all, 'list', filters ?? {}] as const,
};

export function useBedBoard(filters?: BedFilters) {
  const queryFilters = {
    facilityId: DEMO_FACILITY_PARIS,
    ...filters,
  };
  return useQuery({
    queryKey: bedsQueryKeys.board(queryFilters),
    queryFn: () => bedsService.getBoard(queryFilters),
  });
}

export function useUpdateBedStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bedId,
      input,
    }: {
      bedId: string;
      input: UpdateBedStatusInput;
    }) => bedsService.updateStatus(bedId, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bedsQueryKeys.all });
    },
  });
}

export function useReleaseBed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bedId: string) => bedsService.release(bedId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bedsQueryKeys.all });
    },
  });
}
