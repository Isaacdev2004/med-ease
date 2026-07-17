import { formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle2,
  Info,
  Pill,
  Route,
  Shield,
  Wifi,
} from 'lucide-react';

import type {
  MedNotification,
  NotificationType,
} from '@/services/notifications/notification.types';
import { NotificationActions } from '@/shared/notifications/NotificationActions';
import { UnreadIndicator } from '@/shared/notifications/NotificationBadge';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { cn } from '@/shared/lib/utils';

const TYPE_ICONS: Partial<Record<NotificationType, typeof Bell>> = {
  critical: AlertTriangle,
  emergency: AlertTriangle,
  warning: AlertTriangle,
  success: CheckCircle2,
  appointment: Calendar,
  medication: Pill,
  transfer: Route,
  security: Shield,
  offline_sync: Wifi,
  information: Info,
};

interface NotificationItemProps {
  notification: MedNotification;
  onMarkRead?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onArchive?: (id: string) => void;
  onPin?: (id: string, pinned: boolean) => void;
  onDismiss?: (id: string) => void;
  onOpen?: (notification: MedNotification) => void;
  compact?: boolean;
  className?: string;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onMarkUnread,
  onArchive,
  onPin,
  onDismiss,
  onOpen,
  compact,
  className,
}: NotificationItemProps) {
  const Icon = TYPE_ICONS[notification.type] ?? Bell;
  const isCritical = notification.priority === 'critical';

  return (
    <article
      className={cn(
        'rounded-lg border p-3 transition-colors',
        !notification.read && 'bg-muted/40 border-primary/20',
        notification.pinned && 'ring-1 ring-primary/30',
        isCritical && 'border-destructive/40',
        className,
      )}
      aria-live={!notification.read ? 'polite' : undefined}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
            isCritical
              ? 'bg-destructive/10 text-destructive'
              : 'bg-primary/10 text-primary',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <UnreadIndicator visible={!notification.read} />
              <h3 className="font-medium text-sm truncate">
                {notification.title}
              </h3>
              {notification.pinned ? (
                <span className="text-[10px] uppercase tracking-wide text-primary font-semibold">
                  Pinned
                </span>
              ) : null}
            </div>
            <StatusBadge
              status={
                notification.priority === 'critical'
                  ? 'critical'
                  : notification.priority === 'high'
                    ? 'warning'
                    : 'info'
              }
              label={notification.priority}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {notification.message}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <time dateTime={notification.timestamp}>
              {formatDistanceToNow(new Date(notification.timestamp), {
                addSuffix: true,
              })}
            </time>
            {notification.actor ? (
              <span>· {notification.actor.name}</span>
            ) : null}
          </div>
          {!compact ? (
            <NotificationActions
              notification={notification}
              onMarkRead={onMarkRead}
              onMarkUnread={onMarkUnread}
              onArchive={onArchive}
              onPin={onPin}
              onDismiss={onDismiss}
              onOpen={onOpen}
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
