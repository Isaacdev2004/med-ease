import { format } from 'date-fns';
import { Activity, AlertTriangle, Battery, Heart, Thermometer, Wifi, WifiOff } from 'lucide-react';

import type {
  EarlyWarningScore,
  MonitoringAlert,
  MonitoringAnalytics,
  MonitoringDashboard,
  MonitoringDevice,
  Observation,
  ObservationTimelineEntry,
  PatientTrend,
  RemoteMonitoringProgram,
  VitalSign,
} from '@/services/patient-monitoring/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export function MonitoringStatusBadge({ status }: { status: VitalSign['status'] }) {
  const map = { normal: 'default', warning: 'secondary', critical: 'destructive' } as const;
  return <Badge variant={map[status]} className="capitalize">{status}</Badge>;
}

export function DeviceStatusBadge({ status }: { status: MonitoringDevice['status'] }) {
  const variant = status === 'online' ? 'default' : status === 'error' ? 'destructive' : 'secondary';
  return <Badge variant={variant} className="capitalize">{status}</Badge>;
}

export function BatteryIndicator({ percent, status }: { percent?: number; status: MonitoringDevice['battery'] }) {
  const color = status === 'critical' ? 'text-destructive' : status === 'low' ? 'text-amber-600' : 'text-emerald-600';
  return (
    <div className={cn('flex items-center gap-1 text-sm', color)}>
      <Battery className="h-4 w-4" />
      <span>{percent ?? 0}%</span>
    </div>
  );
}

export function VitalCard({ vital }: { vital: VitalSign }) {
  const icons: Record<string, typeof Heart> = {
    heart_rate: Heart,
    temperature: Thermometer,
    spo2: Activity,
  };
  const Icon = icons[vital.type] ?? Activity;
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium capitalize">{vital.type.replace(/_/g, ' ')}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{vital.value} <span className="text-sm font-normal text-muted-foreground">{vital.unit}</span></p>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <MonitoringStatusBadge status={vital.status} />
          <span>{format(new Date(vital.recordedAt), 'MMM d, HH:mm')}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export const MonitoringCard = VitalCard;

export function AlertBanner({ alert }: { alert: MonitoringAlert }) {
  const variant = alert.severity === 'critical' || alert.severity === 'urgent' ? 'destructive' : 'default';
  return (
    <div className={cn('rounded-lg border p-4', variant === 'destructive' ? 'border-destructive/50 bg-destructive/5' : 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/20')}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={cn('h-5 w-5 mt-0.5', variant === 'destructive' ? 'text-destructive' : 'text-amber-600')} />
        <div>
          <p className="font-medium">{alert.title}</p>
          <p className="text-sm text-muted-foreground">{alert.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{alert.patientName} · {format(new Date(alert.createdAt), 'MMM d, HH:mm')}</p>
        </div>
      </div>
    </div>
  );
}

export function AlertCard({ alert }: { alert: MonitoringAlert }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm">{alert.title}</CardTitle>
          <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>{alert.severity}</Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{alert.message}</p>
        <p className="mt-2 capitalize">Status: {alert.status}</p>
      </CardContent>
    </Card>
  );
}

export function NEWSScoreCard({ score }: { score: EarlyWarningScore }) {
  if (score.type !== 'NEWS2') return null;
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">NEWS2 Score</CardTitle></CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{score.score}</p>
        <Badge className="mt-2 capitalize" variant={score.riskLevel === 'critical' ? 'destructive' : 'secondary'}>{score.riskLevel} risk</Badge>
      </CardContent>
    </Card>
  );
}

export function MEWSCard({ score }: { score: EarlyWarningScore }) {
  if (score.type !== 'MEWS') return null;
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">MEWS Score</CardTitle></CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{score.score}</p>
        <Badge className="mt-2 capitalize" variant={score.riskLevel === 'critical' ? 'destructive' : 'secondary'}>{score.riskLevel} risk</Badge>
      </CardContent>
    </Card>
  );
}

export function DeviceCard({ device }: { device: MonitoringDevice }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{device.name}</CardTitle>
          {device.status === 'online' ? <Wifi className="h-4 w-4 text-emerald-600" /> : <WifiOff className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="text-muted-foreground">{device.manufacturer} · {device.model}</p>
        <div className="flex items-center justify-between">
          <DeviceStatusBadge status={device.status} />
          <BatteryIndicator percent={device.batteryPercent} status={device.battery} />
        </div>
      </CardContent>
    </Card>
  );
}

export function RPMEnrollmentCard({ program }: { program: RemoteMonitoringProgram }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{program.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p className="text-muted-foreground">{program.clinicianName}</p>
        <p>Frequency: {program.frequency}</p>
        <Badge className="capitalize">{program.status}</Badge>
      </CardContent>
    </Card>
  );
}

export function MonitoringKpiCards({ dashboard }: { dashboard: MonitoringDashboard }) {
  const kpis = [
    { label: 'Active alerts', value: dashboard.activeAlerts },
    { label: 'Critical alerts', value: dashboard.criticalAlerts },
    { label: 'Avg NEWS2', value: dashboard.averageNews2 },
    { label: 'Compliance', value: `${dashboard.monitoringCompliance}%` },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <Card key={k.label}><CardContent className="pt-4"><p className="text-2xl font-bold">{k.value}</p><p className="text-xs text-muted-foreground">{k.label}</p></CardContent></Card>
      ))}
    </div>
  );
}

export function VitalTrendChart({ trend }: { trend: PatientTrend }) {
  return <BarChartPanel title={`${trend.metric.replace(/_/g, ' ')} (${trend.period})`} data={trend.points} />;
}

export function ClinicalTrendPanel({ trends }: { trends: PatientTrend[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {trends.slice(0, 4).map((t) => <VitalTrendChart key={t.id} trend={t} />)}
    </div>
  );
}

export function MonitoringAnalyticsPanel({ analytics }: { analytics: MonitoringAnalytics }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BarChartPanel title="Daily vital trends" data={analytics.dailyVitalTrends} />
      <BarChartPanel title="Alert trends" data={analytics.alertTrends} />
      <BarChartPanel title="RPM enrollment growth" data={analytics.rpmEnrollmentGrowth} />
      <BarChartPanel title="Device utilization" data={analytics.deviceUtilizationChart} />
    </div>
  );
}

export function ObservationTable({ observations }: { observations: Observation[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50"><tr><th className="p-2 text-left">Observation</th><th className="p-2 text-left">Value</th><th className="p-2 text-left">When</th><th className="p-2 text-left">Status</th></tr></thead>
        <tbody>
          {observations.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.display}</td>
              <td className="p-2">{o.value} {o.unit}</td>
              <td className="p-2">{format(new Date(o.recordedAt), 'MMM d, HH:mm')}</td>
              <td className="p-2 capitalize">{o.interpretation ?? 'normal'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ObservationTimeline({ entries }: { entries: ObservationTimelineEntry[] }) {
  return (
    <div className="space-y-3">
      {entries.slice(0, 20).map((e) => (
        <div key={e.id} className="flex gap-3 border-l-2 border-primary/30 pl-4">
          <div>
            <p className="font-medium text-sm">{e.title}</p>
            <p className="text-sm text-muted-foreground">{e.description}</p>
            <p className="text-xs text-muted-foreground">{format(new Date(e.date), 'MMM d, yyyy HH:mm')}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MonitoringSessionCard({ session }: { session: { context: string; startedAt: string; observationCount: number; alertCount: number; status: string } }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm capitalize">{session.context} session</CardTitle></CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>{session.observationCount} observations · {session.alertCount} alerts</p>
        <Badge className="mt-2 capitalize">{session.status}</Badge>
      </CardContent>
    </Card>
  );
}

export function ObservationFiltersBar({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <input
      type="search"
      className="h-9 w-full max-w-sm rounded-md border bg-background px-3 text-sm"
      placeholder="Search observations…"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}

export const ObservationSearch = ObservationFiltersBar;
export const VitalChart = VitalTrendChart;
