import { format } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BedDouble,
  Building2,
  DollarSign,
  HeartPulse,
  LineChart,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';

import { scorecardGrade } from '@/services/executive/executive-scorecards';
import { benchmarkStatus } from '@/services/executive/benchmarking';
import type {
  BenchmarkReport,
  CapacitySnapshot,
  DepartmentScorecard,
  EnterpriseAlert,
  EnterpriseKpi,
  ExecutiveAnalytics,
  ExecutiveCommandCenter,
  ExecutiveForecast,
  HospitalOperations,
  PatientFlowMetrics,
  PopulationDashboard,
  QualityDashboard,
  RevenueDashboard,
  StrategicInitiative,
  WorkforceDashboard,
} from '@/services/executive/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const trendIcon = { up: TrendingUp, down: TrendingDown, stable: Activity };
const alertVariant = { info: 'outline', warning: 'secondary', critical: 'destructive' } as const;
const initiativeVariant = { planning: 'outline', active: 'default', on_track: 'default', at_risk: 'destructive', completed: 'secondary' } as const;

export function ExecutiveDashboard({ dashboard }: { dashboard: ExecutiveCommandCenter }) {
  const metrics = [
    { label: 'Enterprise KPIs', value: dashboard.totalKpis.toLocaleString(), icon: Target },
    { label: 'Active Alerts', value: dashboard.activeAlerts.toLocaleString(), icon: AlertTriangle },
    { label: 'Bed Occupancy', value: `${dashboard.bedOccupancy}%`, icon: BedDouble },
    { label: 'Revenue MTD', value: `$${(dashboard.revenueMtd / 1000000).toFixed(1)}M`, icon: DollarSign },
    { label: 'Quality Score', value: dashboard.qualityScore.toFixed(0), icon: Shield },
    { label: 'Initiatives On Track', value: dashboard.initiativesOnTrack.toLocaleString(), icon: Activity },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4 flex items-center gap-3">
              <m.icon className="h-8 w-8 text-primary shrink-0" />
              <div><p className="text-2xl font-bold">{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel title="Enterprise KPI Trend" data={dashboard.kpiTrend} />
    </div>
  );
}

export function ExecutiveKpiCard({ kpi }: { kpi: EnterpriseKpi }) {
  const TrendIcon = trendIcon[kpi.trend];
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium line-clamp-2">{kpi.name}</span>
          <Badge variant="outline" className="capitalize shrink-0">{kpi.category}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{kpi.value}{kpi.unit === '%' ? '%' : ''}</span>
          <TrendIcon className={`h-4 w-4 ${kpi.trend === 'up' ? 'text-green-600' : kpi.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`} />
          <span className="text-xs text-muted-foreground">{kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent}%</span>
        </div>
        <p className="text-xs text-muted-foreground">Target: {kpi.target}{kpi.unit === '%' ? '%' : ` ${kpi.unit}`}</p>
      </CardContent>
    </Card>
  );
}

export function ScorecardPanel({ scorecard }: { scorecard: DepartmentScorecard }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{scorecard.departmentName}</span>
          <Badge>{scorecardGrade(scorecard.overallScore)} · {scorecard.overallScore}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{scorecard.period} · {scorecard.facilityId}</p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <span>Clinical: {scorecard.clinicalScore}</span>
          <span>Ops: {scorecard.operationalScore}</span>
          <span>Financial: {scorecard.financialScore}</span>
          <span>Quality: {scorecard.qualityScore}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function DepartmentPerformanceCard({ scorecard }: { scorecard: DepartmentScorecard }) {
  return <ScorecardPanel scorecard={scorecard} />;
}

export function HospitalOperationsBoard({ operations }: { operations: HospitalOperations }) {
  const items = [
    { label: 'ED Wait', value: `${operations.edWaitMinutes} min` },
    { label: 'OR Utilization', value: `${operations.orUtilization}%` },
    { label: 'Bed Occupancy', value: `${operations.bedOccupancy}%` },
    { label: 'Discharges/Day', value: operations.dischargeRate },
    { label: 'Admissions/Day', value: operations.admissionRate },
    { label: 'Throughput Index', value: operations.throughputIndex },
  ];
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building2 className="h-5 w-5" /> Hospital Operations</CardTitle></CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="text-sm">
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-lg font-semibold">{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function CapacityDashboard({ snapshots, aggregateOccupancy }: { snapshots: CapacitySnapshot[]; aggregateOccupancy: number }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-4">
          <p className="text-2xl font-bold">{aggregateOccupancy}%</p>
          <p className="text-xs text-muted-foreground">System-wide occupancy</p>
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {snapshots.slice(0, 6).map((s) => (
          <Card key={s.snapshotId}>
            <CardContent className="pt-4 text-sm space-y-1">
              <p className="font-medium">{s.unit}</p>
              <p className="text-xs">{s.occupiedBeds}/{s.totalBeds} beds · {s.occupancyRate}%</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function BedManagementBoard({ snapshots }: { snapshots: CapacitySnapshot[] }) {
  return <CapacityDashboard snapshots={snapshots} aggregateOccupancy={Math.round(snapshots.reduce((s, c) => s + c.occupancyRate, 0) / Math.max(snapshots.length, 1))} />;
}

export function PatientFlowPanel({ flow }: { flow: PatientFlowMetrics }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Patient Flow</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div><p className="text-xs text-muted-foreground">Arrivals Today</p><p className="text-lg font-semibold">{flow.arrivalsToday}</p></div>
          <div><p className="text-xs text-muted-foreground">Discharges</p><p className="text-lg font-semibold">{flow.dischargesToday}</p></div>
          <div><p className="text-xs text-muted-foreground">Transfers</p><p className="text-lg font-semibold">{flow.transfersToday}</p></div>
          <div><p className="text-xs text-muted-foreground">Avg LOS</p><p className="text-lg font-semibold">{flow.avgLengthOfStay.toFixed(1)}d</p></div>
        </div>
        <BarChartPanel title="Weekly Flow" data={flow.flowTrend} />
      </CardContent>
    </Card>
  );
}

export function RevenueDashboardPanel({ revenue }: { revenue: RevenueDashboard }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-5 w-5" /> Revenue</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div><p className="text-xs text-muted-foreground">MTD</p><p className="text-lg font-semibold">${(revenue.revenueMtd / 1000000).toFixed(1)}M</p></div>
          <div><p className="text-xs text-muted-foreground">YTD</p><p className="text-lg font-semibold">${(revenue.revenueYtd / 1000000).toFixed(1)}M</p></div>
          <div><p className="text-xs text-muted-foreground">Collection Rate</p><p className="text-lg font-semibold">{revenue.collectionRate}%</p></div>
          <div><p className="text-xs text-muted-foreground">Denial Rate</p><p className="text-lg font-semibold">{revenue.denialRate}%</p></div>
          <div><p className="text-xs text-muted-foreground">Net Margin</p><p className="text-lg font-semibold">{revenue.netMargin}%</p></div>
        </div>
        <BarChartPanel title="Revenue Trend" data={revenue.revenueTrend} />
      </CardContent>
    </Card>
  );
}

export function ClinicalQualityDashboard({ quality }: { quality: QualityDashboard }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-5 w-5" /> Clinical Quality</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div><p className="text-xs text-muted-foreground">Overall Score</p><p className="text-lg font-semibold">{quality.overallScore}</p></div>
          <div><p className="text-xs text-muted-foreground">Patient Satisfaction</p><p className="text-lg font-semibold">{quality.patientSatisfaction}%</p></div>
          <div><p className="text-xs text-muted-foreground">Infection Rate</p><p className="text-lg font-semibold">{quality.infectionRate}%</p></div>
          <div><p className="text-xs text-muted-foreground">Mortality Index</p><p className="text-lg font-semibold">{quality.mortalityIndex}</p></div>
          <div><p className="text-xs text-muted-foreground">Compliance</p><p className="text-lg font-semibold">{quality.complianceRate}%</p></div>
        </div>
        <BarChartPanel title="Quality Trend" data={quality.qualityTrend} />
      </CardContent>
    </Card>
  );
}

export function WorkforceDashboardPanel({ workforce }: { workforce: WorkforceDashboard }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-5 w-5" /> Workforce</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div><p className="text-xs text-muted-foreground">Total Staff</p><p className="text-lg font-semibold">{workforce.totalStaff.toLocaleString()}</p></div>
          <div><p className="text-xs text-muted-foreground">Vacancy Rate</p><p className="text-lg font-semibold">{workforce.vacancyRate}%</p></div>
          <div><p className="text-xs text-muted-foreground">Overtime Hours</p><p className="text-lg font-semibold">{workforce.overtimeHours}</p></div>
          <div><p className="text-xs text-muted-foreground">Turnover</p><p className="text-lg font-semibold">{workforce.turnoverRate}%</p></div>
          <div><p className="text-xs text-muted-foreground">Satisfaction</p><p className="text-lg font-semibold">{workforce.satisfactionScore}%</p></div>
        </div>
        <BarChartPanel title="Staffing Trend" data={workforce.staffingTrend} />
      </CardContent>
    </Card>
  );
}

export function PopulationHealthDashboard({ population }: { population: PopulationDashboard }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><HeartPulse className="h-5 w-5" /> Population Health</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div><p className="text-xs text-muted-foreground">Attributed Lives</p><p className="text-lg font-semibold">{population.attributedLives.toLocaleString()}</p></div>
          <div><p className="text-xs text-muted-foreground">Risk Score</p><p className="text-lg font-semibold">{population.riskScore}</p></div>
          <div><p className="text-xs text-muted-foreground">Gap Closure</p><p className="text-lg font-semibold">{population.gapClosureRate}%</p></div>
          <div><p className="text-xs text-muted-foreground">Preventive Care</p><p className="text-lg font-semibold">{population.preventiveCareRate}%</p></div>
          <div><p className="text-xs text-muted-foreground">Chronic Disease</p><p className="text-lg font-semibold">{population.chronicDiseaseRate}%</p></div>
        </div>
        <BarChartPanel title="Population Trend" data={population.populationTrend} />
      </CardContent>
    </Card>
  );
}

export function EnterpriseAlertCenter({ alerts }: { alerts: EnterpriseAlert[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Enterprise Alerts</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {alerts.length === 0 ? <p className="text-sm text-muted-foreground">No active alerts.</p> : alerts.slice(0, 8).map((a) => (
          <div key={a.alertId} className="flex justify-between gap-2 text-sm border-b pb-2 last:border-0">
            <div className="min-w-0">
              <p className="font-medium line-clamp-1">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.sourceModule} · {format(new Date(a.createdAt), 'MMM d')}</p>
            </div>
            <Badge variant={alertVariant[a.severity]}>{a.severity}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function BenchmarkPanel({ report }: { report: BenchmarkReport }) {
  const status = benchmarkStatus(report.percentile);
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{report.metric}</span>
          <Badge variant={status === 'leading' ? 'default' : status === 'lagging' ? 'destructive' : 'secondary'}>{report.percentile}th</Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div><p className="text-muted-foreground">Internal</p><p className="font-medium">{report.internalValue}</p></div>
          <div><p className="text-muted-foreground">Peer</p><p className="font-medium">{report.peerAverage}</p></div>
          <div><p className="text-muted-foreground">National</p><p className="font-medium">{report.nationalBenchmark}</p></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StrategicInitiativeCard({ initiative }: { initiative: StrategicInitiative }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium line-clamp-2">{initiative.name}</span>
          <Badge variant={initiativeVariant[initiative.status]} className="capitalize shrink-0">{initiative.status.replace('_', ' ')}</Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${initiative.progress}%` }} /></div>
        <p className="text-xs text-muted-foreground">{initiative.progress}% · ${(initiative.spent / 1000).toFixed(0)}K / ${(initiative.budget / 1000).toFixed(0)}K</p>
        <p className="text-xs">Target: {format(new Date(initiative.targetDate), 'MMM d, yyyy')}</p>
      </CardContent>
    </Card>
  );
}

export function ForecastPanel({ forecast }: { forecast: ExecutiveForecast }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><LineChart className="h-5 w-5" /> {forecast.metric}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-2xl font-bold">{forecast.predictedValue.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{forecast.horizon} horizon · {forecast.facilityId}</p>
        <BarChartPanel title="" data={forecast.trend} />
      </CardContent>
    </Card>
  );
}

export function ExecutiveAnalyticsPanel({ analytics }: { analytics: ExecutiveAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'KPI Achievement', value: `${analytics.kpiAchievementRate}%` },
          { label: 'Operational Efficiency', value: `${analytics.operationalEfficiency}%` },
          { label: 'Financial Performance', value: `${analytics.financialPerformance}%` },
          { label: 'Quality Index', value: analytics.qualityIndex },
          { label: 'Workforce Utilization', value: `${analytics.workforceUtilization}%` },
          { label: 'Benchmark Percentile', value: `${analytics.benchmarkPercentile}th` },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel title="Module Contributions" data={analytics.moduleContributions} />
      <BarChartPanel title="Initiative Progress" data={analytics.initiativeProgress} />
    </div>
  );
}

export function ExportToolbar({ onExport }: { onExport: (format: 'csv' | 'pdf' | 'xlsx') => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => onExport('csv')}><BarChart3 className="h-4 w-4 mr-1" /> Export CSV</Button>
      <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>Export PDF</Button>
      <Button variant="outline" size="sm" onClick={() => onExport('xlsx')}>Export XLSX</Button>
    </div>
  );
}
