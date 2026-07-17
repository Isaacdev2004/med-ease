import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { reportingOfflineQueue } from '@/services/reporting/offline-sync';
import { reportingService } from '@/services/reporting/reporting.service';
import type {
  CreateReportInput,
  ExportReportInput,
  RunReportInput,
  ScheduleReportInput,
  ShareReportInput,
  UpdateDesignerInput,
} from '@/services/reporting/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    reportingOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Report update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.reporting.all });
}

export function useReportingMutations() {
  const client = useQueryClient();

  const createReport = useMutation({
    mutationFn: (input: CreateReportInput) =>
      runOrQueue('Create report', () => reportingService.createReport(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Report created.' });
    },
  });

  const publishReport = useMutation({
    mutationFn: (reportId: string) =>
      runOrQueue('Publish report', () =>
        reportingService.publishReport(reportId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Report published.' });
    },
  });

  const runReport = useMutation({
    mutationFn: (input: RunReportInput) =>
      runOrQueue('Run report', () => reportingService.runReport(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Report generation started.' });
    },
  });

  const scheduleReport = useMutation({
    mutationFn: (input: ScheduleReportInput) =>
      runOrQueue('Schedule report', () =>
        reportingService.scheduleReport(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Schedule created.' });
    },
  });

  const exportReport = useMutation({
    mutationFn: (input: ExportReportInput) =>
      runOrQueue('Export report', () => reportingService.exportReport(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Export complete.' });
    },
  });

  const updateDesigner = useMutation({
    mutationFn: (input: UpdateDesignerInput) =>
      runOrQueue('Update designer', () =>
        reportingService.updateDesigner(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Designer saved.' });
    },
  });

  const cancelInstance = useMutation({
    mutationFn: (instanceId: string) =>
      runOrQueue('Cancel instance', () =>
        reportingService.cancelInstance(instanceId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Generation cancelled.' });
    },
  });

  const toggleSchedule = useMutation({
    mutationFn: (scheduleId: string) =>
      runOrQueue('Toggle schedule', () =>
        reportingService.toggleSchedule(scheduleId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Schedule updated.' });
    },
  });

  const retryExport = useMutation({
    mutationFn: (exportId: string) =>
      runOrQueue('Retry export', () => reportingService.retryExport(exportId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Export retried.' });
    },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export reporting data', () =>
        reportingService.exportData(format),
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
      entityType: 'report' | 'instance' | 'template';
      entityId: string;
    }) =>
      runOrQueue('Favorite', () =>
        reportingService.favorite(userId, entityType, entityId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const share = useMutation({
    mutationFn: (input: ShareReportInput) =>
      runOrQueue('Share report', () => reportingService.share(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Shared successfully.' });
    },
  });

  return {
    createReport,
    publishReport,
    runReport,
    scheduleReport,
    exportReport,
    updateDesigner,
    cancelInstance,
    toggleSchedule,
    retryExport,
    exportData,
    favorite,
    share,
  };
}
