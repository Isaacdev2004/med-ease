import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { messagingOfflineQueue } from '@/services/messaging/offline-sync';
import { messagingService } from '@/services/messaging/messaging.service';
import type {
  BroadcastInput,
  CreateCampaignInput,
  CreateTemplateInput,
  MarkReadInput,
  SendMessageInput,
} from '@/services/messaging/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    messagingOfflineQueue.enqueue({ label, execute: () => execute().then(() => undefined) });
    appToast.offline('Messaging update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.messaging.all });
}

export function useMessagingMutations() {
  const client = useQueryClient();

  const send = useMutation({
    mutationFn: (input: SendMessageInput) => runOrQueue('Send message', () => messagingService.send(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Message sent.' }); },
  });

  const markRead = useMutation({
    mutationFn: (input: MarkReadInput) => runOrQueue('Mark read', () => messagingService.markRead(input)),
    onSuccess: () => invalidateAll(client),
  });

  const createTemplate = useMutation({
    mutationFn: (input: CreateTemplateInput) => runOrQueue('Create template', () => messagingService.createTemplate(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Template created.' }); },
  });

  const createCampaign = useMutation({
    mutationFn: (input: CreateCampaignInput) => runOrQueue('Create campaign', () => messagingService.createCampaign(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Campaign created.' }); },
  });

  const broadcast = useMutation({
    mutationFn: (input: BroadcastInput) => runOrQueue('Broadcast', () => messagingService.broadcast(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Broadcast sent.' }); },
  });

  const startCampaign = useMutation({
    mutationFn: (campaignId: string) => runOrQueue('Start campaign', () => messagingService.startCampaign(campaignId)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Campaign started.' }); },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') => runOrQueue('Export messaging', () => messagingService.exportData(format)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Export complete.' }); },
  });

  const favorite = useMutation({
    mutationFn: ({ userId, entityType, entityId }: { userId: string; entityType: 'message' | 'template' | 'campaign' | 'thread'; entityId: string }) =>
      runOrQueue('Favorite', () => messagingService.favorite(userId, entityType, entityId)),
    onSuccess: () => invalidateAll(client),
  });

  return {
    send,
    markRead,
    createTemplate,
    createCampaign,
    broadcast,
    startCampaign,
    exportData,
    favorite,
  };
}
