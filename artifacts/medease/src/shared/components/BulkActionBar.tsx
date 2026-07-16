import type { ReactNode } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  actions?: ReactNode;
  className?: string;
}

/** Appears when table rows are selected — permission-gated actions go in `actions`. */
export function BulkActionBar({
  selectedCount,
  onClear,
  actions,
  className,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-lg border bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>{selectedCount} selected</span>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
