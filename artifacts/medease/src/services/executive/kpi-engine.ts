import type { EnterpriseKpi, KpiCategory, KpiTrend } from '@/services/executive/types';

export const KPI_CATEGORIES: KpiCategory[] = ['clinical', 'operational', 'financial', 'quality', 'workforce', 'population', 'strategic'];

export const KPI_NAMES: Record<KpiCategory, string[]> = {
  clinical: ['Patient Satisfaction', 'Readmission Rate', 'Length of Stay', 'Mortality Index'],
  operational: ['ED Wait Time', 'OR Utilization', 'Bed Turnover', 'Throughput Index'],
  financial: ['Net Revenue', 'Collection Rate', 'Denial Rate', 'Operating Margin'],
  quality: ['HCAHPS Score', 'Infection Rate', 'Compliance Rate', 'Safety Index'],
  workforce: ['Staffing Ratio', 'Vacancy Rate', 'Overtime Hours', 'Turnover Rate'],
  population: ['Risk Score', 'Gap Closure', 'Preventive Care', 'Chronic Disease Rate'],
  strategic: ['Initiative Progress', 'Budget Utilization', 'Milestone Completion', 'ROI Index'],
};

export function computeTrend(current: number, target: number): KpiTrend {
  const ratio = current / Math.max(target, 1);
  if (ratio >= 1.02) return 'up';
  if (ratio <= 0.98) return 'down';
  return 'stable';
}

export function achievementRate(kpis: EnterpriseKpi[]): number {
  if (kpis.length === 0) return 0;
  const achieved = kpis.filter((k) => k.value >= k.target).length;
  return Math.round((achieved / kpis.length) * 100);
}

export function kpiChangePercent(value: number, seed: number): number {
  return Math.round(((seed % 20) - 10) * 10) / 10;
}
