import { BellOff } from 'lucide-react';

import { EmptyState } from '@/shared/ui/empty-state';
import { Button } from '@/shared/ui/button';

interface NotificationEmptyProps {
  onRefresh?: () => void;
}

export function NotificationEmpty({ onRefresh }: NotificationEmptyProps) {
  return (
    <EmptyState
      icon={BellOff}
      title="No notifications"
      description="You're all caught up. New alerts will appear here."
      action={
        onRefresh ? (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Refresh
          </Button>
        ) : undefined
      }
    />
  );
}

export function NotificationSkeleton() {
  return (
    <div className="space-y-3 p-4" aria-busy="true" aria-label="Loading notifications">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2 rounded-lg border p-3 animate-pulse">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
