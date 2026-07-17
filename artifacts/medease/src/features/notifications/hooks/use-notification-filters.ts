import { useMemo } from 'react';
import { useSearchParams } from 'wouter';

import { useUrlFilters } from '@/shared/data/hooks/use-url-filters';
import type { NotificationFilters } from '@/services/notifications/notification.types';

export function useNotificationFilters() {
  const url = useUrlFilters();
  const [searchParams] = useSearchParams();
  const unreadOnly = searchParams.get('unread') === '1';

  const filters: NotificationFilters = useMemo(
    () => ({
      q: url.q,
      category: (url.status as NotificationFilters['category']) || undefined,
      priority: url.sort as NotificationFilters['priority'],
      unread: unreadOnly,
    }),
    [url.q, url.status, url.sort, unreadOnly],
  );

  return {
    filters,
    q: url.q,
    category: url.status,
    priority: url.sort,
    unreadOnly,
    setSearch: (value: string) => url.setParam('q', value || null),
    setCategory: (value: string) => url.setParam('status', value || null),
    setPriority: (value: string) => url.setParam('sort', value || null),
    setUnreadOnly: (value: boolean) =>
      url.setParam('unread', value ? '1' : null),
    clearFilters: url.clearFilters,
    page: url.page,
    pageSize: url.pageSize,
    setPage: (page: number) => url.setParam('page', String(page)),
    setPageSize: (size: number) => url.setParam('pageSize', String(size)),
  };
}
