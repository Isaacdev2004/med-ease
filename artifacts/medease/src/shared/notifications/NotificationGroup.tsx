import type { ReactNode } from 'react';

import { NotificationItem } from '@/shared/notifications/NotificationItem';
import type { MedNotification } from '@/services/notifications/notification.types';
import { cn } from '@/shared/lib/utils';

interface NotificationGroupProps {
  title: string;
  notifications: MedNotification[];
  onMarkRead?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
  onArchive?: (id: string) => void;
  onPin?: (id: string, pinned: boolean) => void;
  onDismiss?: (id: string) => void;
  onOpen?: (notification: MedNotification) => void;
  compact?: boolean;
  className?: string;
  emptyFallback?: ReactNode;
}

export function NotificationGroup({
  title,
  notifications,
  emptyFallback,
  className,
  ...handlers
}: NotificationGroupProps) {
  if (notifications.length === 0) return emptyFallback ?? null;

  return (
    <section className={cn('space-y-3', className)} aria-label={title}>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="space-y-2" role="list">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            {...handlers}
          />
        ))}
      </div>
    </section>
  );
}
