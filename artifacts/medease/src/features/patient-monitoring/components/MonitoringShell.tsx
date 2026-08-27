import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { AddObservationDialog } from '@/features/patient-monitoring/components/AddObservationDialog';
import { MonitoringSectionContent } from '@/features/patient-monitoring/components/MonitoringSections';
import {
  MonitoringTabs,
  getMonitoringSectionFromPath,
} from '@/features/patient-monitoring/components/MonitoringTabs';
import { useMonitoringPermissions } from '@/features/patient-monitoring/hooks/use-monitoring-permissions';
import { usePatientMonitoringContext } from '@/features/patient-monitoring/hooks/use-patient-monitoring';
import type { MonitoringFilters } from '@/services/patient-monitoring/types';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface MonitoringShellProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
  title?: string;
  patientId?: string;
}

export function MonitoringShell({
  basePath,
  variant = 'patient',
  title = 'Suivi',
  patientId: explicitPatientId,
}: MonitoringShellProps) {
  const [location] = useLocation();
  const perms = useMonitoringPermissions();
  const patientResolve = usePatientMonitoringContext();
  const section = getMonitoringSectionFromPath(location);

  const patientId =
    explicitPatientId ??
    (variant === 'patient' ? (patientResolve.data ?? undefined) : undefined);

  const scopedFilters = useMemo((): MonitoringFilters => {
    return patientId ? { patientId } : {};
  }, [patientId]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Accès refusé"
          description="Vous n’avez pas l’autorisation de consulter le suivi."
        />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Chargement du suivi…" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Constantes vitales, observations, télé-suivi et alertes cliniques."
    >
      <div className="space-y-6">
        {patientId && perms.canWrite ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Saisie de suivi</h2>
              <p className="text-sm text-muted-foreground">
                Enregistrez une constante ou une observation (Formulaire Studio).
              </p>
            </div>
            <AddObservationDialog patientId={patientId} />
          </div>
        ) : null}
        <MonitoringTabs basePath={basePath} variant={variant} />
        <MonitoringSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
