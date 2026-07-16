import type { QueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/services/api/query-keys';
import {
  mergeCounter,
  mergeListItem,
  subscribeToRealtimeChannel,
} from '@/services/api/realtime';
import {
  createDemoNotification,
  notificationService,
} from '@/services/notifications/notification.service';
import type { MedNotification, RealtimeEvent } from '@/services/notifications/notification.types';

export interface RealtimeServiceOptions {
  queryClient: QueryClient;
  userId: string;
  organizationId: string;
  enabled?: boolean;
}

/** Supabase-ready realtime bridge — merges events into React Query cache. */
export function startNotificationRealtime({
  queryClient,
  userId,
  organizationId,
  enabled = true,
}: RealtimeServiceOptions) {
  if (!enabled || !userId) {
    return { unsubscribe: () => undefined };
  }

  const channel = `notifications:${organizationId}:${userId}`;

  const subscription = subscribeToRealtimeChannel<MedNotification[]>({
    channel,
    queryClient,
    queryKey: queryKeys.notifications.list(userId),
    merge: (current, event) => mergeListItem(current, event as unknown as MedNotification),
  });

  const countSubscription = subscribeToRealtimeChannel<number>({
    channel: `${channel}:count`,
    queryClient,
    queryKey: queryKeys.notifications.unreadCount(userId),
    merge: (current, event) => mergeCounter(current, event as unknown as number),
  });

  let demoTimer: number | undefined;
  if (import.meta.env.DEV) {
    demoTimer = window.setInterval(() => {
      void pushRealtimeNotification(queryClient, userId, {
        type: 'notification_created',
        organizationId,
        timestamp: new Date().toISOString(),
        payload: createDemoNotification({
          title: 'Live sync update',
          message: 'Demo realtime event merged into cache without page refresh.',
          type: 'realtime_update',
          priority: 'informational',
        }),
      });
    }, 45_000);
  }

  return {
    unsubscribe() {
      subscription.unsubscribe();
      countSubscription.unsubscribe();
      if (demoTimer) window.clearInterval(demoTimer);
    },
  };
}

export async function pushRealtimeNotification(
  queryClient: QueryClient,
  userId: string,
  event: RealtimeEvent<MedNotification>,
) {
  const notification = event.payload;
  await notificationService.add(userId, notification);

  queryClient.setQueryData<MedNotification[]>(
    queryKeys.notifications.list(userId),
    (current) => mergeListItem(current, notification),
  );

  queryClient.setQueryData<number>(
    queryKeys.notifications.unreadCount(userId),
    (current) => mergeCounter(current, notification.read ? 0 : 1),
  );
}
