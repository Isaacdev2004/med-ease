import type { ReactNode } from 'react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface FilterPanelProps {
  title?: string;
  children: ReactNode;
  triggerLabel?: string;
  activeCount?: number;
  className?: string;
  /** Desktop inline panel vs drawer on mobile */
  mode?: 'drawer' | 'inline';
}

/** Filter panel — drawer on mobile, inline on desktop. */
export function FilterPanel({
  title = 'Filters',
  children,
  triggerLabel = 'Filters',
  activeCount = 0,
  className,
  mode = 'drawer',
}: FilterPanelProps) {
  if (mode === 'inline') {
    return (
      <div className={cn('rounded-lg border bg-card p-4', className)}>
        {children}
      </div>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {triggerLabel}
          {activeCount > 0 ? (
            <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
