import type { ReactNode } from 'react';

import { KpiDashboardGrid } from '@/shared/components/KpiDashboardGrid';
import { PageShell } from '@/shared/components/PageShell';

interface DataPageLayoutProps {
  title: string;
  subtitle?: string;
  primaryAction?: ReactNode;
  secondaryActions?: ReactNode;
  status?: ReactNode;
  lastUpdated?: string;
  metrics?: ReactNode;
  toolbar?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Standard data page: Header → KPIs → Toolbar → Filters → Content → Pagination/Actions
 */
export function DataPageLayout({
  title,
  subtitle,
  primaryAction,
  secondaryActions,
  status,
  lastUpdated,
  metrics,
  toolbar,
  filters,
  children,
  footer,
  className,
}: DataPageLayoutProps) {
  return (
    <PageShell
      title={title}
      subtitle={subtitle}
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
      status={status}
      lastUpdated={lastUpdated}
      toolbar={toolbar}
      className={className}
    >
      {metrics ? <KpiDashboardGrid>{metrics}</KpiDashboardGrid> : null}
      {filters}
      {children}
      {footer}
    </PageShell>
  );
}
