import type { ReactNode } from 'react';

import { StatusBadge } from '@/shared/components/StatusBadge';
import type { HealthcareStatus } from '@/config/design-tokens';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { cn } from '@/shared/lib/utils';

interface MetricCardProps {
  title: string;
  value: ReactNode;
  description?: string;
  status?: HealthcareStatus;
  footer?: ReactNode;
  actions?: ReactNode;
  loading?: boolean;
  className?: string;
}

/** Metric card with optional healthcare status and footer actions. */
export function MetricCard({
  title,
  value,
  description,
  status,
  footer,
  actions,
  loading,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn('flex flex-col overflow-hidden hover-elevate transition-all duration-200', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {status ? <StatusBadge status={status} /> : null}
      </CardHeader>
      <CardContent className="flex-1">
        {loading ? (
          <Skeleton className="h-10 w-32" />
        ) : (
          <div className="text-3xl font-bold tracking-tight">{value}</div>
        )}
      </CardContent>
      {footer || actions ? (
        <CardFooter className="flex items-center justify-between gap-2 border-t bg-muted/20 py-3">
          <div className="text-xs text-muted-foreground">{footer}</div>
          {actions}
        </CardFooter>
      ) : null}
    </Card>
  );
}
