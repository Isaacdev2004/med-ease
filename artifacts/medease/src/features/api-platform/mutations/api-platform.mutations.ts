import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { apiPlatformOfflineQueue } from '@/services/api-platform/offline-sync';
import { apiPlatformService } from '@/services/api-platform/api-platform.service';
import type {
  CreateApiKeyInput,
  CreateOAuthAppInput,
  CreateSandboxInput,
  CreateWebhookInput,
  PublishSdkInput,
  RevokeApiKeyInput,
  TestWebhookInput,
  UpdateRateLimitInput,
} from '@/services/api-platform/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    apiPlatformOfflineQueue.enqueue({ label, execute: () => execute().then(() => undefined) });
    appToast.offline('API platform update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.apiPlatform.all });
}

export function useApiPlatformMutations() {
  const client = useQueryClient();

  const createApiKey = useMutation({
    mutationFn: (input: CreateApiKeyInput) => runOrQueue('Create API key', () => apiPlatformService.createApiKey(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'API key created.' }); },
  });

  const revokeApiKey = useMutation({
    mutationFn: (input: RevokeApiKeyInput) => runOrQueue('Revoke API key', () => apiPlatformService.revokeApiKey(input)),
    onSuccess: () => { invalidateAll(client); appToast.info({ title: 'API key revoked.' }); },
  });

  const createOAuthApp = useMutation({
    mutationFn: (input: CreateOAuthAppInput) => runOrQueue('Create OAuth app', () => apiPlatformService.createOAuthApp(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'OAuth app created.' }); },
  });

  const publishOAuthApp = useMutation({
    mutationFn: (appId: string) => runOrQueue('Publish OAuth app', () => apiPlatformService.publishOAuthApp(appId)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'OAuth app published.' }); },
  });

  const createWebhook = useMutation({
    mutationFn: (input: CreateWebhookInput) => runOrQueue('Create webhook', () => apiPlatformService.createWebhook(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Webhook created.' }); },
  });

  const testWebhook = useMutation({
    mutationFn: (input: TestWebhookInput) => runOrQueue('Test webhook', () => apiPlatformService.testWebhook(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Webhook test sent.' }); },
  });

  const createSandbox = useMutation({
    mutationFn: (input: CreateSandboxInput) => runOrQueue('Create sandbox', () => apiPlatformService.createSandbox(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Sandbox provisioning started.' }); },
  });

  const publishSdk = useMutation({
    mutationFn: (input: PublishSdkInput) => runOrQueue('Publish SDK', () => apiPlatformService.publishSdk(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'SDK published.' }); },
  });

  const updateRateLimit = useMutation({
    mutationFn: (input: UpdateRateLimitInput) => runOrQueue('Update rate limit', () => apiPlatformService.updateRateLimit(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Rate limit updated.' }); },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') => runOrQueue('Export API data', () => apiPlatformService.exportData(format)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Export complete.' }); },
  });

  return {
    createApiKey,
    revokeApiKey,
    createOAuthApp,
    publishOAuthApp,
    createWebhook,
    testWebhook,
    createSandbox,
    publishSdk,
    updateRateLimit,
    exportData,
  };
}
