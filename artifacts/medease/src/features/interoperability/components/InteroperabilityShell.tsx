import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { InteropSectionContent } from '@/features/interoperability/components/InteropSections';
import {
  InteropTabs,
  getInteropSectionFromPath,
} from '@/features/interoperability/components/InteropTabs';
import { useInteropPermissions } from '@/features/interoperability/hooks/use-interoperability-permissions';
import type { InteropFilters } from '@/services/interoperability/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface InteroperabilityShellProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
  title?: string;
  facilityId?: string;
}

export function InteroperabilityShell({
  basePath,
  variant = 'professional',
  title = 'Interoperability Hub',
  facilityId = 'fac-001',
}: InteroperabilityShellProps) {
  const [location] = useLocation();
  const perms = useInteropPermissions();
  const section = getInteropSectionFromPath(location, variant);

  const scopedFilters = useMemo(
    (): InteropFilters => ({ facilityId }),
    [facilityId],
  );

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view interoperability data."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise interoperability — FHIR, HL7, DICOM, CDA, IHE profiles, API gateway, and health information exchange."
    >
      <div className="space-y-6">
        <InteropTabs basePath={basePath} variant={variant} />
        <InteropSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
