import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import type { SortDirection } from '@/shared/data/hooks/use-table-state';
import { cn } from '@/shared/lib/utils';

interface SortableColumnHeaderProps {
  label: string;
  columnId: string;
  activeSort?: string;
  direction?: SortDirection;
  onSort?: (columnId: string) => void;
  className?: string;
}

/** Sortable table column header with visual direction indicators. */
export function SortableColumnHeader({
  label,
  columnId,
  activeSort,
  direction = 'asc',
  onSort,
  className,
}: SortableColumnHeaderProps) {
  const isActive = activeSort === columnId;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn('-ml-3 h-8 px-2 font-medium', className)}
      onClick={() => onSort?.(columnId)}
      aria-sort={
        isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'
      }
    >
      {label}
      {isActive ? (
        direction === 'asc' ? (
          <ArrowUp className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <ArrowDown className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
        )
      ) : (
        <ArrowUpDown
          className="ml-2 h-3.5 w-3.5 opacity-40"
          aria-hidden="true"
        />
      )}
    </Button>
  );
}
