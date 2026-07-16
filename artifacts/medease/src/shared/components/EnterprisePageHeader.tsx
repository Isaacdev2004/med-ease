import type { ReactNode } from 'react';

import { TYPOGRAPHY } from '@/config/design-tokens';
import { cn } from '@/shared/lib/utils';

interface EnterprisePageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: ReactNode;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  status?: ReactNode;
  lastUpdated?: string;
  className?: string;
}

/** Enterprise page header — title, breadcrumbs, actions, status, last updated. */
export function EnterprisePageHeader({
  title,
  subtitle,
  breadcrumbs,
  primaryAction,
  secondaryActions,
  status,
  lastUpdated,
  className,
}: EnterprisePageHeaderProps) {
  return (
    <header className={cn('space-y-4 mb-6', className)}>
      {breadcrumbs ? <div>{breadcrumbs}</div> : null}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className={TYPOGRAPHY.h1}>{title}</h1>
            {status}
          </div>
          {subtitle ? (
            <p className="text-muted-foreground max-w-3xl">{subtitle}</p>
          ) : null}
          {lastUpdated ? (
            <p className="text-xs text-muted-foreground">Last updated {lastUpdated}</p>
          ) : null}
        </div>
        {(primaryAction || secondaryActions) && (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {secondaryActions}
            {primaryAction}
          </div>
        )}
      </div>
    </header>
  );
}
