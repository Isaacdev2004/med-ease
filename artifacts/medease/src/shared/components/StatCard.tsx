import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { cn } from '@/shared/lib/utils';

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: LucideIcon;
  trend?: ReactNode;
  loading?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  loading,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="min-w-0 flex-1 text-sm font-medium leading-snug text-muted-foreground whitespace-normal">
          {label}
        </CardTitle>
        {Icon ? (
          <div className="rounded-full bg-muted p-2">
            <Icon
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold tracking-tight">{value}</div>
        )}
        {(hint || trend) && !loading ? (
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            {hint ? <span>{hint}</span> : <span />}
            {trend}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
