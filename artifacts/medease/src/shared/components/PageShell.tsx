import type { ReactNode } from 'react';

import { DataToolbar } from '@/shared/components/DataToolbar';
import { EnterprisePageHeader } from '@/shared/components/EnterprisePageHeader';
import { cn } from '@/shared/lib/utils';

interface PageShellProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: ReactNode;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  status?: ReactNode;
  lastUpdated?: string;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Standard page scaffold: header → toolbar → content sections.
 * Pages must not start directly with raw data tables or cards.
 */
export function PageShell({
  title,
  subtitle,
  breadcrumbs,
  primaryAction,
  secondaryActions,
  status,
  lastUpdated,
  toolbar,
  children,
  className,
}: PageShellProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <EnterprisePageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
        status={status}
        lastUpdated={lastUpdated}
      />
      {toolbar}
      <div className="space-y-8">{children}</div>
    </div>
  );
}

export { DataToolbar };
