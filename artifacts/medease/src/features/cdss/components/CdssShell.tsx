import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { CdssSectionContent } from '@/features/cdss/components/CdssSections';
import {
  CdssTabs,
  getCdssSectionFromPath,
} from '@/features/cdss/components/CdssTabs';
import { useCdssPermissions } from '@/features/cdss/hooks/use-cdss-permissions';
import type { CdssFilters } from '@/services/cdss/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface CdssShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
}

export function CdssShell({
  basePath,
  variant = 'professional',
  title = 'Clinical Decision Support',
  facilityId = 'fac-001',
}: CdssShellProps) {
  const [location] = useLocation();
  const perms = useCdssPermissions();
  const section = getCdssSectionFromPath(location, variant);

  const scopedFilters = useMemo(
    (): CdssFilters => ({ facilityId }),
    [facilityId],
  );

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view clinical decision support."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise CDSS — real-time alerts, evidence-based guidelines, drug safety, order sets, risk calculators, and clinical analytics."
    >
      <div className="space-y-6">
        <CdssTabs basePath={basePath} variant={variant} />
        <CdssSectionContent
          section={section}
          filters={scopedFilters}
          variant={variant}
        />
      </div>
    </PageShell>
  );
}
