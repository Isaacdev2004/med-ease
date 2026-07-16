import { formatDistanceToNow } from 'date-fns';
import { AlarmClock, Calendar, Pill, Route, Syringe } from 'lucide-react';

import type { ReminderItem } from '@/services/notifications/notification.types';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

const REMINDER_ICONS = {
  medication: Pill,
  appointment: Calendar,
  transfer: Route,
  follow_up: AlarmClock,
  vaccination: Syringe,
  review: AlarmClock,
} as const;

interface ReminderCardProps {
  reminder: ReminderItem;
  onComplete?: (id: string) => void;
  onSnooze?: (id: string) => void;
  className?: string;
}

export function ReminderCard({ reminder, onComplete, onSnooze, className }: ReminderCardProps) {
  const Icon = REMINDER_ICONS[reminder.type];

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="flex-1 space-y-1">
          <CardTitle className="text-base">{reminder.title}</CardTitle>
          {reminder.description ? (
            <p className="text-sm text-muted-foreground">{reminder.description}</p>
          ) : null}
        </div>
        <StatusBadge
          status={reminder.priority === 'critical' ? 'critical' : reminder.priority === 'high' ? 'warning' : 'info'}
        />
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Due {formatDistanceToNow(new Date(reminder.dueAt), { addSuffix: true })}
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" onClick={() => onComplete?.(reminder.id)}>
          Complete
        </Button>
        <Button size="sm" variant="outline" onClick={() => onSnooze?.(reminder.id)}>
          Snooze
        </Button>
      </CardFooter>
    </Card>
  );
}

interface AlertCardProps {
  title: string;
  message: string;
  priority?: 'critical' | 'high' | 'medium';
  timestamp?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Pinned critical alert card for dashboards. */
export function AlertCard({
  title,
  message,
  priority = 'high',
  timestamp,
  action,
  className,
}: AlertCardProps) {
  return (
    <Card
      className={cn(
        priority === 'critical' && 'border-destructive/50 bg-destructive/5',
        className,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <StatusBadge status={priority === 'critical' ? 'critical' : 'warning'} label={priority} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">{message}</p>
        {timestamp ? (
          <time className="text-xs text-muted-foreground" dateTime={timestamp}>
            {new Date(timestamp).toLocaleString()}
          </time>
        ) : null}
      </CardContent>
      {action ? <CardFooter>{action}</CardFooter> : null}
    </Card>
  );
}
