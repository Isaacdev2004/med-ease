import { X } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface FilterChipsProps {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
  onClearAll?: () => void;
  className?: string;
}

/** Displays active filters as removable chips — synced with URL parameters. */
export function FilterChips({ filters, onRemove, onClearAll, className }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {filters.map((filter) => (
        <Badge key={filter.key} variant="secondary" className="gap-1 pr-1">
          <span>
            {filter.label}: {filter.value}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            aria-label={`Remove ${filter.label} filter`}
            onClick={() => onRemove(filter.key)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      {onClearAll ? (
        <Button type="button" variant="ghost" size="sm" onClick={onClearAll}>
          Clear all
        </Button>
      ) : null}
    </div>
  );
}
