import { useMemo } from 'react';

import { useActivityFeed } from '@/features/notifications/hooks/use-notifications';
import { useNotificationActions } from '@/features/notifications/hooks/use-notification-actions';
import { useNotificationFilters } from '@/features/notifications/hooks/use-notification-filters';
import { useNotifications } from '@/features/notifications/hooks/use-notifications';
import { useRealtime } from '@/features/notifications/hooks/use-realtime';
import { useReminderQueue } from '@/features/notifications/hooks/use-notifications';
import {
  BulkActionBar,
  DataPageLayout,
  DataPagination,
  DataToolbar,
  FilterChips,
  FilterPanel,
  MetricCard,
  StatCard,
} from '@/shared/components';
import { useRowSelection, useTableState } from '@/shared/data';
import {
  ActivityFeed,
  AlertCard,
  NotificationEmpty,
  NotificationFilters,
  NotificationGroup,
  NotificationSearch,
  NotificationSkeleton,
  RealtimeStatus,
  ReminderCard,
} from '@/shared/notifications';
import type { MedNotification } from '@/services/notifications/notification.types';
import { Button } from '@/shared/ui/button';
import { Bell, Pin } from 'lucide-react';

export default function NotificationsPage() {
  const filterState = useNotificationFilters();
  const notificationsQuery = useNotifications(filterState.filters);
  const activityQuery = useActivityFeed();
  const remindersQuery = useReminderQueue();
  const realtime = useRealtime();
  const actions = useNotificationActions();

  const notifications = notificationsQuery.data ?? [];
  const tableState = useTableState<MedNotification>({
    data: notifications,
    page: filterState.page,
    pageSize: filterState.pageSize,
  });
  const selection = useRowSelection(tableState.rows.map((row) => row.id));

  const pinned = notifications.filter((item) => item.pinned);
  const critical = notifications.filter(
    (item) => item.priority === 'critical' && !item.read,
  );

  const activeFilters = useMemo(() => {
    const chips = [];
    if (filterState.q)
      chips.push({ key: 'q', label: 'Search', value: filterState.q });
    if (filterState.category)
      chips.push({
        key: 'status',
        label: 'Category',
        value: filterState.category,
      });
    if (filterState.priority)
      chips.push({
        key: 'sort',
        label: 'Priority',
        value: filterState.priority,
      });
    if (filterState.unreadOnly)
      chips.push({ key: 'dir', label: 'Filter', value: 'Unread only' });
    return chips;
  }, [
    filterState.category,
    filterState.priority,
    filterState.q,
    filterState.unreadOnly,
  ]);

  return (
    <DataPageLayout
      title="Notifications"
      subtitle="Alerts, reminders, and activity across your organization."
      status={
        <RealtimeStatus
          connected={realtime.connected}
          offline={realtime.offline}
        />
      }
      metrics={
        <>
          <StatCard
            label="Unread"
            value={notifications.filter((item) => !item.read).length}
            icon={Bell}
          />
          <MetricCard
            title="Critical"
            value={critical.length}
            status="critical"
            description="Pinned until acknowledged"
          />
          <MetricCard title="Pinned" value={pinned.length} status="warning" />
          <StatCard
            label="Reminders"
            value={remindersQuery.data?.length ?? 0}
            icon={Pin}
          />
        </>
      }
      toolbar={
        <DataToolbar
          search={
            <NotificationSearch
              defaultValue={filterState.q}
              onSearch={filterState.setSearch}
              loading={notificationsQuery.isFetching}
            />
          }
          filters={
            <FilterPanel activeCount={activeFilters.length}>
              <NotificationFilters
                category={filterState.category}
                priority={filterState.priority}
                unreadOnly={filterState.unreadOnly}
                onCategoryChange={filterState.setCategory}
                onPriorityChange={filterState.setPriority}
                onUnreadOnlyChange={filterState.setUnreadOnly}
              />
            </FilterPanel>
          }
          bulkActions={
            <BulkActionBar
              selectedCount={selection.selectedCount}
              onClear={selection.clearSelection}
              actions={
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      void Promise.all(
                        [...selection.selectedIds].map((id) =>
                          actions.onMarkRead(id),
                        ),
                      )
                    }
                  >
                    Mark read
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      void Promise.all(
                        [...selection.selectedIds].map((id) =>
                          actions.onArchive(id),
                        ),
                      )
                    }
                  >
                    Archive
                  </Button>
                </>
              }
            />
          }
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() => void actions.markAllRead()}
            >
              Mark all read
            </Button>
          }
          onRefresh={() => void notificationsQuery.refetch()}
          refreshing={notificationsQuery.isFetching}
        />
      }
      filters={
        <FilterChips
          filters={activeFilters}
          onRemove={(key) => {
            if (key === 'q') filterState.setSearch('');
            if (key === 'status') filterState.setCategory('');
            if (key === 'sort') filterState.setPriority('');
            if (key === 'dir') filterState.setUnreadOnly(false);
          }}
          onClearAll={filterState.clearFilters}
        />
      }
      footer={
        <DataPagination
          page={tableState.page}
          pageSize={tableState.pageSize}
          total={tableState.total}
          onPageChange={filterState.setPage}
          onPageSizeChange={filterState.setPageSize}
        />
      }
    >
      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {critical.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-destructive">
                Critical Alerts
              </h2>
              {critical.map((item) => (
                <AlertCard
                  key={item.id}
                  title={item.title}
                  message={item.message}
                  priority="critical"
                  timestamp={item.timestamp}
                  action={
                    <Button
                      size="sm"
                      onClick={() => actions.onMarkRead(item.id)}
                    >
                      Acknowledge
                    </Button>
                  }
                />
              ))}
            </section>
          ) : null}

          {notificationsQuery.isLoading ? (
            <NotificationSkeleton />
          ) : notifications.length === 0 ? (
            <NotificationEmpty
              onRefresh={() => void notificationsQuery.refetch()}
            />
          ) : (
            <div className="space-y-6">
              <NotificationGroup
                title="Pinned"
                notifications={pinned}
                {...actions}
              />
              <NotificationGroup
                title="All Notifications"
                notifications={tableState.rows}
                {...actions}
              />
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Reminders
            </h2>
            <div className="space-y-3">
              {(remindersQuery.data ?? []).map((reminder) => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </div>
          </section>
          <section className="space-y-3 rounded-xl border p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Activity Feed
            </h2>
            <ActivityFeed
              events={activityQuery.data ?? []}
              loading={activityQuery.isLoading}
            />
          </section>
        </aside>
      </div>
    </DataPageLayout>
  );
}
