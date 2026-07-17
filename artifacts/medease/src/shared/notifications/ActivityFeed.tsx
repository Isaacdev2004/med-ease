import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  BedDouble,
  Calendar,
  FileText,
  Pill,
  Route,
  User,
} from 'lucide-react';

import type {
  ActivityEvent,
  ActivityEventCategory,
} from '@/services/notifications/notification.types';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

const CATEGORY_ICONS: Record<ActivityEventCategory, typeof Activity> = {
  appointment: Calendar,
  transfer: Route,
  admission: BedDouble,
  medication: Pill,
  profile: User,
  care_pathway: Activity,
  bed: BedDouble,
  audit: FileText,
  system: Activity,
};

interface ActivityTimelineItemProps {
  event: ActivityEvent;
  onOpen?: (event: ActivityEvent) => void;
}

export function ActivityTimelineItem({
  event,
  onOpen,
}: ActivityTimelineItemProps) {
  const Icon = CATEGORY_ICONS[event.category];

  return (
    <li className="relative flex gap-3 pb-6 last:pb-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium">{event.title}</h3>
          <time
            className="text-xs text-muted-foreground shrink-0"
            dateTime={event.timestamp}
          >
            {formatDistanceToNow(new Date(event.timestamp), {
              addSuffix: true,
            })}
          </time>
        </div>
        {event.description ? (
          <p className="text-sm text-muted-foreground">{event.description}</p>
        ) : null}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {event.actor ? <span>{event.actor}</span> : null}
          {event.organization ? <span>· {event.organization}</span> : null}
          {event.status ? <span>· {event.status}</span> : null}
        </div>
        {event.href ? (
          <Button
            size="sm"
            variant="link"
            className="h-auto p-0"
            onClick={() => onOpen?.(event)}
          >
            View details
          </Button>
        ) : null}
      </div>
    </li>
  );
}

interface ActivityFeedProps {
  events: ActivityEvent[];
  loading?: boolean;
  className?: string;
  onOpen?: (event: ActivityEvent) => void;
}

export function ActivityFeed({
  events,
  loading,
  className,
  onOpen,
}: ActivityFeedProps) {
  if (loading) {
    return (
      <div
        className={cn('space-y-4', className)}
        aria-busy="true"
        aria-label="Loading activity"
      />
    );
  }

  if (events.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        No recent activity.
      </p>
    );
  }

  return (
    <ol className={cn('space-y-0', className)} aria-label="Activity feed">
      {events.map((event) => (
        <ActivityTimelineItem key={event.id} event={event} onOpen={onOpen} />
      ))}
    </ol>
  );
}
