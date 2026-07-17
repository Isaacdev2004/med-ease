import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { laboratoryOfflineQueue } from '@/services/laboratory/offline-sync';
import { laboratoryService } from '@/services/laboratory/laboratory.service';
import type {
  ApproveResultInput,
  CancelLabOrderInput,
  CollectSpecimenInput,
  CreateLabOrderInput,
  ExportResultInput,
  ReleaseResultInput,
  ShareResultInput,
  UploadResultInput,
  VerifyResultInput,
} from '@/services/laboratory/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    laboratoryOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Lab update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.laboratory.all });
}

export function useLaboratoryMutations() {
  const client = useQueryClient();

  const createOrder = useMutation({
    mutationFn: (input: CreateLabOrderInput) =>
      runOrQueue('Create lab order', () =>
        laboratoryService.createOrder(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Lab order created.' });
    },
  });

  const cancelOrder = useMutation({
    mutationFn: (input: CancelLabOrderInput) =>
      runOrQueue('Cancel lab order', () =>
        laboratoryService.cancelOrder(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Lab order cancelled.' });
    },
  });

  const verifyResult = useMutation({
    mutationFn: (input: VerifyResultInput) =>
      runOrQueue('Verify result', () => laboratoryService.verifyResult(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Result verified.' });
    },
  });

  const releaseResult = useMutation({
    mutationFn: (input: ReleaseResultInput) =>
      runOrQueue('Release result', () =>
        laboratoryService.releaseResult(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Result released to patient.' });
    },
  });

  const collectSpecimen = useMutation({
    mutationFn: (input: CollectSpecimenInput) =>
      runOrQueue('Collect specimen', () =>
        laboratoryService.collectSpecimen(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Specimen collected.' });
    },
  });

  const approveResult = useMutation({
    mutationFn: (input: ApproveResultInput) =>
      runOrQueue('Approve result', () =>
        laboratoryService.approveResult(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Result approved and released.' });
    },
  });

  const uploadResult = useMutation({
    mutationFn: (input: UploadResultInput) =>
      runOrQueue('Upload result', () => laboratoryService.uploadResult(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Result uploaded for verification.' });
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: (reportId: string) =>
      runOrQueue('Toggle favorite', () =>
        laboratoryService.toggleFavorite(reportId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const exportResult = useMutation({
    mutationFn: (input: ExportResultInput) =>
      runOrQueue('Export result', () => laboratoryService.exportResult(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Result export ready.' });
    },
  });

  const shareResult = useMutation({
    mutationFn: (input: ShareResultInput) =>
      runOrQueue('Share result', () => laboratoryService.shareResult(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Result shared.' });
    },
  });

  return {
    createOrder,
    cancelOrder,
    verifyResult,
    releaseResult,
    collectSpecimen,
    approveResult,
    uploadResult,
    toggleFavorite,
    exportResult,
    shareResult,
  };
}

export function useCreateLabOrder() {
  return useLaboratoryMutations().createOrder;
}

export function useCancelLabOrder() {
  return useLaboratoryMutations().cancelOrder;
}
