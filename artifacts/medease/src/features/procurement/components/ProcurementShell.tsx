import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { ProcurementSectionContent } from '@/features/procurement/components/ProcurementSections';
import { ProcurementTabs, getProcurementSectionFromPath } from '@/features/procurement/components/ProcurementTabs';
import { useProcurementPermissions } from '@/features/procurement/hooks/use-procurement-permissions';
import type { ProcurementDepartment, ProcurementFilters } from '@/services/procurement/types';
import { PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface ProcurementShellProps {
  basePath: string;
  variant?: 'pharmacy' | 'professional' | 'facility' | 'admin';
  title?: string;
  department?: ProcurementDepartment;
}

export function ProcurementShell({
  basePath,
  variant = 'pharmacy',
  title = 'Procurement',
  department: explicitDepartment,
}: ProcurementShellProps) {
  const [location] = useLocation();
  const perms = useProcurementPermissions();
  const section = getProcurementSectionFromPath(location);

  const scopedFilters = useMemo((): ProcurementFilters => {
    const department = explicitDepartment ?? (variant === 'pharmacy' ? 'pharmacy' : variant === 'facility' ? 'facility' : undefined);
    return department ? { department } : {};
  }, [explicitDepartment, variant]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view procurement." />
      </PageShell>
    );
  }

  return (
    <PageShell title={title} subtitle="Enterprise procurement, purchasing, supply chain, approvals, contracts, and supplier management.">
      <div className="space-y-6">
        <ProcurementTabs basePath={basePath} variant={variant} />
        <ProcurementSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
