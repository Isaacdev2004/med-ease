import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface KpiDashboardGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

/** Standard KPI row — Critical alerts and metrics above filters and tables. */
export function KpiDashboardGrid({
  children,
  columns = 4,
  className,
}: KpiDashboardGridProps) {
  return (
    <div
      className={cn(
        'grid gap-4',
        columns === 2 && 'md:grid-cols-2',
        columns === 3 && 'md:grid-cols-2 xl:grid-cols-3',
        columns === 4 && 'md:grid-cols-2 xl:grid-cols-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
