import type { TimelineItem } from '@/shared/ui/timeline';
import { Timeline } from '@/shared/ui/timeline';
import { cn } from '@/shared/lib/utils';

export interface TimelineEventProps {
  items: TimelineItem[];
  className?: string;
  'aria-label'?: string;
}

/** Healthcare timeline wrapper — chronological care events only. */
export function TimelineEvent({
  items,
  className,
  'aria-label': ariaLabel = 'Care timeline',
}: TimelineEventProps) {
  return (
    <div className={cn(className)} role="list" aria-label={ariaLabel}>
      <Timeline items={items} />
    </div>
  );
}
