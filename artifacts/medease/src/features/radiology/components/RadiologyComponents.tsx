import { format } from 'date-fns';
import {
  AlertTriangle,
  Download,
  Maximize2,
  RotateCw,
  Share2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import type {
  DiagnosticReport,
  ImagingDevice,
  ImageViewerState,
  Radiologist,
  RadiologyAnalytics,
  RadiologyDashboard,
  RadiologyStudy,
  RadiologyTimelineEntry,
  ImagingComparison,
} from '@/services/radiology/types';
import { MetricCard, StatCard } from '@/shared/components';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export function StudyStatusBadge({ status }: { status: RadiologyStudy['status'] }) {
  const variant = status === 'final' || status === 'completed' ? 'success' : status === 'cancelled' ? 'destructive' : status === 'pending_interpretation' ? 'warning' : 'info';
  return <Badge variant={variant} className="capitalize">{status.replace(/_/g, ' ')}</Badge>;
}

export function RadiologyStudyCard({ study }: { study: RadiologyStudy }) {
  return (
    <Card className={cn(study.isCritical && 'border-destructive/50')}>
      <CardHeader className="pb-2 flex-row justify-between">
        <div>
          <CardTitle className="text-base">{study.modality} — {study.bodyPart.replace('_', ' ')}</CardTitle>
          <p className="text-sm text-muted-foreground">{study.accessionNumber}</p>
        </div>
        <StudyStatusBadge status={study.status} />
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>{study.reason}</p>
        <p className="text-muted-foreground">{format(new Date(study.studyDate), 'PP')} · {study.facilityName}</p>
        <p>{study.imageCount} images · {study.seriesCount} series</p>
        {study.isEmergency ? <Badge variant="destructive">Emergency</Badge> : null}
      </CardContent>
    </Card>
  );
}

export function CriticalFindingBanner({ title, message }: { title: string; message: string }) {
  return (
    <Card className="border-destructive bg-destructive/5">
      <CardContent className="pt-4 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RadiologyMetrics({ dashboard }: { dashboard: RadiologyDashboard }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Studies Today" value={dashboard.studiesToday} />
      <MetricCard title="Pending Reports" value={dashboard.pendingReports} status="warning" />
      <MetricCard title="Critical" value={dashboard.criticalFindings} status={dashboard.criticalFindings > 0 ? 'critical' : 'success'} />
      <MetricCard title="Unread" value={dashboard.unreadReports} status="info" />
      <MetricCard title="Emergency" value={dashboard.emergencyStudies} status="warning" />
    </div>
  );
}

export function StudyTimeline({ entries }: { entries: RadiologyTimelineEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.map((e) => (
        <div key={e.id} className="flex gap-3 text-sm border-b pb-3 last:border-0">
          <div className="flex-1">
            <p className="font-medium">{e.title}</p>
            <p className="text-muted-foreground">{e.description}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(e.timestamp), 'PPp')}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DiagnosticReportPanel({ report }: { report: DiagnosticReport }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{report.title}</h3>
          <p className="text-sm text-muted-foreground">{report.radiologistName} · {report.accessionNumber}</p>
        </div>
        <Badge variant={report.status === 'final' ? 'success' : 'info'}>{report.status}</Badge>
      </div>
      <section>
        <h4 className="font-medium mb-2">Findings</h4>
        {report.findings.map((f) => (
          <div key={f.id} className="mb-2 text-sm">
            <p className="font-medium">{f.title}</p>
            <p className="text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </section>
      <section>
        <h4 className="font-medium mb-2">Impression</h4>
        <p className="text-sm">{report.impression.summary}</p>
      </section>
      {report.recommendations.length ? (
        <section>
          <h4 className="font-medium mb-2">Recommendations</h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {report.recommendations.map((r) => <li key={r.id}>{r.text}</li>)}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export function ImageThumbnailGrid({ study, activeInstanceId, onSelect }: {
  study: RadiologyStudy;
  activeInstanceId?: string;
  onSelect: (seriesId: string, instanceId: string) => void;
}) {
  const instances = study.series.flatMap((s) => s.instances.map((i) => ({ ...i, seriesId: s.id })));
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" role="list" aria-label="Image thumbnails">
      {instances.slice(0, 24).map((inst) => (
        <button
          key={inst.id}
          type="button"
          role="listitem"
          onClick={() => onSelect(inst.seriesId, inst.id)}
          className={cn(
            'h-16 w-16 shrink-0 rounded border bg-muted flex items-center justify-center text-xs',
            activeInstanceId === inst.id && 'ring-2 ring-primary',
          )}
          aria-label={`Instance ${inst.instanceNumber}`}
        >
          {inst.instanceNumber}
        </button>
      ))}
    </div>
  );
}

export function WindowLevelControls({ wc, ww, onChange }: { wc: number; ww: number; onChange: (wc: number, ww: number) => void }) {
  return (
    <div className="flex gap-4 text-sm items-center">
      <label className="flex items-center gap-2">
        W/L
        <input type="range" min={0} max={100} value={wc} onChange={(e) => onChange(Number(e.target.value), ww)} aria-label="Window center" />
      </label>
      <label className="flex items-center gap-2">
        Width
        <input type="range" min={1} max={800} value={ww} onChange={(e) => onChange(wc, Number(e.target.value))} aria-label="Window width" />
      </label>
    </div>
  );
}

export function ImagingViewer({ study, initialState }: { study: RadiologyStudy; initialState?: ImageViewerState | null }) {
  const [state, setState] = useState<ImageViewerState>(
    initialState ?? {
      studyId: study.id,
      activeSeriesId: study.series[0]?.id ?? '',
      activeInstanceId: study.series[0]?.instances[0]?.id ?? '',
      layout: '1x1',
      zoom: 1,
      pan: { x: 0, y: 0 },
      rotation: 0,
      invert: false,
      windowCenter: 40,
      windowWidth: 400,
    },
  );

  const handleSelect = useCallback((seriesId: string, instanceId: string) => {
    setState((s) => ({ ...s, activeSeriesId: seriesId, activeInstanceId: instanceId }));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center border rounded-md p-2 bg-muted/30" role="toolbar" aria-label="Image viewer toolbar">
        <Button type="button" size="sm" variant="outline" onClick={() => setState((s) => ({ ...s, zoom: Math.min(s.zoom + 0.25, 4) }))} aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setState((s) => ({ ...s, zoom: Math.max(s.zoom - 0.25, 0.5) }))} aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setState((s) => ({ ...s, rotation: (s.rotation + 90) % 360 }))} aria-label="Rotate"><RotateCw className="h-4 w-4" /></Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setState((s) => ({ ...s, invert: !s.invert }))}>Invert</Button>
        <WindowLevelControls wc={state.windowCenter} ww={state.windowWidth} onChange={(wc, ww) => setState((s) => ({ ...s, windowCenter: wc, windowWidth: ww }))} />
      </div>
      <div
        className={cn(
          'relative aspect-video max-h-[480px] w-full rounded-lg border bg-black/90 flex items-center justify-center text-white',
          state.invert && 'invert',
        )}
        style={{ transform: `scale(${state.zoom}) rotate(${state.rotation}deg)` }}
        role="img"
        aria-label={`DICOM placeholder viewer — ${study.modality} ${study.bodyPart}`}
      >
        <div className="text-center text-sm opacity-80">
          <p className="font-mono">{study.modality} · Series {state.activeSeriesId.split('-').pop()}</p>
          <p>Placeholder viewer — OHIF / Cornerstone ready</p>
          <p className="text-xs mt-2">WC: {state.windowCenter} WW: {state.windowWidth}</p>
        </div>
        <Button type="button" size="icon" variant="secondary" className="absolute top-2 right-2" aria-label="Fullscreen"><Maximize2 className="h-4 w-4" /></Button>
      </div>
      <ImageThumbnailGrid study={study} activeInstanceId={state.activeInstanceId} onSelect={handleSelect} />
    </div>
  );
}

export function StudyComparisonPanel({ comparison }: { comparison: ImagingComparison }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Study Comparison</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-2">
        <p>{comparison.deltaSummary}</p>
        <ul className="list-disc pl-5">
          {comparison.changedFindings.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </CardContent>
    </Card>
  );
}

export function RadiologistCard({ radiologist }: { radiologist: Radiologist }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">{radiologist.name}</p>
        <p className="text-muted-foreground">{radiologist.specialty}</p>
        <p>{radiologist.activeStudies} active studies</p>
      </CardContent>
    </Card>
  );
}

export function DeviceCard({ device }: { device: ImagingDevice }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm">
        <p className="font-medium">{device.name}</p>
        <p className="text-muted-foreground">{device.modality} · {device.facilityName}</p>
        <Badge variant={device.status === 'online' ? 'success' : 'warning'}>{device.status}</Badge>
        <p className="mt-1">{device.utilizationPercent}% utilization</p>
      </CardContent>
    </Card>
  );
}

export function PACSStatusCard() {
  return (
    <Card>
      <CardContent className="pt-4 flex justify-between items-center text-sm">
        <span>PACS Connection</span>
        <Badge variant="success">Connected · 24ms</Badge>
      </CardContent>
    </Card>
  );
}

export function RadiologyAnalyticsPanel({ analytics }: { analytics: RadiologyAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.totalStudies}</p><p className="text-xs text-muted-foreground">Total studies</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.averageReportingHours}h</p><p className="text-xs text-muted-foreground">Avg reporting</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.criticalCount}</p><p className="text-xs text-muted-foreground">Critical</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-2xl font-bold">{analytics.deviceUtilization}%</p><p className="text-xs text-muted-foreground">Device util.</p></CardContent></Card>
      </div>
      <BarChartPanel title="Studies by modality" data={analytics.studiesByModality} />
      <BarChartPanel title="Turnaround by month" data={analytics.turnaroundByMonth} />
    </div>
  );
}

export function ExportShareToolbar({ onExport, onShare }: { onExport?: () => void; onShare?: () => void }) {
  return (
    <div className="flex gap-2">
      {onExport ? <Button type="button" size="sm" variant="outline" onClick={onExport}><Download className="h-4 w-4 mr-1" />Export</Button> : null}
      {onShare ? <Button type="button" size="sm" variant="outline" onClick={onShare}><Share2 className="h-4 w-4 mr-1" />Share</Button> : null}
    </div>
  );
}
