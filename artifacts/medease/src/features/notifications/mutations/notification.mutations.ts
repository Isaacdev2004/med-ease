import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import {
  notificationOfflineQueue,
  notificationService,
} from '@/services/notifications';
import { useAuth } from '@/services/auth/auth-context';

function useNotificationMutationContext() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
  };

  const runOrQueue = (label: string, execute: () => Promise<unknown>) => {
    if (!navigator.onLine) {
      notificationOfflineQueue.enqueue({ label, execute: async () => { await execute(); } });
      appToast.offline('Notification action queued until you are back online.');
      return Promise.resolve();
    }
    return execute();
  };

  return { userId, invalidate, runOrQueue };
}

export function useNotificationMutations() {
  const { userId, invalidate, runOrQueue } = useNotificationMutationContext();

  const markRead = useMutation({
    mutationFn: (ids: string[]) => runOrQueue('Mark read', () => notificationService.markRead(userId, ids)),
    onSuccess: invalidate,
  });

  const markUnread = useMutation({
    mutationFn: (ids: string[]) => runOrQueue('Mark unread', () => notificationService.markUnread(userId, ids)),
    onSuccess: invalidate,
  });

  const archive = useMutation({
    mutationFn: (ids: string[]) => runOrQueue('Archive', () => notificationService.archive(userId, ids)),
    onSuccess: invalidate,
  });

  const pin = useMutation({
    mutationFn: ({ id, pinned }: { id: string; pinned: boolean }) =>
      runOrQueue('Pin', () => notificationService.pin(userId, id, pinned)),
    onSuccess: invalidate,
  });

  const dismiss = useMutation({
    mutationFn: (id: string) => runOrQueue('Dismiss', () => notificationService.dismiss(userId, id)),
    onSuccess: invalidate,
  });

  const markAllRead = useMutation({
    mutationFn: () => runOrQueue('Mark all read', () => notificationService.markAllRead(userId)),
    onSuccess: invalidate,
  });

  return { markRead, markUnread, archive, pin, dismiss, markAllRead };
}
