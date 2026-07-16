import {
  AlertBanner,
  AlertCard,
  ClinicalTrendPanel,
  DeviceCard,
  MEWSCard,
  MonitoringAnalyticsPanel,
  MonitoringKpiCards,
  NEWSScoreCard,
  ObservationTable,
  ObservationTimeline,
  RPMEnrollmentCard,
  VitalCard,
} from '@/features/patient-monitoring/components/MonitoringComponents';
import {
  useEarlyWarningScores,
  useMonitoringAlerts,
  useMonitoringAnalytics,
  useMonitoringDashboard,
  useMonitoringDevices,
  useObservationTimeline,
  useObservations,
  useRPMPrograms,
  useTrendAnalysis,
  useVitalSigns,
} from '@/features/patient-monitoring/hooks/use-patient-monitoring';
import { useMonitoringMutations } from '@/features/patient-monitoring/mutations/patient-monitoring.mutations';
import type { MonitoringFilters } from '@/services/patient-monitoring/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Activity } from 'lucide-react';

export function DashboardSection({ filters }: { filters?: MonitoringFilters }) {
  const dashboard = useMonitoringDashboard(filters?.patientId);
  const alerts = useMonitoringAlerts({ ...filters, status: 'active' });
  if (dashboard.isLoading) return <LoadingView label="Loading monitoring…" />;
  if (!dashboard.data) return <EmptyState icon={Activity} title="No monitoring data" />;
  return (
    <div className="space-y-6">
      <MonitoringKpiCards dashboard={dashboard.data} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(dashboard.data.recentObservations ?? []).slice(0, 4).map((o) => (
          <VitalCard key={o.id} vital={{ id: o.id, patientId: o.patientId, type: 'heart_rate', value: o.value, unit: o.unit, recordedAt: o.recordedAt, context: o.context, status: o.interpretation === 'critical' ? 'critical' : o.interpretation === 'abnormal' ? 'warning' : 'normal' }} />
        ))}
      </div>
      {(alerts.data?.items ?? []).slice(0, 3).map((a) => <AlertBanner key={a.id} alert={a} />)}
    </div>
  );
}

export function VitalsSection({ filters }: { filters?: MonitoringFilters }) {
  const query = useVitalSigns(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={Activity} title="No vital signs" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, 18).map((v) => <VitalCard key={v.id} vital={v} />)}
    </div>
  );
}

export function ObservationsSection({ filters }: { filters?: MonitoringFilters }) {
  const query = useObservations(filters);
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={Activity} title="No observations" />;
  return <ObservationTable observations={items.slice(0, 30)} />;
}

export function TimelineSection({ filters }: { filters?: MonitoringFilters }) {
  const query = useObservationTimeline(filters?.patientId);
  if (!filters?.patientId || query.isLoading) return <LoadingView />;
  const entries = query.data ?? [];
  if (!entries.length) return <EmptyState icon={Activity} title="No timeline entries" />;
  return <ObservationTimeline entries={entries} />;
}

export function AlertsSection({ filters }: { filters?: MonitoringFilters }) {
  const query = useMonitoringAlerts(filters);
  const { resolveAlert, dismissAlert } = useMonitoringMutations();
  if (query.isLoading) return <LoadingView />;
  const items = query.data?.items ?? [];
  if (!items.length) return <EmptyState icon={Activity} title="No alerts" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.slice(0, 20).map((a) => (
        <div key={a.id} className="space-y-2">
          <AlertCard alert={a} />
          {a.status === 'active' && (
            <div className="flex gap-2">
              <button type="button" className="text-xs underline" onClick={() => void resolveAlert.mutateAsync({ id: a.id, by: 'Clinician' })}>Resolve</button>
              <button type="button" className="text-xs underline" onClick={() => void dismissAlert.mutateAsync(a.id)}>Dismiss</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function DevicesSection({ filters }: { filters?: MonitoringFilters }) {
  const query = useMonitoringDevices(filters?.patientId);
  const { syncDevice } = useMonitoringMutations();
  if (query.isLoading) return <LoadingView />;
  const devices = query.data ?? [];
  if (!devices.length) return <EmptyState icon={Activity} title="No devices" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {devices.slice(0, 12).map((d) => (
        <div key={d.id} className="space-y-2">
          <DeviceCard device={d} />
          <button type="button" className="text-xs underline" onClick={() => void syncDevice.mutateAsync(d.id)}>Sync device</button>
        </div>
      ))}
    </div>
  );
}

export function RPMSection({ filters }: { filters?: MonitoringFilters }) {
  const query = useRPMPrograms(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  const programs = query.data ?? [];
  if (!programs.length) return <EmptyState icon={Activity} title="No RPM programs" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {programs.slice(0, 12).map((p) => <RPMEnrollmentCard key={p.id} program={p} />)}
    </div>
  );
}

export function AnalyticsSection() {
  const analytics = useMonitoringAnalytics();
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return <EmptyState icon={Activity} title="No analytics" />;
  return <MonitoringAnalyticsPanel analytics={analytics.data} />;
}

export function ScoresSection({ filters }: { filters?: MonitoringFilters }) {
  const query = useEarlyWarningScores(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  const scores = query.data ?? [];
  if (!scores.length) return <EmptyState icon={Activity} title="No early warning scores" />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {scores.slice(0, 8).map((s) => (
        s.type === 'NEWS2' ? <NEWSScoreCard key={s.id} score={s} /> : <MEWSCard key={s.id} score={s} />
      ))}
    </div>
  );
}

export function TrendsSection({ filters }: { filters?: MonitoringFilters }) {
  const query = useTrendAnalysis(filters?.patientId);
  if (!filters?.patientId || query.isLoading) return <LoadingView />;
  const trends = query.data ?? [];
  if (!trends.length) return <EmptyState icon={Activity} title="No trends" />;
  return <ClinicalTrendPanel trends={trends} />;
}

export type MonitoringSection =
  | 'dashboard' | 'vitals' | 'observations' | 'timeline' | 'alerts'
  | 'devices' | 'rpm' | 'analytics' | 'scores' | 'history';

export function MonitoringSectionContent({ section, filters }: { section: MonitoringSection; filters?: MonitoringFilters }) {
  switch (section) {
    case 'vitals': return <VitalsSection filters={filters} />;
    case 'observations': return <ObservationsSection filters={filters} />;
    case 'timeline': return <TimelineSection filters={filters} />;
    case 'alerts': return <AlertsSection filters={filters} />;
    case 'devices': return <DevicesSection filters={filters} />;
    case 'rpm': return <RPMSection filters={filters} />;
    case 'analytics': return <AnalyticsSection />;
    case 'scores': return <ScoresSection filters={filters} />;
    case 'history': return <TimelineSection filters={filters} />;
    default: return <DashboardSection filters={filters} />;
  }
}
