import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { executiveOfflineQueue } from '@/services/executive/offline-sync';
import { executiveService } from '@/services/executive/executive.service';
import type {
  AcknowledgeAlertInput,
  ArchiveDashboardInput,
  CreateStrategicInitiativeInput,
  ShareExecutiveInput,
  UpdateKpiTargetInput,
} from '@/services/executive/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    executiveOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Executive update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.executive.all });
}

export function useExecutiveMutations() {
  const client = useQueryClient();

  const createStrategicInitiative = useMutation({
    mutationFn: (input: CreateStrategicInitiativeInput) =>
      runOrQueue('Create initiative', () =>
        executiveService.createStrategicInitiative(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Strategic initiative created.' });
    },
  });

  const updateKpiTarget = useMutation({
    mutationFn: (input: UpdateKpiTargetInput) =>
      runOrQueue('Update KPI target', () =>
        executiveService.updateKpiTarget(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'KPI target updated.' });
    },
  });

  const acknowledgeAlert = useMutation({
    mutationFn: (input: AcknowledgeAlertInput) =>
      runOrQueue('Acknowledge alert', () =>
        executiveService.acknowledgeAlert(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Alert acknowledged.' });
    },
  });

  const archiveDashboard = useMutation({
    mutationFn: (input: ArchiveDashboardInput) =>
      runOrQueue('Archive dashboard', () =>
        executiveService.archiveDashboard(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Dashboard archived.' });
    },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export executive report', () =>
        executiveService.exportData(format),
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
      entityType: 'dashboard' | 'kpi' | 'initiative' | 'report';
      entityId: string;
    }) =>
      runOrQueue('Favorite', () =>
        executiveService.favorite(userId, entityType, entityId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const share = useMutation({
    mutationFn: (input: ShareExecutiveInput) =>
      runOrQueue('Share dashboard', () => executiveService.share(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Shared successfully.' });
    },
  });

  return {
    createStrategicInitiative,
    updateKpiTarget,
    acknowledgeAlert,
    archiveDashboard,
    exportData,
    favorite,
    share,
  };
}
