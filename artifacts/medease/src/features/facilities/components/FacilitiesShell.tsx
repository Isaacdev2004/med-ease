import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { FacilitiesSectionContent } from '@/features/facilities/components/FacilitiesSections';
import {
  FacilitiesTabs,
  getFacilitiesSectionFromPath,
} from '@/features/facilities/components/FacilitiesTabs';
import { useFacilitiesPermissions } from '@/features/facilities/hooks/use-facilities-permissions';
import type { FacilitiesFilters } from '@/services/facilities/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface FacilitiesShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
}

export function FacilitiesShell({
  basePath,
  variant = 'professional',
  title = 'Facilities',
  facilityId = 'fac-001',
}: FacilitiesShellProps) {
  const [location] = useLocation();
  const perms = useFacilitiesPermissions();
  const section = getFacilitiesSectionFromPath(location);

  const scopedFilters = useMemo((): FacilitiesFilters => {
    const filters: FacilitiesFilters = { facilityId };
    return filters;
  }, [facilityId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view facilities data."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise facilities management, biomedical engineering, CMMS, utilities, and environmental monitoring."
    >
      <div className="space-y-6">
        <FacilitiesTabs basePath={basePath} variant={variant} />
        <FacilitiesSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
