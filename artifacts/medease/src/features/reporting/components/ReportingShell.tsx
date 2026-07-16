import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { ReportingSectionContent } from '@/features/reporting/components/ReportingSections';
import { ReportingTabs, getReportingSectionFromPath } from '@/features/reporting/components/ReportingTabs';
import { useReportingPermissions } from '@/features/reporting/hooks/use-reporting-permissions';
import type { ReportFilters } from '@/services/reporting/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface ReportingShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
  userId?: string;
}

export function ReportingShell({
  basePath,
  variant = 'professional',
  title = 'Enterprise Reporting',
  facilityId = 'fac-001',
  userId,
}: ReportingShellProps) {
  const [location] = useLocation();
  const perms = useReportingPermissions();
  const section = getReportingSectionFromPath(location);
  const scopedFilters = useMemo((): ReportFilters => ({ facilityId, userId }), [facilityId, userId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view reports." />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise reporting and report designer — clinical, financial, compliance, and operational analytics with scheduled delivery and multi-format exports."
    >
      <div className="space-y-6">
        <ReportingTabs basePath={basePath} variant={variant} />
        <ReportingSectionContent section={section} filters={scopedFilters} variant={variant} />
      </div>
    </PageShell>
  );
}
