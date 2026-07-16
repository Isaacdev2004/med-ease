import { FileBarChart } from 'lucide-react';
import { useState } from 'react';

import {
  CategoryBrowser,
  CompliancePanel,
  ExportCard,
  ExportPanel,
  FilterBuilder,
  InstanceCard,
  ReportAnalyticsPanel,
  ReportCard,
  ReportDashboardPanel,
  ReportDesigner,
  ReportLibraryGrid,
  ReportMonitor,
  ReportTimeline,
  ScheduleCard,
  TemplateCard,
} from '@/features/reporting/components/ReportingComponents';
import {
  useComplianceReports,
  useReportAnalytics,
  useReportDashboard,
  useReportDefinitions,
  useReportDesigners,
  useReportExports,
  useReportInstances,
  useReportSchedules,
  useReportTemplates,
} from '@/features/reporting/hooks/use-reporting';
import { useReportingMutations } from '@/features/reporting/mutations/reporting.mutations';
import type { ReportCategory, ReportFilters } from '@/services/reporting/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

export type ReportingSection =
  | 'dashboard'
  | 'my-reports'
  | 'scheduled-reports'
  | 'report-designer'
  | 'report-library'
  | 'report-schedules'
  | 'report-exports'
  | 'report-analytics'
  | 'compliance-reports';

interface SectionProps {
  filters?: ReportFilters;
  variant?: 'professional' | 'facility' | 'admin';
}

const ALL_CATEGORIES: ReportCategory[] = ['clinical', 'finance', 'audit', 'moh', 'insurance', 'hospital', 'patient', 'research'];

export function DashboardSection({ filters }: SectionProps) {
  const dashboard = useReportDashboard(filters?.facilityId);
  const defs = useReportDefinitions(filters);
  const instances = useReportInstances(filters);
  const { exportData } = useReportingMutations();
  if (dashboard.isLoading) return <LoadingView label="Loading report dashboard…" />;
  if (!dashboard.data) return <EmptyState icon={FileBarChart} title="No reporting data" />;
  return (
    <div className="space-y-6">
      <ReportDashboardPanel dashboard={dashboard.data} />
      <CategoryBrowser categories={ALL_CATEGORIES} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(defs.data?.items ?? []).slice(0, 6).map((r) => <ReportCard key={r.reportId} report={r} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(instances.data?.items ?? []).slice(0, 6).map((i) => <InstanceCard key={i.instanceId} instance={i} />)}
      </div>
      <ReportTimeline exports={dashboard.data.recentExports} />
      <ExportPanel exports={dashboard.data.recentExports} onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function MyReportsSection({ filters }: SectionProps) {
  const instances = useReportInstances({ ...filters, userId: filters?.userId });
  const exports = useReportExports({ ...filters, userId: filters?.userId });
  const { runReport } = useReportingMutations();
  const defs = useReportDefinitions({ ...filters, status: 'published' });
  if (instances.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(instances.data?.items ?? []).slice(0, 12).map((i) => <InstanceCard key={i.instanceId} instance={i} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(exports.data?.items ?? []).slice(0, 6).map((e) => <ExportCard key={e.exportId} exportItem={e} />)}
      </div>
      {(defs.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => runReport.mutate({ reportId: defs.data!.items[0]!.reportId, generatedBy: filters?.userId ?? 'current-user', facilityId: filters?.facilityId })}>
          Run report (demo)
        </button>
      )}
    </div>
  );
}

export function ScheduledReportsSection({ filters }: SectionProps) {
  const schedules = useReportSchedules(filters);
  const { toggleSchedule } = useReportingMutations();
  if (schedules.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(schedules.data?.items ?? []).map((s) => <ScheduleCard key={s.scheduleId} schedule={s} />)}
      </div>
      {(schedules.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => toggleSchedule.mutate(schedules.data!.items[0]!.scheduleId)}>
          Toggle first schedule (demo)
        </button>
      )}
    </div>
  );
}

export function DesignerSection({ filters }: SectionProps) {
  const defs = useReportDefinitions(filters);
  const designers = useReportDesigners(filters);
  const { updateDesigner } = useReportingMutations();
  if (defs.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <ReportDesigner definitions={defs.data?.items ?? []} designer={designers.data?.items[0]} />
      {(defs.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => updateDesigner.mutate({ reportId: defs.data!.items[0]!.reportId, editedBy: 'current-user', canvasElements: 12 })}>
          Save designer (demo)
        </button>
      )}
    </div>
  );
}

export function LibrarySection({ filters }: SectionProps) {
  const [category, setCategory] = useState<ReportCategory | undefined>();
  const defs = useReportDefinitions({ ...filters, category });
  const templates = useReportTemplates({ ...filters, category });
  if (defs.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <FilterBuilder onFilter={setCategory} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(templates.data?.items ?? []).slice(0, 6).map((t) => <TemplateCard key={t.templateId} template={t} />)}
      </div>
      <ReportLibraryGrid reports={defs.data?.items ?? []} />
    </div>
  );
}

export function SchedulesSection({ filters }: SectionProps) {
  const schedules = useReportSchedules(filters);
  const { scheduleReport } = useReportingMutations();
  const defs = useReportDefinitions({ ...filters, status: 'published' });
  if (schedules.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(schedules.data?.items ?? []).map((s) => <ScheduleCard key={s.scheduleId} schedule={s} />)}
      </div>
      {(defs.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => scheduleReport.mutate({ reportId: defs.data!.items[0]!.reportId, name: 'Weekly Summary', cron: '0 6 * * 1', format: 'pdf', recipients: ['admin@hospital.org'] })}>
          Create schedule (demo)
        </button>
      )}
    </div>
  );
}

export function ExportsSection({ filters }: SectionProps) {
  const exports = useReportExports(filters);
  const { exportReport, exportData, retryExport } = useReportingMutations();
  const defs = useReportDefinitions({ ...filters, status: 'published' });
  if (exports.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <ExportPanel exports={exports.data?.items ?? []} onExport={(fmt) => exportData.mutate(fmt)} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(exports.data?.items ?? []).slice(0, 9).map((e) => <ExportCard key={e.exportId} exportItem={e} />)}
      </div>
      <div className="flex gap-4">
        {(defs.data?.items ?? [])[0] && (
          <button type="button" className="text-sm text-primary underline" onClick={() => exportReport.mutate({ reportId: defs.data!.items[0]!.reportId, format: 'pdf', requestedBy: 'current-user' })}>
            Export report (demo)
          </button>
        )}
        {(exports.data?.items ?? []).find((e) => e.status === 'failed') && (
          <button type="button" className="text-sm text-primary underline" onClick={() => retryExport.mutate(exports.data!.items.find((e) => e.status === 'failed')!.exportId)}>
            Retry failed export (demo)
          </button>
        )}
      </div>
    </div>
  );
}

export function AnalyticsSection({ filters }: SectionProps) {
  const analytics = useReportAnalytics(filters?.facilityId);
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return null;
  return <ReportAnalyticsPanel analytics={analytics.data} />;
}

export function ComplianceSection({ filters }: SectionProps) {
  const compliance = useComplianceReports(filters);
  const instances = useReportInstances(filters);
  if (compliance.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <CompliancePanel reports={compliance.data?.items ?? []} />
      <ReportMonitor instances={instances.data?.items ?? []} />
    </div>
  );
}

export function ReportingSectionContent({ section, filters }: { section: ReportingSection; filters?: ReportFilters; variant?: 'professional' | 'facility' | 'admin' }) {
  switch (section) {
    case 'my-reports': return <MyReportsSection filters={filters} />;
    case 'scheduled-reports': return <ScheduledReportsSection filters={filters} />;
    case 'report-designer': return <DesignerSection filters={filters} />;
    case 'report-library': return <LibrarySection filters={filters} />;
    case 'report-schedules': return <SchedulesSection filters={filters} />;
    case 'report-exports': return <ExportsSection filters={filters} />;
    case 'report-analytics': return <AnalyticsSection filters={filters} />;
    case 'compliance-reports': return <ComplianceSection filters={filters} />;
    default: return <DashboardSection filters={filters} />;
  }
}
