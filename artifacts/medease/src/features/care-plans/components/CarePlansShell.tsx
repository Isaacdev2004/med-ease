import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { CarePlanSectionContent } from '@/features/care-plans/components/CarePlanSections';
import {
  CarePlanTabs,
  getCarePlanSectionFromPath,
} from '@/features/care-plans/components/CarePlanTabs';
import { CreatePathwayDialog } from '@/features/care-plans/components/CreatePathwayDialog';
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
  title = 'E-Parcours',
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
          title="Accès refusé"
          description="Vous n’avez pas l’autorisation de consulter les parcours de soins."
        />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Chargement de l’e-parcours…" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Plans de soins coordonnés — objectifs, tâches, équipe et parcours cliniques."
      primaryAction={
        variant === 'clinician' && perms.canCreate ? (
          <CreatePathwayDialog />
        ) : undefined
      }
    >
      <div className="space-y-6">
        <CarePlanTabs basePath={basePath} variant={variant} />
        <CarePlanSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
