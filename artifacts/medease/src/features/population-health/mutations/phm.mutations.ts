import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { phmOfflineQueue } from '@/services/population-health/offline-sync';
import { populationHealthService } from '@/services/population-health/population-health.service';
import type { CloseCareGapInput, CreateCohortInput, LaunchCampaignInput } from '@/services/population-health/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    phmOfflineQueue.enqueue({ label, execute: () => execute().then(() => undefined) });
    appToast.offline('Population health update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.phm.all });
}

export function usePhmMutations() {
  const client = useQueryClient();

  const createCohort = useMutation({
    mutationFn: (input: CreateCohortInput) => runOrQueue('Create cohort', () => populationHealthService.createCohort(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Cohort created.' }); },
  });

  const launchCampaign = useMutation({
    mutationFn: (input: LaunchCampaignInput) => runOrQueue('Launch campaign', () => populationHealthService.launchCampaign(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Campaign scheduled.' }); },
  });

  const closeCareGap = useMutation({
    mutationFn: (input: CloseCareGapInput) => runOrQueue('Close care gap', () => populationHealthService.closeCareGap(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Care gap closed.' }); },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') => runOrQueue('Export PHM', () => populationHealthService.exportData(format)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Export complete.' }); },
  });

  const favorite = useMutation({
    mutationFn: ({ userId, entityType, entityId }: { userId: string; entityType: 'registry' | 'cohort' | 'campaign' | 'gap'; entityId: string }) =>
      runOrQueue('Favorite', () => populationHealthService.favorite(userId, entityType, entityId)),
    onSuccess: () => invalidateAll(client),
  });

  return { createCohort, launchCampaign, closeCareGap, exportData, favorite };
}
