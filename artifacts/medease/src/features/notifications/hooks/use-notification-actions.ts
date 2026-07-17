import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { useNotificationMutations } from '@/features/notifications/mutations/notification.mutations';
import type { MedNotification } from '@/services/notifications/notification.types';
import { appToast } from '@/services/api/toast';

export function useNotificationActions() {
  const [, setLocation] = useLocation();
  const {
    markRead,
    markUnread,
    archive,
    pin,
    dismiss,
    markAllRead: markAllReadMutation,
  } = useNotificationMutations();

  return useMemo(
    () => ({
      onMarkRead: (id: string) => void markRead.mutateAsync([id]),
      onMarkUnread: (id: string) => void markUnread.mutateAsync([id]),
      onArchive: (id: string) => void archive.mutateAsync([id]),
      onPin: (id: string, pinned: boolean) =>
        void pin.mutateAsync({ id, pinned }),
      onDismiss: (id: string) => void dismiss.mutateAsync(id),
      onOpen: (notification: MedNotification) => {
        if (!notification.read) void markRead.mutateAsync([notification.id]);
        if (notification.target?.href) setLocation(notification.target.href);
      },
      markAllRead: async () => {
        await markAllReadMutation.mutateAsync();
        appToast.success({ title: 'All notifications marked as read' });
      },
    }),
    [
      archive,
      dismiss,
      markAllReadMutation,
      markRead,
      markUnread,
      pin,
      setLocation,
    ],
  );
}
