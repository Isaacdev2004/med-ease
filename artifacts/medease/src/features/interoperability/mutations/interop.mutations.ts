import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { interoperabilityOfflineQueue } from '@/services/interoperability/offline-sync';
import { interoperabilityService } from '@/services/interoperability/interoperability.service';
import type {
  CreateApiClientInput,
  CreateEndpointInput,
  PublishWebhookInput,
  RegisterSmartAppInput,
  RetryJobInput,
  RunSyncInput,
  UpdateEndpointInput,
  ValidateMappingInput,
} from '@/services/interoperability/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    interoperabilityOfflineQueue.enqueue({ label, execute: () => execute().then(() => undefined) });
    appToast.offline('Interoperability update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.interoperability.all });
}

export function useInteropMutations() {
  const client = useQueryClient();

  const createEndpoint = useMutation({
    mutationFn: (input: CreateEndpointInput) => runOrQueue('Create endpoint', () => interoperabilityService.createEndpoint(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Endpoint created.' }); },
  });

  const updateEndpoint = useMutation({
    mutationFn: (input: UpdateEndpointInput) => runOrQueue('Update endpoint', () => interoperabilityService.updateEndpoint(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Endpoint updated.' }); },
  });

  const runSync = useMutation({
    mutationFn: (input: RunSyncInput) => runOrQueue('Run sync', () => interoperabilityService.runSync(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Synchronization started.' }); },
  });

  const retryJob = useMutation({
    mutationFn: (input: RetryJobInput) => runOrQueue('Retry job', () => interoperabilityService.retryJob(input)),
    onSuccess: () => { invalidateAll(client); appToast.info({ title: 'Job retry queued.' }); },
  });

  const validateMapping = useMutation({
    mutationFn: (input: ValidateMappingInput) => runOrQueue('Validate mapping', () => interoperabilityService.validateMapping(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Mapping validated.' }); },
  });

  const publishWebhook = useMutation({
    mutationFn: (input: PublishWebhookInput) => runOrQueue('Publish webhook', () => interoperabilityService.publishWebhook(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Webhook published.' }); },
  });

  const createApiClient = useMutation({
    mutationFn: (input: CreateApiClientInput) => runOrQueue('Create API client', () => interoperabilityService.createApiClient(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'API client created.' }); },
  });

  const regenerateApiKey = useMutation({
    mutationFn: (keyId: string) => runOrQueue('Regenerate API key', () => interoperabilityService.regenerateApiKey(keyId)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'API key regenerated.' }); },
  });

  const registerSmartApp = useMutation({
    mutationFn: (input: RegisterSmartAppInput) => runOrQueue('Register SMART app', () => interoperabilityService.registerSmartApp(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'SMART app registered.' }); },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') => runOrQueue('Export interop', () => interoperabilityService.exportData(format)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Export complete.' }); },
  });

  const favorite = useMutation({
    mutationFn: ({ userId, entityType, entityId }: { userId: string; entityType: 'endpoint' | 'mapping' | 'webhook' | 'fhir_server' | 'smart_app'; entityId: string }) =>
      runOrQueue('Favorite', () => interoperabilityService.favorite(userId, entityType, entityId)),
    onSuccess: () => invalidateAll(client),
  });

  return {
    createEndpoint,
    updateEndpoint,
    runSync,
    retryJob,
    validateMapping,
    publishWebhook,
    createApiClient,
    regenerateApiKey,
    registerSmartApp,
    exportData,
    favorite,
  };
}
