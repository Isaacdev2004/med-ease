import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { WorkforceSectionContent } from '@/features/workforce/components/WorkforceSections';
import { WorkforceTabs, getWorkforceSectionFromPath } from '@/features/workforce/components/WorkforceTabs';
import { useWorkforcePermissions } from '@/features/workforce/hooks/use-workforce-permissions';
import type { WorkforceFilters } from '@/services/workforce/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface WorkforceShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
  departmentId?: string;
  employeeId?: string;
}

export function WorkforceShell({
  basePath,
  variant = 'professional',
  title = 'Workforce',
  facilityId,
  departmentId,
  employeeId,
}: WorkforceShellProps) {
  const [location] = useLocation();
  const perms = useWorkforcePermissions();
  const section = getWorkforceSectionFromPath(location);

  const scopedFilters = useMemo((): WorkforceFilters => {
    const filters: WorkforceFilters = {};
    if (facilityId) filters.facilityId = facilityId;
    if (departmentId) filters.departmentId = departmentId;
    if (employeeId) filters.employeeId = employeeId;
    else if (variant === 'professional') filters.employeeId = 'emp-00001';
    return filters;
  }, [facilityId, departmentId, employeeId, variant]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view workforce data." />
      </PageShell>
    );
  }

  return (
    <PageShell title={title} subtitle="Enterprise HR, workforce management, staff scheduling, attendance, training, credentials, and analytics.">
      <div className="space-y-6">
        <WorkforceTabs basePath={basePath} variant={variant} />
        <WorkforceSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
