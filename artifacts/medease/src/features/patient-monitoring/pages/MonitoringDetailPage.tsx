import { useLocation } from 'wouter';

import { useObservation } from '@/features/patient-monitoring/hooks/use-patient-monitoring';
import { MonitoringStatusBadge, VitalCard } from '@/features/patient-monitoring/components/MonitoringComponents';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Activity } from 'lucide-react';

function getObservationId(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const idx = segments.indexOf('monitoring');
  return idx >= 0 ? segments[idx + 1] : undefined;
}

export default function MonitoringDetailPage() {
  const [location] = useLocation();
  const observationId = getObservationId(location) ?? '';
  const query = useObservation(observationId);

  if (query.isLoading) return <PageShell title="Observation Details"><LoadingView /></PageShell>;
  const obs = query.data;
  if (!obs) return <PageShell title="Observation Details"><EmptyState icon={Activity} title="Observation not found" /></PageShell>;

  return (
    <PageShell title={obs.display} subtitle={`Recorded ${new Date(obs.recordedAt).toLocaleString()}`}>
      <div className="space-y-4 max-w-xl">
        <VitalCard vital={{ id: obs.id, patientId: obs.patientId, type: 'heart_rate', value: obs.value, unit: obs.unit, recordedAt: obs.recordedAt, context: obs.context, status: obs.interpretation === 'critical' ? 'critical' : obs.interpretation === 'abnormal' ? 'warning' : 'normal' }} />
        <MonitoringStatusBadge status={obs.interpretation === 'critical' ? 'critical' : obs.interpretation === 'abnormal' ? 'warning' : 'normal'} />
        {obs.notes ? <p className="text-sm text-muted-foreground">{obs.notes}</p> : null}
      </div>
    </PageShell>
  );
}
