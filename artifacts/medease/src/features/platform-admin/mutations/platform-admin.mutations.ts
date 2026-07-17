import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { platformAdminOfflineQueue } from '@/services/platform-admin/offline-sync';
import { platformAdminService } from '@/services/platform-admin/platform-admin.service';
import type {
  CreateTenantInput,
  ScheduleMaintenanceInput,
  ToggleFeatureFlagInput,
  TriggerBackupInput,
  UpdateBrandingInput,
  UpdateFacilityInput,
  UpdateHospitalInput,
  UpdateLocalizationInput,
} from '@/services/platform-admin/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    platformAdminOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Platform update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.platformAdmin.all });
}

export function usePlatformAdminMutations() {
  const client = useQueryClient();

  const createTenant = useMutation({
    mutationFn: (input: CreateTenantInput) =>
      runOrQueue('Create tenant', () =>
        platformAdminService.createTenant(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Tenant created.' });
    },
  });

  const activateTenant = useMutation({
    mutationFn: (tenantId: string) =>
      runOrQueue('Activate tenant', () =>
        platformAdminService.activateTenant(tenantId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Tenant activated.' });
    },
  });

  const suspendTenant = useMutation({
    mutationFn: (tenantId: string) =>
      runOrQueue('Suspend tenant', () =>
        platformAdminService.suspendTenant(tenantId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.warning({ title: 'Tenant suspended.' });
    },
  });

  const updateHospital = useMutation({
    mutationFn: (input: UpdateHospitalInput) =>
      runOrQueue('Update hospital', () =>
        platformAdminService.updateHospital(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Hospital updated.' });
    },
  });

  const updateFacility = useMutation({
    mutationFn: (input: UpdateFacilityInput) =>
      runOrQueue('Update facility', () =>
        platformAdminService.updateFacility(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Facility updated.' });
    },
  });

  const updateLocalization = useMutation({
    mutationFn: (input: UpdateLocalizationInput) =>
      runOrQueue('Update localization', () =>
        platformAdminService.updateLocalization(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Localization updated.' });
    },
  });

  const updateBranding = useMutation({
    mutationFn: (input: UpdateBrandingInput) =>
      runOrQueue('Update branding', () =>
        platformAdminService.updateBranding(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Branding updated.' });
    },
  });

  const toggleFeatureFlag = useMutation({
    mutationFn: (input: ToggleFeatureFlagInput) =>
      runOrQueue('Toggle feature flag', () =>
        platformAdminService.toggleFeatureFlag(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Feature flag updated.' });
    },
  });

  const retryJob = useMutation({
    mutationFn: (jobId: string) =>
      runOrQueue('Retry job', () => platformAdminService.retryJob(jobId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Job retry queued.' });
    },
  });

  const scheduleMaintenance = useMutation({
    mutationFn: (input: ScheduleMaintenanceInput) =>
      runOrQueue('Schedule maintenance', () =>
        platformAdminService.scheduleMaintenance(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Maintenance scheduled.' });
    },
  });

  const triggerBackup = useMutation({
    mutationFn: (input: TriggerBackupInput) =>
      runOrQueue('Trigger backup', () =>
        platformAdminService.triggerBackup(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Backup started.' });
    },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export platform data', () =>
        platformAdminService.exportData(format),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Export complete.' });
    },
  });

  return {
    createTenant,
    activateTenant,
    suspendTenant,
    updateHospital,
    updateFacility,
    updateLocalization,
    updateBranding,
    toggleFeatureFlag,
    retryJob,
    scheduleMaintenance,
    triggerBackup,
    exportData,
  };
}
