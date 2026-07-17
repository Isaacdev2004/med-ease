import { useMemo } from 'react';
import { useLocation } from 'wouter';

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
  title = 'Patient Monitoring',
  patientId: explicitPatientId,
}: MonitoringShellProps) {
  const [location] = useLocation();
  const perms = useMonitoringPermissions();
  const patientResolve = usePatientMonitoringContext();
  const section = getMonitoringSectionFromPath(location);

  const scopedFilters = useMemo((): MonitoringFilters => {
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
          description="You do not have permission to view patient monitoring."
        />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Loading monitoring…" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Continuous vital signs, remote patient monitoring, clinical observations, alerts, and early warning scores."
    >
      <div className="space-y-6">
        <MonitoringTabs basePath={basePath} variant={variant} />
        <MonitoringSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
