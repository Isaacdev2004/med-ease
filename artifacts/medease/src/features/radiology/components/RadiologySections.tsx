import { Scan } from 'lucide-react';

import {
  CriticalFindingBanner,
  DeviceCard,
  DiagnosticReportPanel,
  ImagingViewer,
  PACSStatusCard,
  RadiologyAnalyticsPanel,
  RadiologyMetrics,
  RadiologyStudyCard,
  RadiologistCard,
  StudyComparisonPanel,
  StudyTimeline,
  ExportShareToolbar,
} from '@/features/radiology/components/RadiologyComponents';
import {
  useCriticalResults,
  useDiagnosticReport,
  useFacilityImaging,
  useImageViewer,
  usePendingReports,
  useRadiologistDashboard,
  useRadiologyDashboard,
  useRadiologyStudies,
  useRadiologyStudy,
  useStudyAnalytics,
  useStudyTimeline,
  useCompareStudies,
} from '@/features/radiology/hooks/use-radiology';
import { useRadiologyMutations } from '@/features/radiology/mutations/radiology.mutations';
import { MOCK_IMAGING_DEVICES, MOCK_RADIOLOGISTS } from '@/services/radiology';
import type { StudyFilters } from '@/services/radiology/types';
import { BarChartPanel } from '@/shared/charts';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Button } from '@/shared/ui/button';
import { useRoute } from 'wouter';

export type RadiologySection =
  | 'dashboard'
  | 'history'
  | 'list'
  | 'worklist'
  | 'reports'
  | 'critical'
  | 'viewer'
  | 'report'
  | 'compare'
  | 'queue'
  | 'dashboard_facility'
  | 'imaging'
  | 'devices'
  | 'catalog'
  | 'analytics'
  | 'workload';

export function DashboardSection({ filters }: { filters?: StudyFilters }) {
  const dashboard = useRadiologyDashboard(filters?.patientId);
  const critical = useCriticalResults(filters?.patientId);
  if (dashboard.isLoading) return <LoadingView label="Loading radiology dashboard…" />;
  if (!dashboard.data) return <EmptyState icon={Scan} title="No imaging data" />;
  return (
    <div className="space-y-6">
      <RadiologyMetrics dashboard={dashboard.data} />
      <BarChartPanel title="Studies by modality" data={dashboard.data.chartData} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboard.data.recentStudies.map((s) => <RadiologyStudyCard key={s.id} study={s} />)}
      </div>
      <StudyTimeline entries={dashboard.data.recentActivity} />
      {(critical.data ?? []).slice(0, 2).map((r) => (
        <CriticalFindingBanner key={r.id} title={r.title} message={r.impression.summary} />
      ))}
    </div>
  );
}

export function HistorySection({ filters }: { filters?: StudyFilters }) {
  const studies = useRadiologyStudies(filters);
  const timeline = useStudyTimeline(filters?.patientId);
  if (studies.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {(studies.data ?? []).slice(0, 12).map((s) => <RadiologyStudyCard key={s.id} study={s} />)}
      </div>
      {filters?.patientId ? <StudyTimeline entries={timeline.data ?? []} /> : null}
    </div>
  );
}

export function StudiesListSection({ filters }: { filters?: StudyFilters }) {
  const query = useRadiologyStudies(filters);
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(query.data ?? []).slice(0, 24).map((s) => <RadiologyStudyCard key={s.id} study={s} />)}
    </div>
  );
}

export function WorklistSection() {
  const pending = usePendingReports();
  const dash = useRadiologistDashboard();
  if (pending.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{dash.data?.activeStudies ?? 0} studies awaiting interpretation · {pending.data?.length ?? 0} pending reports</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {(pending.data ?? []).slice(0, 12).map((r) => (
          <CriticalFindingBanner key={r.id} title={r.title} message={r.impression.summary} />
        ))}
      </div>
    </div>
  );
}

export function ReportsSection({ filters }: { filters?: StudyFilters }) {
  const studies = useRadiologyStudies(filters);
  const withReports = (studies.data ?? []).filter((s) => s.reportId).slice(0, 16);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {withReports.map((s) => <ReportLoader key={s.reportId!} reportId={s.reportId!} />)}
    </div>
  );
}

function ReportLoader({ reportId }: { reportId: string }) {
  const report = useDiagnosticReport(reportId);
  if (report.isLoading || !report.data) return <LoadingView />;
  return <DiagnosticReportPanel report={report.data} />;
}

export function CriticalSection({ filters }: { filters?: StudyFilters }) {
  const query = useCriticalResults(filters?.patientId);
  if (query.isLoading) return <LoadingView />;
  const items = query.data ?? [];
  if (!items.length) return <EmptyState icon={Scan} title="No critical findings" />;
  return (
    <div className="grid gap-4">
      {items.map((r) => <CriticalFindingBanner key={r.id} title={r.title} message={r.impression.summary} />)}
    </div>
  );
}

export function ViewerSection() {
  const [, params] = useRoute('/viewer/:studyId');
  const studyId = params?.studyId ? (params.studyId.startsWith('img-') ? params.studyId : `img-${params.studyId.padStart(4, '0')}`) : undefined;
  const study = useRadiologyStudy(studyId);
  const viewer = useImageViewer(studyId);
  const { exportStudy, shareStudy } = useRadiologyMutations();
  if (!studyId || study.isLoading) return <LoadingView label="Loading viewer…" />;
  if (!study.data) return <EmptyState icon={Scan} title="Study not found" />;
  return (
    <div className="space-y-4">
      <ExportShareToolbar
        onExport={() => void exportStudy.mutateAsync({ studyId: study.data!.id, format: 'pdf' })}
        onShare={() => void shareStudy.mutateAsync({ studyId: study.data!.id, sharedWith: 'care-team@medease.app' })}
      />
      <ImagingViewer study={study.data} initialState={viewer.data} />
    </div>
  );
}

export function StudyDetailSection() {
  const [, params] = useRoute('/radiology/:studyId');
  const raw = params?.studyId ?? '';
  const isReservedRoute = ['history', 'report'].includes(raw);
  const studyId = isReservedRoute
    ? undefined
    : raw.startsWith('img-')
      ? raw
      : raw
        ? `img-${raw.padStart(4, '0')}`
        : undefined;
  const study = useRadiologyStudy(studyId);
  const { approveReport } = useRadiologyMutations();
  if (isReservedRoute) return null;
  if (!studyId || study.isLoading) return <LoadingView />;
  if (!study.data) return <EmptyState icon={Scan} title="Study not found" />;
  return (
    <div className="space-y-6">
      <RadiologyStudyCard study={study.data} />
      {study.data.reportId ? <ReportLoader reportId={study.data.reportId} /> : null}
      {study.data.reportId ? (
        <Button onClick={() => void approveReport.mutateAsync({ reportId: study.data!.reportId!, radiologistId: 'rad-001', radiologistName: 'Dr. Antoine Moreau' })}>
          Sign report (demo)
        </Button>
      ) : null}
    </div>
  );
}

export function ReportDetailSection() {
  const [, params] = useRoute('/radiology/report/:reportId');
  const reportId = params?.reportId ? (params.reportId.startsWith('rpt-') ? params.reportId : `rpt-img-${params.reportId.padStart(4, '0')}`) : undefined;
  const report = useDiagnosticReport(reportId);
  if (!reportId || report.isLoading) return <LoadingView />;
  if (!report.data) return <EmptyState icon={Scan} title="Report not found" />;
  return <DiagnosticReportPanel report={report.data} />;
}

export function CompareSection() {
  const studies = useRadiologyStudies({});
  const a = studies.data?.[0];
  const b = studies.data?.[1];
  const comparison = useCompareStudies(a?.id, b?.id);
  if (studies.isLoading) return <LoadingView />;
  if (!comparison.data) return <EmptyState icon={Scan} title="Select studies to compare" />;
  return <StudyComparisonPanel comparison={comparison.data} />;
}

export function DevicesSection() {
  return (
    <div className="space-y-4">
      <PACSStatusCard />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_IMAGING_DEVICES.map((d) => <DeviceCard key={d.id} device={d} />)}
      </div>
    </div>
  );
}

export function FacilityDashboardSection() {
  const facility = useFacilityImaging();
  if (facility.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <p className="text-sm">Studies today: {facility.data?.studiesToday ?? 0} · Pending: {facility.data?.pending ?? 0}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(facility.data?.studies ?? []).map((s) => <RadiologyStudyCard key={s.id} study={s} />)}
      </div>
    </div>
  );
}

export function AnalyticsSection() {
  const query = useStudyAnalytics();
  if (query.isLoading || !query.data) return <LoadingView />;
  return <RadiologyAnalyticsPanel analytics={query.data} />;
}

export function WorkloadSection() {
  const dash = useRadiologistDashboard();
  if (dash.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {MOCK_RADIOLOGISTS.map((r) => <RadiologistCard key={r.id} radiologist={r} />)}
    </div>
  );
}

export function RadiologySectionContent({ section, filters }: { section: RadiologySection; filters?: StudyFilters }) {
  switch (section) {
    case 'history': return <HistorySection filters={filters} />;
    case 'list': case 'queue': case 'imaging': return <StudiesListSection filters={filters} />;
    case 'worklist': return <WorklistSection />;
    case 'reports': return <ReportsSection filters={filters} />;
    case 'critical': return <CriticalSection filters={filters} />;
    case 'viewer': return <ViewerSection />;
    case 'report': return <ReportDetailSection />;
    case 'compare': return <CompareSection />;
    case 'devices': return <DevicesSection />;
    case 'dashboard_facility': case 'dashboard': return <FacilityDashboardSection />;
    case 'analytics': case 'catalog': case 'workload': return section === 'workload' ? <WorkloadSection /> : <AnalyticsSection />;
    default: return <DashboardSection filters={filters} />;
  }
}
