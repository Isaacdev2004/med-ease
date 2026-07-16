import { CACHE_TIMES, REFETCH_INTERVALS } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import type { NotificationFilters } from '@/services/notifications/notification.types';
import { notificationService } from '@/services/notifications/notification.service';

export const notificationQueries = {
  list: (userId: string, filters?: NotificationFilters) => ({
    queryKey: [...queryKeys.notifications.list(userId), filters ?? {}] as const,
    queryFn: () => notificationService.list(userId, filters),
    staleTime: CACHE_TIMES.notifications,
    refetchInterval: REFETCH_INTERVALS.notifications,
  }),
  unreadCount: (userId: string) => ({
    queryKey: queryKeys.notifications.unreadCount(userId),
    queryFn: () => notificationService.unreadCount(userId),
    staleTime: CACHE_TIMES.notifications,
    refetchInterval: REFETCH_INTERVALS.notifications,
  }),
  activity: (userId: string) => ({
    queryKey: [...queryKeys.notifications.all, 'activity', userId] as const,
    queryFn: () => notificationService.listActivity(userId),
    staleTime: CACHE_TIMES.patientTimeline,
    refetchInterval: REFETCH_INTERVALS.patientTimeline,
  }),
  reminders: (userId: string) => ({
    queryKey: [...queryKeys.notifications.all, 'reminders', userId] as const,
    queryFn: () => notificationService.listReminders(userId),
    staleTime: CACHE_TIMES.dashboard,
  }),
};
