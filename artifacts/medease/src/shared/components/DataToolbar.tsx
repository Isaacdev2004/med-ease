import type { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

interface DataToolbarProps {
  search?: ReactNode;
  filters?: ReactNode;
  bulkActions?: ReactNode;
  actions?: ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  className?: string;
}

/** Enterprise data toolbar — search, filters, export, refresh, bulk actions, add button. */
export function DataToolbar({
  search,
  filters,
  bulkActions,
  actions,
  onRefresh,
  refreshing,
  className,
}: DataToolbarProps) {
  return (
    <div className={cn('space-y-3 mb-6', className)}>
      {bulkActions}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          {search ? <div className="w-full sm:max-w-sm">{search}</div> : null}
          {filters}
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onRefresh ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Refresh data"
            >
              <RefreshCw className={cn('mr-2 h-4 w-4', refreshing && 'animate-spin')} />
              Refresh
            </Button>
          ) : null}
          {actions}
        </div>
      </div>
    </div>
  );
}
