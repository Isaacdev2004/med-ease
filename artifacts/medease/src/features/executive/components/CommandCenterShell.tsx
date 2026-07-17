import { useMemo } from 'react';
import { useLocation } from 'wouter';

import {
  CommandCenterTabs,
  getExecutiveSectionFromPath,
} from '@/features/executive/components/CommandCenterTabs';
import { ExecutiveSectionContent } from '@/features/executive/components/ExecutiveSections';
import { useExecutivePermissions } from '@/features/executive/hooks/use-executive-permissions';
import type { ExecutiveFilters } from '@/services/executive/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface CommandCenterShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
}

export function CommandCenterShell({
  basePath,
  variant = 'professional',
  title = 'Executive Command Center',
  facilityId = 'fac-001',
}: CommandCenterShellProps) {
  const [location] = useLocation();
  const perms = useExecutivePermissions();
  const section = getExecutiveSectionFromPath(location, variant);
  const scopedFilters = useMemo(
    (): ExecutiveFilters => ({ facilityId }),
    [facilityId],
  );

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view the executive command center."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise command center — unified KPIs, operational intelligence, scorecards, benchmarking, and strategic initiatives aggregated across the entire Med-ease platform."
    >
      <div className="space-y-6">
        <CommandCenterTabs basePath={basePath} variant={variant} />
        <ExecutiveSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
