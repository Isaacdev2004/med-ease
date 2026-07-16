import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { PublicHealthSectionContent } from '@/features/public-health/components/PublicHealthSections';
import { PublicHealthTabs, getPublicHealthSectionFromPath } from '@/features/public-health/components/PublicHealthTabs';
import { usePublicHealthPermissions } from '@/features/public-health/hooks/use-public-health-permissions';
import type { PublicHealthFilters } from '@/services/public-health/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface PublicHealthShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
}

export function PublicHealthShell({
  basePath,
  variant = 'professional',
  title = 'Public Health',
  facilityId = 'fac-001',
}: PublicHealthShellProps) {
  const [location] = useLocation();
  const perms = usePublicHealthPermissions();
  const section = getPublicHealthSectionFromPath(location, variant);
  const scopedFilters = useMemo((): PublicHealthFilters => ({ facilityId }), [facilityId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view public health." />
      </PageShell>
    );
  }

  return (
    <PageShell title={title} subtitle="Enterprise public health — disease surveillance, immunization registries, outbreak response, contact tracing, SDOH, and community health analytics.">
      <div className="space-y-6">
        <PublicHealthTabs basePath={basePath} variant={variant} />
        <PublicHealthSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
