import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { admissionsService } from '@/services/admissions';
import {
  DEMO_FACILITY_PARIS,
  type AdmissionFilters,
  type AssignAdmissionBedInput,
} from '@/services/admissions/types';
import { bedsService } from '@/services/beds';

export const admissionsQueryKeys = {
  all: ['admissions'] as const,
  board: (filters?: AdmissionFilters) =>
    [...admissionsQueryKeys.all, 'board', filters ?? {}] as const,
  transfers: ['transfers'] as const,
};

export function useAdmissionBoard(filters?: AdmissionFilters) {
  const queryFilters = {
    facilityId: DEMO_FACILITY_PARIS,
    ...filters,
  };
  return useQuery({
    queryKey: admissionsQueryKeys.board(queryFilters),
    queryFn: () => admissionsService.getBoard(queryFilters),
  });
}

export function useTransfers() {
  return useQuery({
    queryKey: admissionsQueryKeys.transfers,
    queryFn: () => admissionsService.listTransfers(),
  });
}

export function useAdmitPatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (admissionId: string) => admissionsService.admit(admissionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: admissionsQueryKeys.all });
    },
  });
}

export function useAssignAdmissionBed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      admissionId,
      input,
    }: {
      admissionId: string;
      input?: AssignAdmissionBedInput;
    }) => {
      if (input?.bedId) {
        return admissionsService.assignBed(admissionId, input);
      }
      const board = await bedsService.getBoard({
        facilityId: DEMO_FACILITY_PARIS,
        status: 'available',
      });
      const bed = board.beds[0];
      if (!bed) throw new Error('No available bed');
      return admissionsService.assignBed(admissionId, { bedId: bed.id });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: admissionsQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
  });
}

export function useCompleteTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transferId: string) =>
      admissionsService.completeTransfer(transferId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: admissionsQueryKeys.transfers,
      });
      await queryClient.invalidateQueries({ queryKey: ['beds'] });
    },
  });
}

export function useCancelTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transferId: string) =>
      admissionsService.cancelTransfer(transferId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: admissionsQueryKeys.transfers,
      });
    },
  });
}
