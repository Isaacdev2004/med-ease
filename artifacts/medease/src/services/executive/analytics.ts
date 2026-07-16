import type { ExecutiveAnalytics } from '@/services/executive/types';
import { averagePercentile } from '@/services/executive/benchmarking';
import { forecastAccuracy } from '@/services/executive/forecasting';
import { achievementRate } from '@/services/executive/kpi-engine';
import { operationalEfficiency } from '@/services/executive/operational-intelligence';
import {
  MOCK_BENCHMARK_REPORTS,
  MOCK_ENTERPRISE_KPIS,
  MOCK_EXECUTIVE_FORECASTS,
  MOCK_OPERATIONAL_METRICS,
  MOCK_STRATEGIC_INITIATIVES,
  buildExecutiveCommandCenter,
} from '@/services/executive/mock-data';

export function computeExecutiveAnalytics(facilityId?: string): ExecutiveAnalytics {
  const dashboard = buildExecutiveCommandCenter(facilityId);
  const kpis = facilityId ? MOCK_ENTERPRISE_KPIS.filter((k) => k.facilityId === facilityId) : MOCK_ENTERPRISE_KPIS;
  const metrics = facilityId ? MOCK_OPERATIONAL_METRICS.filter((m) => m.facilityId === facilityId) : MOCK_OPERATIONAL_METRICS;
  const benchmarks = facilityId ? MOCK_BENCHMARK_REPORTS.filter((b) => b.facilityId === facilityId) : MOCK_BENCHMARK_REPORTS;
  const forecasts = facilityId ? MOCK_EXECUTIVE_FORECASTS.filter((f) => f.facilityId === facilityId) : MOCK_EXECUTIVE_FORECASTS;
  const initiatives = facilityId ? MOCK_STRATEGIC_INITIATIVES.filter((i) => !i.facilityId || i.facilityId === facilityId) : MOCK_STRATEGIC_INITIATIVES;

  return {
    kpiAchievementRate: achievementRate(kpis),
    operationalEfficiency: operationalEfficiency(metrics),
    financialPerformance: Math.round(kpis.filter((k) => k.category === 'financial').reduce((s, k) => s + (k.value / Math.max(k.target, 1)), 0) / Math.max(kpis.filter((k) => k.category === 'financial').length, 1) * 100),
    qualityIndex: Math.round(kpis.filter((k) => k.category === 'quality').reduce((s, k) => s + k.value, 0) / Math.max(kpis.filter((k) => k.category === 'quality').length, 1)),
    workforceUtilization: Math.round(100 - (kpis.find((k) => k.name.includes('Vacancy'))?.value ?? 8)),
    populationHealthIndex: Math.round(kpis.filter((k) => k.category === 'population').reduce((s, k) => s + k.value, 0) / Math.max(kpis.filter((k) => k.category === 'population').length, 1)),
    benchmarkPercentile: averagePercentile(benchmarks),
    kpiTrend: dashboard.kpiTrend,
    moduleContributions: [
      { label: 'Clinical', value: metrics.length * 80 },
      { label: 'Operations', value: metrics.length * 60 },
      { label: 'Finance', value: kpis.filter((k) => k.category === 'financial').length * 100 },
      { label: 'Quality', value: kpis.filter((k) => k.category === 'quality').length * 90 },
      { label: 'Workforce', value: kpis.filter((k) => k.category === 'workforce').length * 70 },
      { label: 'Population Health', value: kpis.filter((k) => k.category === 'population').length * 85 },
      { label: 'AI Intelligence', value: Math.round(metrics.length * 0.3) * 100 },
    ],
    forecastAccuracy: forecastAccuracy(forecasts),
    initiativeProgress: initiatives.slice(0, 5).map((i) => ({ label: i.name.slice(0, 12), value: i.progress })),
  };
}

export { buildExecutiveCommandCenter };
