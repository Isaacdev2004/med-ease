import {
  BenchmarkPanel,
  CapacityDashboard,
  ClinicalQualityDashboard,
  EnterpriseAlertCenter,
  ExecutiveAnalyticsPanel,
  ExecutiveDashboard,
  ExecutiveKpiCard,
  ExportToolbar,
  ForecastPanel,
  HospitalOperationsBoard,
  PatientFlowPanel,
  PopulationHealthDashboard,
  RevenueDashboardPanel,
  ScorecardPanel,
  StrategicInitiativeCard,
  WorkforceDashboardPanel,
} from '@/features/executive/components/ExecutiveComponents';
import {
  useCapacityAnalytics,
  useDepartmentScorecards,
  useEnterpriseKpis,
  useExecutiveAlerts,
  useExecutiveAnalytics,
  useExecutiveDashboard,
  useExecutiveForecasts,
  useHospitalOperations,
  useOperationalMetrics,
  usePatientFlow,
  usePopulationDashboard,
  useQualityDashboard,
  useRevenueDashboard,
  useStrategicInitiatives,
  useWorkforceDashboard,
} from '@/features/executive/hooks/use-executive';
import { useExecutiveMutations } from '@/features/executive/mutations/executive.mutations';
import { executiveQueries } from '@/features/executive/queries/executive.queries';
import type { ExecutiveFilters } from '@/services/executive/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard } from 'lucide-react';

export type ExecutiveSection =
  | 'dashboard'
  | 'department'
  | 'operations'
  | 'capacity'
  | 'patient-flow'
  | 'scorecards'
  | 'hub'
  | 'enterprise-dashboard'
  | 'enterprise-kpis'
  | 'benchmarking'
  | 'strategic-initiatives'
  | 'analytics'
  | 'forecasting'
  | 'alerts';

function useBenchmarkReports(filters?: ExecutiveFilters) {
  return useQuery(executiveQueries.benchmarkReports(filters));
}

export function DashboardSection({ filters }: { filters?: ExecutiveFilters }) {
  const dashboard = useExecutiveDashboard(filters?.facilityId);
  const kpis = useEnterpriseKpis(filters);
  const alerts = useExecutiveAlerts(filters);
  const { exportData } = useExecutiveMutations();
  if (dashboard.isLoading)
    return <LoadingView label="Loading executive dashboard…" />;
  if (!dashboard.data)
    return <EmptyState icon={LayoutDashboard} title="No executive data" />;
  return (
    <div className="space-y-6">
      <ExecutiveDashboard dashboard={dashboard.data} />
      <EnterpriseAlertCenter
        alerts={alerts.data?.items ?? dashboard.data.recentAlerts}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(kpis.data?.items ?? dashboard.data.topKpis).slice(0, 6).map((k) => (
          <ExecutiveKpiCard key={k.kpiId} kpi={k} />
        ))}
      </div>
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function DepartmentSection({ filters }: { filters?: ExecutiveFilters }) {
  const scorecards = useDepartmentScorecards(filters);
  const quality = useQualityDashboard(filters?.facilityId);
  if (scorecards.isLoading || quality.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {quality.data && <ClinicalQualityDashboard quality={quality.data} />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(scorecards.data?.items ?? []).map((s) => (
          <ScorecardPanel key={s.scorecardId} scorecard={s} />
        ))}
      </div>
    </div>
  );
}

export function OperationsSection({ filters }: { filters?: ExecutiveFilters }) {
  const operations = useHospitalOperations(filters?.facilityId);
  const metrics = useOperationalMetrics(filters);
  const revenue = useRevenueDashboard(filters?.facilityId);
  const workforce = useWorkforceDashboard(filters?.facilityId);
  if (operations.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {operations.data && (
        <HospitalOperationsBoard operations={operations.data} />
      )}
      {revenue.data && <RevenueDashboardPanel revenue={revenue.data} />}
      {workforce.data && <WorkforceDashboardPanel workforce={workforce.data} />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(metrics.data?.items ?? []).slice(0, 6).map((m) => (
          <ExecutiveKpiCard
            key={m.metricId}
            kpi={{
              kpiId: m.metricId,
              name: m.name,
              category: 'operational',
              facilityId: m.facilityId,
              value: m.value,
              target: m.benchmark,
              unit: m.unit,
              trend: m.value >= m.benchmark ? 'up' : 'down',
              changePercent: 0,
              measuredAt: m.measuredAt,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function CapacitySection({ filters }: { filters?: ExecutiveFilters }) {
  const capacity = useCapacityAnalytics(filters);
  if (capacity.isLoading) return <LoadingView />;
  if (!capacity.data) return null;
  return (
    <CapacityDashboard
      snapshots={capacity.data.snapshots.items}
      aggregateOccupancy={capacity.data.aggregateOccupancy}
    />
  );
}

export function PatientFlowSection({
  filters,
}: {
  filters?: ExecutiveFilters;
}) {
  const flow = usePatientFlow(filters?.facilityId);
  if (flow.isLoading) return <LoadingView />;
  return flow.data ? <PatientFlowPanel flow={flow.data} /> : null;
}

export function ScorecardsSection({ filters }: { filters?: ExecutiveFilters }) {
  const scorecards = useDepartmentScorecards(filters);
  if (scorecards.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(scorecards.data?.items ?? []).map((s) => (
        <ScorecardPanel key={s.scorecardId} scorecard={s} />
      ))}
    </div>
  );
}

export function EnterpriseKpisSection({
  filters,
}: {
  filters?: ExecutiveFilters;
}) {
  const kpis = useEnterpriseKpis(filters);
  if (kpis.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(kpis.data?.items ?? []).slice(0, 12).map((k) => (
        <ExecutiveKpiCard key={k.kpiId} kpi={k} />
      ))}
    </div>
  );
}

export function BenchmarkingSection({
  filters,
}: {
  filters?: ExecutiveFilters;
}) {
  const benchmarks = useBenchmarkReports(filters);
  if (benchmarks.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(benchmarks.data?.items ?? []).slice(0, 9).map((b) => (
        <BenchmarkPanel key={b.reportId} report={b} />
      ))}
    </div>
  );
}

export function StrategicInitiativesSection({
  filters,
}: {
  filters?: ExecutiveFilters;
}) {
  const initiatives = useStrategicInitiatives(filters);
  if (initiatives.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(initiatives.data?.items ?? []).map((i) => (
        <StrategicInitiativeCard key={i.initiativeId} initiative={i} />
      ))}
    </div>
  );
}

export function AnalyticsSection({ filters }: { filters?: ExecutiveFilters }) {
  const analytics = useExecutiveAnalytics(filters?.facilityId);
  const population = usePopulationDashboard(filters?.facilityId);
  const { exportData } = useExecutiveMutations();
  if (analytics.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {analytics.data && <ExecutiveAnalyticsPanel analytics={analytics.data} />}
      {population.data && (
        <PopulationHealthDashboard population={population.data} />
      )}
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function ForecastingSection({
  filters,
}: {
  filters?: ExecutiveFilters;
}) {
  const forecasts = useExecutiveForecasts(filters);
  if (forecasts.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(forecasts.data?.items ?? []).slice(0, 4).map((f) => (
        <ForecastPanel key={f.forecastId} forecast={f} />
      ))}
    </div>
  );
}

export function AlertsSection({ filters }: { filters?: ExecutiveFilters }) {
  const alerts = useExecutiveAlerts(filters);
  if (alerts.isLoading) return <LoadingView />;
  return <EnterpriseAlertCenter alerts={alerts.data?.items ?? []} />;
}

export function EnterpriseDashboardSection({
  filters,
}: {
  filters?: ExecutiveFilters;
}) {
  return <DashboardSection filters={filters} />;
}

export function ExecutiveSectionContent({
  section,
  filters,
}: {
  section: ExecutiveSection;
  filters?: ExecutiveFilters;
}) {
  switch (section) {
    case 'department':
      return <DepartmentSection filters={filters} />;
    case 'operations':
      return <OperationsSection filters={filters} />;
    case 'capacity':
      return <CapacitySection filters={filters} />;
    case 'patient-flow':
      return <PatientFlowSection filters={filters} />;
    case 'scorecards':
      return <ScorecardsSection filters={filters} />;
    case 'hub':
    case 'enterprise-dashboard':
      return <EnterpriseDashboardSection filters={filters} />;
    case 'enterprise-kpis':
      return <EnterpriseKpisSection filters={filters} />;
    case 'benchmarking':
      return <BenchmarkingSection filters={filters} />;
    case 'strategic-initiatives':
      return <StrategicInitiativesSection filters={filters} />;
    case 'analytics':
      return <AnalyticsSection filters={filters} />;
    case 'forecasting':
      return <ForecastingSection filters={filters} />;
    case 'alerts':
      return <AlertsSection filters={filters} />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
