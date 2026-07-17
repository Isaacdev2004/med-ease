import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { CarePlanSectionContent } from '@/features/care-plans/components/CarePlanSections';
import {
  CarePlanTabs,
  getCarePlanSectionFromPath,
} from '@/features/care-plans/components/CarePlanTabs';
import { useCarePlanPermissions } from '@/features/care-plans/hooks/use-care-plan-permissions';
import { usePatientCarePlanContext } from '@/features/care-plans/hooks/use-care-plans';
import type { CarePlanFilters } from '@/services/care-plans/types';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface CarePlansShellProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
  title?: string;
  patientId?: string;
}

export function CarePlansShell({
  basePath,
  variant = 'patient',
  title = 'Care Plan',
  patientId: explicitPatientId,
}: CarePlansShellProps) {
  const [location] = useLocation();
  const perms = useCarePlanPermissions();
  const patientResolve = usePatientCarePlanContext();
  const section = getCarePlanSectionFromPath(location);

  const scopedFilters = useMemo((): CarePlanFilters => {
    const patientId =
      explicitPatientId ??
      (variant === 'patient' ? (patientResolve.data ?? undefined) : undefined);
    return patientId ? { patientId } : {};
  }, [explicitPatientId, patientResolve.data, variant]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view care plans."
        />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Loading care plan…" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Coordinated treatment plans — goals, tasks, care team, and clinical pathways."
    >
      <div className="space-y-6">
        <CarePlanTabs basePath={basePath} variant={variant} />
        <CarePlanSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
