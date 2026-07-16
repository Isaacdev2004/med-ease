import { format } from 'date-fns';
import { AlertTriangle, Beaker, CheckCircle2, Download, FlaskConical, Microscope, Share2, TrendingUp } from 'lucide-react';

import type {
  BloodBankRecord,
  LabAlert,
  LabDiagnosticReport,
  LabObservation,
  LabOrder,
  LabTimelineEntry,
  LabTrendSeries,
  LaboratoryAnalytics,
  LaboratoryDashboard,
  LaboratoryInstrument,
  MicrobiologyResult,
  PathologyResult,
  QualityDashboard,
  ResultFlag,
  SpecimenRecord,
  Technologist,
} from '@/services/laboratory/types';
import { alertSeverityColor } from '@/services/laboratory/alerts';
import { flagSeverity } from '@/services/laboratory/results';
import { MetricCard, StatCard } from '@/shared/components';
import { BarChartPanel, ChartPanel, SparklineChart } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export function OrderStatusBadge({ status }: { status: LabOrder['status'] }) {
  const variant = status === 'completed' ? 'success' : status === 'cancelled' || status === 'rejected' ? 'destructive' : status === 'in_progress' ? 'info' : 'warning';
  return <Badge variant={variant} className="capitalize">{status.replace('_', ' ')}</Badge>;
}

export function ReferenceRangeBadge({ flag }: { flag: ResultFlag }) {
  const variant = flagSeverity(flag) === 'success' ? 'success' : flagSeverity(flag) === 'critical' ? 'destructive' : 'warning';
  return <Badge variant={variant} className="capitalize">{flag.replace('_', ' ')}</Badge>;
}

export function LabOrderCard({ order }: { order: LabOrder }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">{order.orderNumber}</CardTitle>
          <p className="text-sm text-muted-foreground">{order.testNames.join(', ')}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>{order.orderingPhysician} · {order.facilityName}</p>
        <p className="text-muted-foreground capitalize">{order.priority} · {order.collectionMethod.replace('_', ' ')}</p>
        {order.scheduledAt ? <p>Scheduled {format(new Date(order.scheduledAt), 'PP')}</p> : null}
      </CardContent>
    </Card>
  );
}

export function LabResultCard({ report, observations }: { report: LabDiagnosticReport; observations?: LabObservation[] }) {
  const critical = observations?.some((o) => o.flag.startsWith('critical'));
  return (
    <Card className={cn(critical && 'border-destructive/50')}>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="text-base">{report.title}</CardTitle>
        <Badge variant={report.status === 'released' ? 'success' : 'info'}>{report.status}</Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p>{report.reportNumber} · {report.category.replace('_', ' ')}</p>
        {observations?.slice(0, 3).map((o) => (
          <div key={o.id} className="flex justify-between gap-2">
            <span>{o.testName}</span>
            <span className="flex items-center gap-2">
              {o.value} {o.unit}
              <ReferenceRangeBadge flag={o.flag} />
            </span>
          </div>
        ))}
        {report.releasedAt ? <p className="text-muted-foreground">Released {format(new Date(report.releasedAt), 'PP')}</p> : null}
      </CardContent>
    </Card>
  );
}

export function SpecimenCard({ specimen }: { specimen: SpecimenRecord }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="text-base">{specimen.barcode}</CardTitle>
        <Badge variant={specimen.status === 'rejected' ? 'destructive' : 'outline'} className="capitalize">{specimen.status.replace('_', ' ')}</Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>{specimen.specimenType}</p>
        {specimen.collectedAt ? <p>Collected {format(new Date(specimen.collectedAt), 'PPp')}</p> : null}
        {specimen.temperature ? <p className="text-muted-foreground">Storage: {specimen.temperature}</p> : null}
      </CardContent>
    </Card>
  );
}

export function CriticalAlertCard({ alert }: { alert: LabAlert }) {
  return (
    <Card className="border-l-4" style={{ borderLeftColor: alertSeverityColor(alert.severity) }}>
      <CardContent className="pt-4 flex gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
        <div className="text-sm">
          <p className="font-medium">{alert.title}</p>
          <p className="text-muted-foreground">{alert.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{format(new Date(alert.createdAt), 'PPp')}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function LaboratoryKpiCards({ dashboard }: { dashboard: LaboratoryDashboard }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Today's Orders" value={dashboard.todayOrders} icon={FlaskConical} />
      <MetricCard title="Pending Collection" value={dashboard.pendingCollection} status="warning" />
      <MetricCard title="In Processing" value={dashboard.inProcessing} status="info" />
      <MetricCard title="Results Ready" value={dashboard.resultsReady} status="success" />
      <MetricCard title="Critical" value={dashboard.criticalResults} status={dashboard.criticalResults > 0 ? 'critical' : 'success'} />
    </div>
  );
}

export function TrendChart({ series }: { series: LabTrendSeries }) {
  return (
    <ChartPanel title={`${series.testName} trend`}>
      <SparklineChart data={series.points.map((p) => ({ label: format(new Date(p.date), 'MMM d'), value: p.value }))} />
      <p className="text-xs text-muted-foreground mt-2">Reference: {series.referenceRange}</p>
    </ChartPanel>
  );
}

export function LabTimeline({ entries }: { entries: LabTimelineEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="flex gap-3 text-sm border-b pb-3 last:border-0">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-medium">{entry.title}</p>
            <p className="text-muted-foreground">{entry.description}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(entry.timestamp), 'PPp')}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PreparationCard({ testName, preparation }: { testName: string; preparation: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2"><Beaker className="h-4 w-4" aria-hidden="true" />{testName}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{preparation}</CardContent>
    </Card>
  );
}

export function LaboratoryAnalyticsPanel({ analytics }: { analytics: LaboratoryAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.totalOrders}</p><p className="text-xs text-muted-foreground">Total orders</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.averageTurnaroundHours}h</p><p className="text-xs text-muted-foreground">Avg TAT</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.verificationRate}%</p><p className="text-xs text-muted-foreground">Verification rate</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.qualityScore}</p><p className="text-xs text-muted-foreground">Quality score</p></CardContent></Card>
      </div>
      <BarChartPanel title="Orders by category" data={analytics.ordersByCategory} />
      <BarChartPanel title="Turnaround by department" data={analytics.turnaroundByDepartment} />
    </div>
  );
}

export function ResultTable({ observations }: { observations: LabObservation[] }) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Test</th>
            <th className="px-3 py-2 text-left font-medium">Result</th>
            <th className="px-3 py-2 text-left font-medium">Reference</th>
            <th className="px-3 py-2 text-left font-medium">Flag</th>
          </tr>
        </thead>
        <tbody>
          {observations.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="px-3 py-2">{o.testName}</td>
              <td className="px-3 py-2">{o.value} {o.unit}</td>
              <td className="px-3 py-2 text-muted-foreground">{o.referenceRange}</td>
              <td className="px-3 py-2"><ReferenceRangeBadge flag={o.flag} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function QualityIndicator({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
      <span>Quality score: <strong>{score}</strong>/100</span>
    </div>
  );
}

export const LaboratoryResultCard = LabResultCard;

export function ResultStatusBadge({ status }: { status: LabDiagnosticReport['status'] }) {
  const variant = status === 'released' ? 'success' : status === 'rejected' || status === 'cancelled' ? 'destructive' : 'info';
  return <Badge variant={variant} className="capitalize">{status}</Badge>;
}

export function CriticalValueBanner({ title, message }: { title: string; message: string }) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="pt-4 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium text-destructive">{title}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReferenceRangePanel({ observations }: { observations: LabObservation[] }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">Reference Ranges</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {observations.map((o) => (
          <div key={o.id} className="flex justify-between gap-2 border-b pb-2 last:border-0">
            <span>{o.testName}</span>
            <span className="text-muted-foreground">{o.referenceRange} {o.unit}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export const LaboratoryMetrics = LaboratoryKpiCards;

export function MicrobiologyPanel({ result }: { result: MicrobiologyResult }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="text-base flex items-center gap-2"><Microscope className="h-4 w-4" />{result.specimenType}</CardTitle>
        <ResultStatusBadge status={result.status} />
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        {result.gramStain ? <p>Gram stain: {result.gramStain}</p> : null}
        {result.cultures.map((c, i) => (
          <div key={i} className="rounded border p-2">
            <p className="font-medium">{c.organism}</p>
            {c.colonyCount ? <p className="text-muted-foreground">{c.colonyCount}</p> : null}
            <div className="flex flex-wrap gap-1 mt-1">
              {c.sensitivities.map((s) => (
                <Badge key={s.antibiotic} variant={s.interpretation === 'S' ? 'success' : s.interpretation === 'R' ? 'destructive' : 'warning'}>
                  {s.antibiotic} ({s.interpretation})
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PathologyPanel({ result }: { result: PathologyResult }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="text-base">{result.specimenSite}</CardTitle>
        <ResultStatusBadge status={result.status} />
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        {result.macroscopic ? <p><strong>Macroscopic:</strong> {result.macroscopic}</p> : null}
        {result.microscopic ? <p><strong>Microscopic:</strong> {result.microscopic}</p> : null}
        {result.histology.map((h) => (
          <div key={h.id} className="rounded border p-2">
            <p className="font-medium">{h.diagnosis}</p>
            <p className="text-muted-foreground">{h.findings}</p>
          </div>
        ))}
        {result.pathologistName ? <p className="text-muted-foreground">Pathologist: {result.pathologistName}</p> : null}
      </CardContent>
    </Card>
  );
}

export function BloodBankPanel({ record }: { record: BloodBankRecord }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="text-base">{record.component}</CardTitle>
        <ResultStatusBadge status={record.status} />
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>Group {record.bloodGroup}{record.rhFactor === 'Positive' ? '+' : '−'}</p>
        <p className="capitalize">Cross-match: {record.crossMatchResult}</p>
        <p className="text-muted-foreground">Collected {format(new Date(record.collectedAt), 'PP')}</p>
      </CardContent>
    </Card>
  );
}

export function QualityDashboardPanel({ dashboard }: { dashboard: QualityDashboard }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-4">
        {dashboard.kpis.map((k) => (
          <Card key={k.label}><CardContent className="pt-4"><p className="text-2xl font-bold">{k.value}</p><p className="text-xs text-muted-foreground">{k.label}</p></CardContent></Card>
        ))}
      </div>
      <QualityIndicator score={dashboard.qualityScore} />
      <div className="grid gap-2">
        {dashboard.recentQc.slice(0, 6).map((qc) => (
          <div key={qc.id} className="flex justify-between text-sm border-b pb-2">
            <span>{qc.testName}</span>
            <Badge variant={qc.withinRange ? 'success' : 'destructive'}>{qc.withinRange ? 'Pass' : 'Fail'}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InstrumentCard({ instrument }: { instrument: LaboratoryInstrument }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="text-base">{instrument.name}</CardTitle>
        <Badge variant={instrument.status === 'online' ? 'success' : 'warning'} className="capitalize">{instrument.status}</Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>{instrument.manufacturer} {instrument.model}</p>
        <p className="text-muted-foreground">{instrument.department} · {instrument.utilizationPercent}% util.</p>
      </CardContent>
    </Card>
  );
}

export function TechnologistCard({ technologist }: { technologist: Technologist }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">{technologist.name}</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>{technologist.credentials}</p>
        <p className="text-muted-foreground">{technologist.department} · {technologist.activeOrders} active</p>
      </CardContent>
    </Card>
  );
}

export function ResultViewer({ report, observations }: { report: LabDiagnosticReport; observations: LabObservation[] }) {
  return (
    <div className="space-y-4">
      <LabResultCard report={report} observations={observations} />
      <ReferenceRangePanel observations={observations} />
      <ResultTable observations={observations} />
    </div>
  );
}

export function ExportShareToolbar({ onExport, onShare }: { onExport?: () => void; onShare?: () => void }) {
  return (
    <div className="flex gap-2">
      {onExport ? <Button variant="outline" size="sm" onClick={onExport}><Download className="h-4 w-4 mr-1" />Export</Button> : null}
      {onShare ? <Button variant="outline" size="sm" onClick={onShare}><Share2 className="h-4 w-4 mr-1" />Share</Button> : null}
    </div>
  );
}

export function PanelCard({ name, category, testCount }: { name: string; category: string; testCount: number }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">{name}</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground capitalize">{category.replace('_', ' ')} · {testCount} tests</CardContent>
    </Card>
  );
}
