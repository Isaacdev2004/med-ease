import { Link } from 'wouter';
import { Bell, CheckCheck } from 'lucide-react';

import { getPortalForRole } from '@/config/permissions';
import { PORTAL_PATHS } from '@/config/routes';
import { useNotificationActions } from '@/features/notifications/hooks/use-notification-actions';
import {
  useNotifications,
  useUnreadNotificationCount,
} from '@/features/notifications/hooks/use-notifications';
import { NotificationBadge } from '@/shared/notifications/NotificationBadge';
import { NotificationEmpty, NotificationSkeleton } from '@/shared/notifications/NotificationEmpty';
import { NotificationGroup } from '@/shared/notifications/NotificationGroup';
import { RealtimeStatus } from '@/shared/notifications/RealtimeStatus';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { useAuth } from '@/services/auth/auth-context';

interface NotificationCenterPanelProps {
  notificationsPath?: string;
}

/** Global in-app notification center — available in every authenticated portal header. */
export function NotificationCenterPanel({
  notificationsPath,
}: NotificationCenterPanelProps) {
  const { isOffline, user } = useAuth();
  const notificationsQuery = useNotifications();
  const unreadQuery = useUnreadNotificationCount();
  const actions = useNotificationActions();

  const items = notificationsQuery.data ?? [];
  const pinned = items.filter((item) => item.pinned);
  const unread = items.filter((item) => !item.read && !item.pinned);
  const read = items.filter((item) => item.read && !item.pinned);
  const unreadCount = unreadQuery.data ?? items.filter((item) => !item.read).length;

  const viewAllPath =
    notificationsPath ??
    (user ? `${PORTAL_PATHS[getPortalForRole(user.role)]}/notifications` : '/patient/notifications');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5">
              <NotificationBadge count={unreadCount} className="h-5 min-w-5 text-[10px]" />
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(100vw-2rem,24rem)] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <DropdownMenuLabel className="p-0 text-base">Notifications</DropdownMenuLabel>
          <RealtimeStatus connected={!notificationsQuery.isFetching} offline={isOffline} />
        </div>
        <DropdownMenuSeparator className="m-0" />
        {notificationsQuery.isLoading ? (
          <NotificationSkeleton />
        ) : items.length === 0 ? (
          <div className="p-2">
            <NotificationEmpty onRefresh={() => void notificationsQuery.refetch()} />
          </div>
        ) : (
          <ScrollArea className="max-h-[min(60vh,24rem)]">
            <div className="space-y-4 p-3">
              <NotificationGroup
                title="Pinned"
                notifications={pinned}
                compact
                {...actions}
              />
              <NotificationGroup
                title="Unread"
                notifications={unread}
                compact
                {...actions}
              />
              <NotificationGroup
                title="Earlier"
                notifications={read.slice(0, 5)}
                compact
                {...actions}
              />
            </div>
          </ScrollArea>
        )}
        <DropdownMenuSeparator className="m-0" />
        <div className="flex items-center justify-between gap-2 p-2">
          <DropdownMenuItem
            className="flex-1 justify-center"
            onClick={() => void actions.markAllRead()}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </DropdownMenuItem>
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={viewAllPath}>View all</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
