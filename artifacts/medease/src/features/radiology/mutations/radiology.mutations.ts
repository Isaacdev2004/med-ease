import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { radiologyOfflineQueue } from '@/services/radiology/offline-sync';
import { radiologyService } from '@/services/radiology/radiology.service';
import type {
  AddAnnotationInput,
  AddMeasurementInput,
  ApproveReportInput,
  CompleteInterpretationInput,
  CreateRadiologyOrderInput,
} from '@/services/radiology/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    radiologyOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Radiology update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.radiology.all });
}

export function useRadiologyMutations() {
  const client = useQueryClient();

  const createOrder = useMutation({
    mutationFn: (input: CreateRadiologyOrderInput) =>
      runOrQueue('Create imaging order', () =>
        radiologyService.createOrder(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Imaging order created.' });
    },
  });

  const completeInterpretation = useMutation({
    mutationFn: (input: CompleteInterpretationInput) =>
      runOrQueue('Complete interpretation', () =>
        radiologyService.completeInterpretation(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Interpretation saved.' });
    },
  });

  const approveReport = useMutation({
    mutationFn: (input: ApproveReportInput) =>
      runOrQueue('Approve report', () => radiologyService.approveReport(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Report signed and released.' });
    },
  });

  const addAnnotation = useMutation({
    mutationFn: (input: AddAnnotationInput) =>
      runOrQueue('Add annotation', () => radiologyService.addAnnotation(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Annotation added.' });
    },
  });

  const deleteAnnotation = useMutation({
    mutationFn: (id: string) =>
      runOrQueue('Delete annotation', () =>
        radiologyService.deleteAnnotation(id),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Annotation removed.' });
    },
  });

  const addMeasurement = useMutation({
    mutationFn: (input: AddMeasurementInput) =>
      runOrQueue('Add measurement', () =>
        radiologyService.addMeasurement(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Measurement saved.' });
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: (studyId: string) =>
      runOrQueue('Toggle favorite', () =>
        radiologyService.toggleFavorite(studyId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const shareStudy = useMutation({
    mutationFn: ({
      studyId,
      sharedWith,
    }: {
      studyId: string;
      sharedWith: string;
    }) =>
      runOrQueue('Share study', () =>
        radiologyService.shareStudy(studyId, sharedWith),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Study shared.' });
    },
  });

  const exportStudy = useMutation({
    mutationFn: ({
      studyId,
      format,
    }: {
      studyId: string;
      format: 'png' | 'jpeg' | 'pdf' | 'dicom';
    }) =>
      runOrQueue('Export study', () =>
        radiologyService.exportStudy(studyId, format),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Export ready.' });
    },
  });

  const archiveStudy = useMutation({
    mutationFn: (id: string) =>
      runOrQueue('Archive study', () => radiologyService.archiveStudy(id)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Study archived.' });
    },
  });

  return {
    createOrder,
    completeInterpretation,
    approveReport,
    addAnnotation,
    deleteAnnotation,
    addMeasurement,
    toggleFavorite,
    shareStudy,
    exportStudy,
    archiveStudy,
  };
}
