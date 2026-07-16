import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { ResearchSectionContent } from '@/features/research/components/ResearchSections';
import { ResearchTabs, getResearchSectionFromPath } from '@/features/research/components/ResearchTabs';
import { useResearchPermissions } from '@/features/research/hooks/use-research-permissions';
import type { ResearchFilters } from '@/services/research/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface ResearchShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
}

export function ResearchShell({
  basePath,
  variant = 'professional',
  title = 'Clinical Research',
  facilityId = 'fac-001',
}: ResearchShellProps) {
  const [location] = useLocation();
  const perms = useResearchPermissions();
  const section = getResearchSectionFromPath(location, variant);
  const scopedFilters = useMemo((): ResearchFilters => ({ facilityId }), [facilityId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view clinical research." />
      </PageShell>
    );
  }

  return (
    <PageShell title={title} subtitle="Enterprise CRMS — clinical trials, participant recruitment, eConsent, protocol compliance, adverse event reporting, biospecimen tracking, and research analytics.">
      <div className="space-y-6">
        <ResearchTabs basePath={basePath} variant={variant} />
        <ResearchSectionContent section={section} filters={scopedFilters} variant={variant} />
      </div>
    </PageShell>
  );
}
