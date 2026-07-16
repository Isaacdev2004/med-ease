import { cn } from '@/shared/lib/utils';

interface NotificationBadgeProps {
  count: number;
  className?: string;
  max?: number;
}

/** Sidebar and header unread badge — updates via React Query. */
export function NotificationBadge({ count, className, max = 99 }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const label = count > max ? `${max}+` : String(count);

  return (
    <span
      className={cn(
        'inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-destructive-foreground',
        className,
      )}
      aria-label={`${count} unread`}
    >
      {label}
    </span>
  );
}

interface UnreadIndicatorProps {
  visible?: boolean;
  className?: string;
}

export function UnreadIndicator({ visible, className }: UnreadIndicatorProps) {
  if (!visible) return null;
  return (
    <span
      className={cn('h-2 w-2 rounded-full bg-primary shrink-0', className)}
      aria-hidden="true"
    />
  );
}
