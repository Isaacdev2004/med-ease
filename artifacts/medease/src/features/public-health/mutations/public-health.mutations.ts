import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { publicHealthOfflineQueue } from '@/services/public-health/offline-sync';
import { publicHealthService } from '@/services/public-health/public-health.service';
import type {
  AssignContactTracingInput,
  CompleteInvestigationInput,
  CreateOutbreakInput,
  LaunchCampaignInput,
  RecordImmunizationInput,
  RecordSdohInput,
  RegisterCaseInput,
  ScheduleOutreachInput,
  SharePublicHealthInput,
} from '@/services/public-health/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    publicHealthOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Public health update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.publicHealth.all });
}

export function usePublicHealthMutations() {
  const client = useQueryClient();

  const registerCase = useMutation({
    mutationFn: (input: RegisterCaseInput) =>
      runOrQueue('Register case', () =>
        publicHealthService.registerCase(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Disease case registered.' });
    },
  });

  const createOutbreak = useMutation({
    mutationFn: (input: CreateOutbreakInput) =>
      runOrQueue('Create outbreak', () =>
        publicHealthService.createOutbreak(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Outbreak investigation opened.' });
    },
  });

  const recordImmunization = useMutation({
    mutationFn: (input: RecordImmunizationInput) =>
      runOrQueue('Record immunization', () =>
        publicHealthService.recordImmunization(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Immunization recorded.' });
    },
  });

  const launchCampaign = useMutation({
    mutationFn: (input: LaunchCampaignInput) =>
      runOrQueue('Launch campaign', () =>
        publicHealthService.launchCampaign(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Community campaign launched.' });
    },
  });

  const assignContactTracing = useMutation({
    mutationFn: (input: AssignContactTracingInput) =>
      runOrQueue('Assign contact tracing', () =>
        publicHealthService.assignContactTracing(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Contact assigned for tracing.' });
    },
  });

  const completeInvestigation = useMutation({
    mutationFn: (input: CompleteInvestigationInput) =>
      runOrQueue('Complete investigation', () =>
        publicHealthService.completeInvestigation(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Investigation completed.' });
    },
  });

  const recordSdoh = useMutation({
    mutationFn: (input: RecordSdohInput) =>
      runOrQueue('Record SDOH', () => publicHealthService.recordSdoh(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'SDOH assessment recorded.' });
    },
  });

  const scheduleOutreach = useMutation({
    mutationFn: (input: ScheduleOutreachInput) =>
      runOrQueue('Schedule outreach', () =>
        publicHealthService.scheduleOutreach(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Outreach scheduled.' });
    },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export public health', () =>
        publicHealthService.exportData(format),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Export complete.' });
    },
  });

  const favorite = useMutation({
    mutationFn: ({
      userId,
      entityType,
      entityId,
    }: {
      userId: string;
      entityType: 'case' | 'outbreak' | 'program' | 'immunization';
      entityId: string;
    }) =>
      runOrQueue('Favorite', () =>
        publicHealthService.favorite(userId, entityType, entityId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const share = useMutation({
    mutationFn: (input: SharePublicHealthInput) =>
      runOrQueue('Share public health', () => publicHealthService.share(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Shared successfully.' });
    },
  });

  return {
    registerCase,
    createOutbreak,
    recordImmunization,
    launchCampaign,
    assignContactTracing,
    completeInvestigation,
    recordSdoh,
    scheduleOutreach,
    exportData,
    favorite,
    share,
  };
}
