import { computePercentile } from '@/services/executive/benchmarking';
import { CAPACITY_UNITS } from '@/services/executive/capacity';
import { DEPARTMENTS } from '@/services/executive/executive-scorecards';
import { buildForecastTrend, FORECAST_HORIZONS } from '@/services/executive/forecasting';
import { KPI_CATEGORIES, KPI_NAMES, computeTrend, kpiChangePercent } from '@/services/executive/kpi-engine';
import type {
  BenchmarkReport,
  CapacitySnapshot,
  DepartmentScorecard,
  EnterpriseAlert,
  EnterpriseKpi,
  ExecutiveCommandCenter,
  ExecutiveDashboardConfig,
  ExecutiveForecast,
  OperationalMetric,
  PerformanceReport,
  StrategicInitiative,
} from '@/services/executive/types';

const FACILITIES = Array.from({ length: 25 }, (_, i) => `fac-${String(i + 1).padStart(3, '0')}`);
const SCALE = { kpis: 10, metrics: 100, alerts: 60, capacity: 53, reports: 50 };

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_ENTERPRISE_KPIS: EnterpriseKpi[] = Array.from({ length: 250 }, (_, i) => {
  const category = KPI_CATEGORIES[i % KPI_CATEGORIES.length]!;
  const names = KPI_NAMES[category];
  const target = 50 + (i % 50);
  const value = target * (0.85 + (i % 30) * 0.01);
  return {
    kpiId: `kpi-${String(i + 1).padStart(5, '0')}`,
    name: names[i % names.length]!,
    category,
    facilityId: FACILITIES[i % 25],
    departmentId: i % 3 === 0 ? `dept-${String((i % 12) + 1).padStart(2, '0')}` : undefined,
    value: Math.round(value * 10) / 10,
    target,
    unit: category === 'financial' ? '$M' : category === 'clinical' ? '%' : 'index',
    trend: computeTrend(value, target),
    changePercent: kpiChangePercent(value, i),
    measuredAt: daysAgo(i % 30),
  };
});

export const MOCK_EXECUTIVE_DASHBOARDS: ExecutiveDashboardConfig[] = Array.from({ length: 30 }, (_, i) => ({
  dashboardId: `dash-${String(i + 1).padStart(4, '0')}`,
  name: ['Enterprise Overview', 'Hospital Operations', 'Financial Performance', 'Quality Scorecard', 'Workforce Analytics'][i % 5]!,
  facilityId: i % 4 === 0 ? undefined : FACILITIES[i % 25],
  ownerId: `user-${String((i % 20) + 1).padStart(3, '0')}`,
  status: (['active', 'draft', 'archived'] as const)[i % 3]!,
  widgetCount: 6 + (i % 8),
  lastViewedAt: daysAgo(i % 7),
  createdAt: daysAgo(90 - (i % 60)),
}));

export const MOCK_OPERATIONAL_METRICS: OperationalMetric[] = Array.from({ length: 400 }, (_, i) => {
  const value = 40 + (i % 55);
  const benchmark = 50 + (i % 20);
  return {
    metricId: `om-${String(i + 1).padStart(5, '0')}`,
    name: ['ED Wait Time', 'OR Utilization', 'Bed Occupancy', 'Discharge Rate', 'Admission Rate', 'Lab TAT', 'Imaging TAT'][i % 7]!,
    facilityId: FACILITIES[i % 25]!,
    departmentId: i % 2 === 0 ? `dept-${String((i % 12) + 1).padStart(2, '0')}` : undefined,
    value,
    unit: i % 3 === 0 ? 'minutes' : '%',
    benchmark,
    measuredAt: daysAgo(i % 14),
  };
});

export const MOCK_DEPARTMENT_SCORECARDS: DepartmentScorecard[] = Array.from({ length: 80 }, (_, i) => ({
  scorecardId: `sc-${String(i + 1).padStart(4, '0')}`,
  departmentId: `dept-${String((i % 12) + 1).padStart(2, '0')}`,
  departmentName: DEPARTMENTS[i % DEPARTMENTS.length]!,
  facilityId: FACILITIES[i % 25]!,
  overallScore: 65 + (i % 30),
  clinicalScore: 70 + (i % 25),
  operationalScore: 60 + (i % 35),
  financialScore: 55 + (i % 40),
  qualityScore: 72 + (i % 22),
  period: ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'][i % 4]!,
}));

export const MOCK_BENCHMARK_REPORTS: BenchmarkReport[] = Array.from({ length: 100 }, (_, i) => {
  const internal = 60 + (i % 35);
  const peer = 55 + (i % 30);
  const national = 58 + (i % 28);
  return {
    reportId: `bench-${String(i + 1).padStart(5, '0')}`,
    metric: ['Readmission Rate', 'Patient Satisfaction', 'Cost per Case', 'Length of Stay', 'Mortality Index'][i % 5]!,
    facilityId: FACILITIES[i % 25]!,
    internalValue: internal,
    peerAverage: peer,
    nationalBenchmark: national,
    percentile: computePercentile(internal, peer, national),
    generatedAt: daysAgo(i % 45),
  };
});

export const MOCK_EXECUTIVE_FORECASTS: ExecutiveForecast[] = Array.from({ length: 150 }, (_, i) => {
  const predicted = 100 + (i % 80);
  return {
    forecastId: `efc-${String(i + 1).padStart(5, '0')}`,
    metric: ['Revenue', 'Volume', 'Occupancy', 'Workforce Cost', 'Quality Score'][i % 5]!,
    facilityId: FACILITIES[i % 25]!,
    horizon: FORECAST_HORIZONS[i % FORECAST_HORIZONS.length]!,
    predictedValue: predicted,
    confidenceInterval: { lower: predicted - 12, upper: predicted + 12 },
    trend: buildForecastTrend(predicted),
    generatedAt: daysAgo(i % 20),
  };
});

export const MOCK_STRATEGIC_INITIATIVES: StrategicInitiative[] = Array.from({ length: 50 }, (_, i) => {
  const status = (['planning', 'active', 'on_track', 'at_risk', 'completed'] as const)[i % 5]!;
  const budget = 500000 + (i % 20) * 100000;
  return {
    initiativeId: `init-${String(i + 1).padStart(4, '0')}`,
    name: ['Digital Transformation', 'Care Model Redesign', 'Revenue Cycle Optimization', 'Quality Improvement', 'Workforce Retention'][i % 5]!,
    facilityId: i % 3 === 0 ? undefined : FACILITIES[i % 25],
    ownerId: `user-${String((i % 15) + 1).padStart(3, '0')}`,
    status,
    progress: status === 'completed' ? 100 : 20 + (i % 70),
    targetDate: daysAgo(-(90 + (i % 180))),
    budget,
    spent: Math.round(budget * (0.2 + (i % 60) * 0.01)),
    description: 'Enterprise strategic initiative aligned with organizational goals.',
  };
});

export const MOCK_ENTERPRISE_ALERTS: EnterpriseAlert[] = Array.from({ length: 200 }, (_, i) => {
  const severity = (['info', 'warning', 'critical'] as const)[i % 3]!;
  return {
    alertId: `ealert-${String(i + 1).padStart(5, '0')}`,
    facilityId: FACILITIES[i % 25]!,
    category: ['capacity', 'quality', 'financial', 'workforce', 'clinical'][i % 5]!,
    severity,
    title: `${severity === 'critical' ? 'Critical' : 'Executive'} alert: ${['Bed capacity threshold', 'Quality metric deviation', 'Revenue variance', 'Staffing shortage', 'Patient flow bottleneck'][i % 5]}`,
    message: 'Aggregated from enterprise modules requiring executive attention.',
    sourceModule: ['quality', 'finance', 'workforce', 'ai', 'publicHealth'][i % 5]!,
    createdAt: daysAgo(i % 15),
    acknowledged: i % 5 === 0,
  };
});

export const MOCK_CAPACITY_SNAPSHOTS: CapacitySnapshot[] = Array.from({ length: 150 }, (_, i) => {
  const total = 20 + (i % 40);
  const occupied = Math.round(total * (0.7 + (i % 25) * 0.01));
  return {
    snapshotId: `cap-${String(i + 1).padStart(5, '0')}`,
    facilityId: FACILITIES[i % 25]!,
    unit: CAPACITY_UNITS[i % CAPACITY_UNITS.length]!,
    totalBeds: total,
    occupiedBeds: occupied,
    availableBeds: total - occupied,
    occupancyRate: Math.round((occupied / total) * 100),
    capturedAt: daysAgo(i % 7),
  };
});

export const MOCK_PERFORMANCE_REPORTS: PerformanceReport[] = Array.from({ length: 100 }, (_, i) => ({
  reportId: `perf-${String(i + 1).padStart(5, '0')}`,
  name: ['Monthly Operations', 'Quarterly Quality', 'Financial Summary', 'Workforce Report'][i % 4]!,
  facilityId: FACILITIES[i % 25]!,
  category: ['operations', 'quality', 'financial', 'workforce'][i % 4]!,
  score: 65 + (i % 30),
  period: ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Q1 2026'][i % 4]!,
  generatedAt: daysAgo(i % 60),
}));

export const MOCK_EXEC_AUDIT: import('@/services/executive/types').ExecutiveAuditLog[] = Array.from({ length: 80 }, (_, i) => ({
  auditId: `exaudit-${String(i + 1).padStart(4, '0')}`,
  action: ['view_dashboard', 'export_report', 'acknowledge_alert', 'update_kpi', 'create_initiative'][i % 5]!,
  actorId: `user-${String((i % 30) + 1).padStart(3, '0')}`,
  resourceType: ['dashboard', 'kpi', 'alert', 'initiative', 'report'][i % 5]!,
  resourceId: `res-${String(i + 1).padStart(4, '0')}`,
  timestamp: daysAgo(i % 60),
  facilityId: FACILITIES[i % 25],
  outcome: i % 20 === 0 ? 'failure' as const : 'success' as const,
}));

export function buildExecutiveCommandCenter(facilityId?: string): ExecutiveCommandCenter {
  const kpis = facilityId ? MOCK_ENTERPRISE_KPIS.filter((k) => k.facilityId === facilityId) : MOCK_ENTERPRISE_KPIS;
  const alerts = facilityId ? MOCK_ENTERPRISE_ALERTS.filter((a) => a.facilityId === facilityId) : MOCK_ENTERPRISE_ALERTS;
  const capacity = facilityId ? MOCK_CAPACITY_SNAPSHOTS.filter((c) => c.facilityId === facilityId) : MOCK_CAPACITY_SNAPSHOTS;
  const initiatives = facilityId ? MOCK_STRATEGIC_INITIATIVES.filter((i) => !i.facilityId || i.facilityId === facilityId) : MOCK_STRATEGIC_INITIATIVES;
  const financial = kpis.filter((k) => k.category === 'financial');
  const quality = kpis.filter((k) => k.category === 'quality');

  const totalBeds = capacity.reduce((s, c) => s + c.totalBeds, 0);
  const occupied = capacity.reduce((s, c) => s + c.occupiedBeds, 0);

  return {
    totalKpis: kpis.length * SCALE.kpis,
    activeAlerts: alerts.filter((a) => !a.acknowledged).length * SCALE.alerts,
    bedOccupancy: totalBeds > 0 ? Math.round((occupied / totalBeds) * 100) : 85,
    revenueMtd: (financial[0]?.value ?? 12.5) * 1000000,
    qualityScore: quality[0]?.value ?? 82,
    initiativesOnTrack: initiatives.filter((i) => i.status === 'on_track' || i.status === 'active').length * 10,
    kpiTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, i) => ({
      label,
      value: Math.round(kpis.length / 6 + i * (kpis.length / 15)) * SCALE.kpis,
    })),
    alertDistribution: ['clinical', 'operational', 'financial', 'quality', 'workforce'].map((label) => ({
      label,
      value: alerts.filter((a) => a.category === label || a.sourceModule === label).length * SCALE.alerts,
    })),
    recentAlerts: [...alerts].filter((a) => !a.acknowledged).slice(0, 5),
    topKpis: [...kpis].sort((a, b) => b.changePercent - a.changePercent).slice(0, 6),
  };
}
