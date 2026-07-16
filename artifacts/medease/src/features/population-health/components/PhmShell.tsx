import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { PhmSectionContent } from '@/features/population-health/components/PhmSections';
import { PhmTabs, getPhmSectionFromPath } from '@/features/population-health/components/PhmTabs';
import { usePhmPermissions } from '@/features/population-health/hooks/use-phm-permissions';
import type { PhmFilters } from '@/services/population-health/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface PhmShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
}

export function PhmShell({
  basePath,
  variant = 'professional',
  title = 'Population Health',
  facilityId = 'fac-001',
}: PhmShellProps) {
  const [location] = useLocation();
  const perms = usePhmPermissions();
  const section = getPhmSectionFromPath(location);

  const scopedFilters = useMemo((): PhmFilters => ({ facilityId }), [facilityId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view population health data." />
      </PageShell>
    );
  }

  return (
    <PageShell title={title} subtitle="Enterprise population health management, care gap closure, risk stratification, registries, and outreach campaigns.">
      <div className="space-y-6">
        <PhmTabs basePath={basePath} variant={variant} />
        <PhmSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
