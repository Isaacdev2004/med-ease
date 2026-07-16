import { useQuery } from '@tanstack/react-query';

import { notificationQueries } from '@/features/notifications/queries/notification.queries';
import type { NotificationFilters } from '@/services/notifications/notification.types';
import { useAuth } from '@/services/auth/auth-context';

export function useNotifications(filters?: NotificationFilters) {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  return useQuery({
    ...notificationQueries.list(userId, filters),
    enabled: Boolean(userId),
  });
}

export function useUnreadNotificationCount() {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  return useQuery({
    ...notificationQueries.unreadCount(userId),
    enabled: Boolean(userId),
  });
}

export function useActivityFeed() {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  return useQuery({
    ...notificationQueries.activity(userId),
    enabled: Boolean(userId),
  });
}

export function useReminderQueue() {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  return useQuery({
    ...notificationQueries.reminders(userId),
    enabled: Boolean(userId),
  });
}
