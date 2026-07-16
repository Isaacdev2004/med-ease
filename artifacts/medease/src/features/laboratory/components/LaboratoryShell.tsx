import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { LaboratorySectionContent } from '@/features/laboratory/components/LaboratorySections';
import { LaboratoryTabs, getLaboratorySectionFromPath } from '@/features/laboratory/components/LaboratoryTabs';
import { useLaboratoryPermissions } from '@/features/laboratory/hooks/use-laboratory-permissions';
import { usePatientLaboratoryContext } from '@/features/laboratory/hooks/use-laboratory';
import type { LabOrderFilters } from '@/services/laboratory/types';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface LaboratoryShellProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
  title?: string;
  patientId?: string;
}

export function LaboratoryShell({
  basePath,
  variant = 'patient',
  title = 'Laboratory',
  patientId: explicitPatientId,
}: LaboratoryShellProps) {
  const [location] = useLocation();
  const perms = useLaboratoryPermissions();
  const patientResolve = usePatientLaboratoryContext();
  const section = getLaboratorySectionFromPath(location);

  const scopedFilters = useMemo((): LabOrderFilters => {
    const patientId = explicitPatientId ?? (variant === 'patient' ? patientResolve.data ?? undefined : undefined);
    return patientId ? { patientId } : {};
  }, [explicitPatientId, patientResolve.data, variant]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view laboratory records." />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Loading laboratory records…" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Laboratory orders, specimens, diagnostic results, trends, and clinical alerts."
    >
      <div className="space-y-6">
        <LaboratoryTabs basePath={basePath} variant={variant} />
        <LaboratorySectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
