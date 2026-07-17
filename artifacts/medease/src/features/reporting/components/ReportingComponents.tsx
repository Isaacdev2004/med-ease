import { format } from 'date-fns';
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileBarChart,
  FileSpreadsheet,
  Filter,
  Layers,
  Layout,
  PieChart,
  Settings,
  Shield,
} from 'lucide-react';

import type {
  ComplianceReport,
  ReportAnalytics,
  ReportDashboard,
  ReportDefinition,
  ReportDesigner,
  ReportExport,
  ReportInstance,
  ReportSchedule,
  ReportTemplate,
  ReportCategory,
} from '@/services/reporting/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const instanceVariant = {
  completed: 'default',
  running: 'secondary',
  queued: 'outline',
  failed: 'destructive',
  cancelled: 'destructive',
} as const;
const exportVariant = {
  completed: 'default',
  processing: 'secondary',
  queued: 'outline',
  failed: 'destructive',
} as const;
const complianceVariant = {
  compliant: 'default',
  pending: 'secondary',
  overdue: 'destructive',
} as const;

const CATEGORY_LABELS: Record<ReportCategory, string> = {
  clinical: 'Clinical',
  finance: 'Finance',
  audit: 'Audit',
  moh: 'MOH',
  insurance: 'Insurance',
  hospital: 'Hospital',
  patient: 'Patient',
  research: 'Research',
};

export function ReportDashboardPanel({
  dashboard,
}: {
  dashboard: ReportDashboard;
}) {
  const metrics = [
    {
      label: 'Report Definitions',
      value: dashboard.totalDefinitions.toLocaleString(),
      icon: FileBarChart,
    },
    {
      label: 'Active Generations',
      value: dashboard.activeInstances.toLocaleString(),
      icon: Clock,
    },
    {
      label: 'Pending Exports',
      value: dashboard.pendingExports.toLocaleString(),
      icon: Download,
    },
    {
      label: 'Scheduled Reports',
      value: dashboard.scheduledReports.toLocaleString(),
      icon: Calendar,
    },
    {
      label: 'Compliance Due',
      value: dashboard.complianceDue.toLocaleString(),
      icon: Shield,
    },
    {
      label: 'Exports Today',
      value: dashboard.exportsToday.toLocaleString(),
      icon: FileSpreadsheet,
    },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4 flex items-center gap-3">
              <m.icon className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-2xl font-bold">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel
        title="Generation Activity"
        data={dashboard.generationTrend}
      />
      <BarChartPanel
        title="Reports by Category"
        data={dashboard.categoryBreakdown}
      />
    </div>
  );
}

export function ReportCard({ report }: { report: ReportDefinition }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{report.name}</span>
          <Badge className="capitalize">{report.status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {report.description}
        </p>
        <div className="flex gap-1 flex-wrap">
          <Badge variant="outline">{CATEGORY_LABELS[report.category]}</Badge>
          <Badge variant="outline">{report.fieldCount} fields</Badge>
          <Badge variant="outline">{report.chartCount} charts</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function InstanceCard({ instance }: { instance: ReportInstance }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{instance.reportName}</span>
          <Badge
            variant={instanceVariant[instance.status]}
            className="capitalize"
          >
            {instance.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {CATEGORY_LABELS[instance.category]}
        </p>
        {instance.rowCount != null && (
          <p className="text-xs">{instance.rowCount.toLocaleString()} rows</p>
        )}
        <p className="text-xs text-muted-foreground">
          {format(new Date(instance.generatedAt), 'MMM d, HH:mm')}
        </p>
      </CardContent>
    </Card>
  );
}

export function ReportDesigner({
  definitions,
  designer,
}: {
  definitions: ReportDefinition[];
  designer?: ReportDesigner;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Layout className="h-5 w-5" /> Report Designer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReportBuilderCanvas
          reportName={definitions[0]?.name ?? 'New Report'}
          elements={designer?.canvasElements ?? 0}
        />
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {definitions.slice(0, 4).map((d) => (
            <div
              key={d.reportId}
              className="text-sm border rounded p-2 flex justify-between"
            >
              <span>{d.name}</span>
              <Badge variant="outline">v{d.version}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ReportBuilderCanvas({
  reportName,
  elements,
}: {
  reportName: string;
  elements: number;
}) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="rounded-md border bg-muted/20 h-48 flex flex-col items-center justify-center text-sm text-muted-foreground gap-2">
          <Layout className="h-8 w-8" />
          <span>Design canvas — {reportName}</span>
          <span className="text-xs">{elements} element(s) on canvas</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ScheduleCard({ schedule }: { schedule: ReportSchedule }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{schedule.name}</span>
          <Badge variant={schedule.enabled ? 'default' : 'secondary'}>
            {schedule.enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </div>
        <p className="text-xs font-mono">{schedule.cron}</p>
        <div className="flex gap-1">
          <Badge variant="outline">{schedule.format.toUpperCase()}</Badge>
          <Badge variant="outline">
            {schedule.recipients.length} recipient(s)
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Next: {format(new Date(schedule.nextRunAt), 'MMM d, HH:mm')}
        </p>
      </CardContent>
    </Card>
  );
}

export function ExportPanel({
  exports,
  onExport,
}: {
  exports: ReportExport[];
  onExport?: (format: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Download className="h-5 w-5" /> Export Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {exports.slice(0, 8).map((e) => (
            <div
              key={e.exportId}
              className="flex justify-between text-sm border-b pb-2 last:border-0"
            >
              <div>
                <p className="font-medium">{e.reportName}</p>
                <p className="text-xs text-muted-foreground">
                  {e.format.toUpperCase()} ·{' '}
                  {e.recordCount?.toLocaleString() ?? '—'} rows
                </p>
              </div>
              <Badge variant={exportVariant[e.status]} className="capitalize">
                {e.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      {onExport && (
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
            <BarChart3 className="h-4 w-4 mr-1" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => onExport('xlsx')}>
            Export XLSX
          </Button>
        </div>
      )}
    </div>
  );
}

export function ExportCard({ exportItem }: { exportItem: ReportExport }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{exportItem.reportName}</span>
          <Badge
            variant={exportVariant[exportItem.status]}
            className="capitalize"
          >
            {exportItem.status}
          </Badge>
        </div>
        <Badge variant="outline">{exportItem.format.toUpperCase()}</Badge>
        {exportItem.fileSizeKb != null && (
          <p className="text-xs text-muted-foreground">
            {exportItem.fileSizeKb} KB
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function CategoryBrowser({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: ReportCategory[];
  activeCategory?: ReportCategory;
  onSelect?: (cat: ReportCategory) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <PieChart className="h-5 w-5" /> Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="sm"
            className="capitalize"
            onClick={() => onSelect?.(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

export function ReportAnalyticsPanel({
  analytics,
}: {
  analytics: ReportAnalytics;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: 'Generation Success',
            value: `${analytics.generationSuccessRate}%`,
          },
          {
            label: 'Avg Generation (min)',
            value: analytics.avgGenerationTimeMinutes,
          },
          {
            label: 'Schedule Compliance',
            value: `${analytics.scheduleComplianceRate}%`,
          },
          { label: 'Exports/Day', value: analytics.exportVolumeDaily },
          { label: 'Template Reuse', value: `${analytics.templateReuseRate}%` },
          {
            label: 'Compliance On-Time',
            value: `${analytics.complianceOnTimeRate}%`,
          },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel
        title="Category Throughput"
        data={analytics.categoryThroughput}
      />
      <BarChartPanel
        title="Export Format Breakdown"
        data={analytics.formatBreakdown}
      />
    </div>
  );
}

export function TemplateCard({ template }: { template: ReportTemplate }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <span className="font-medium flex items-center gap-1">
          <Layers className="h-4 w-4" /> {template.name}
        </span>
        <div className="flex gap-1 flex-wrap">
          <Badge variant="outline">{CATEGORY_LABELS[template.category]}</Badge>
          <Badge variant="outline">{template.subcategory}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {template.usageCount} uses
        </p>
      </CardContent>
    </Card>
  );
}

export function ReportLibraryGrid({
  reports,
}: {
  reports: ReportDefinition[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((r) => (
        <ReportCard key={r.reportId} report={r} />
      ))}
    </div>
  );
}

export function CompliancePanel({ reports }: { reports: ComplianceReport[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-5 w-5" /> Compliance Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No compliance reports.
          </p>
        ) : (
          reports.slice(0, 8).map((r) => (
            <div
              key={r.complianceId}
              className="text-sm border-b pb-2 last:border-0"
            >
              <div className="flex justify-between gap-2">
                <span className="font-medium">{r.name}</span>
                <Badge
                  variant={complianceVariant[r.status]}
                  className="capitalize"
                >
                  {r.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {r.regulatoryBody} · Due{' '}
                {format(new Date(r.dueDate), 'MMM d, yyyy')}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function FilterBuilder({
  onFilter,
}: {
  onFilter?: (category: ReportCategory) => void;
}) {
  const categories: ReportCategory[] = [
    'clinical',
    'finance',
    'audit',
    'moh',
    'insurance',
    'hospital',
    'patient',
    'research',
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="h-5 w-5" /> Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            className="capitalize"
            onClick={() => onFilter?.(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

export function ReportTimeline({ exports }: { exports: ReportExport[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Exports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {exports.slice(0, 10).map((e) => (
          <div
            key={e.exportId}
            className="flex justify-between text-sm border-b pb-2 last:border-0"
          >
            <div>
              <p className="font-medium">{e.reportName}</p>
              <p className="text-xs text-muted-foreground">
                {e.format.toUpperCase()} · {e.requestedBy}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {format(new Date(e.requestedAt), 'MMM d, HH:mm')}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ReportMonitor({ instances }: { instances: ReportInstance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Settings className="h-5 w-5" /> Generation Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Running</p>
          <p className="text-lg font-semibold">
            {instances.filter((i) => i.status === 'running').length}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Queued</p>
          <p className="text-lg font-semibold">
            {instances.filter((i) => i.status === 'queued').length}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Completed
          </p>
          <p className="text-lg font-semibold">
            {instances.filter((i) => i.status === 'completed').length}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Failed
          </p>
          <p className="text-lg font-semibold">
            {instances.filter((i) => i.status === 'failed').length}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
