import type { PopulationAnalytics } from '@/services/population-health/types';
import { aggregateRiskDistribution } from '@/services/population-health/risk-engine';
import {
  buildPhmDashboard,
  MOCK_CARE_GAPS,
  MOCK_CHRONIC_PROGRAMS,
  MOCK_POPULATION,
  MOCK_REGIONS,
  MOCK_REGISTRIES,
  MOCK_RISK_SCORES,
} from '@/services/population-health/mock-data';

export function computePopulationAnalytics(
  facilityId?: string,
): PopulationAnalytics {
  const dashboard = buildPhmDashboard(facilityId);
  const gaps = facilityId
    ? MOCK_CARE_GAPS.filter((g) => g.facilityId === facilityId)
    : MOCK_CARE_GAPS;
  const population = facilityId
    ? MOCK_POPULATION.filter((p) => p.facilityId === facilityId)
    : MOCK_POPULATION;
  const scores = facilityId
    ? MOCK_RISK_SCORES.filter((s) => s.facilityId === facilityId)
    : MOCK_RISK_SCORES;
  const registries = facilityId
    ? MOCK_REGISTRIES.filter((r) => r.facilityId === facilityId)
    : MOCK_REGISTRIES;
  const regions = MOCK_REGIONS;

  return {
    careGaps: Math.round(dashboard.openCareGaps),
    diseasePrevalence: registries.length
      ? Math.round(
          (registries.reduce((s, r) => s + r.memberCount, 0) /
            Math.max(population.length, 1)) *
            100,
        ) / 10
      : 24.5,
    admissions: Math.round(population.length * 0.12),
    readmissions: Math.round(population.length * 0.04),
    mortalityRate: 2.1,
    utilizationRate: 68,
    preventiveCompliance: dashboard.preventiveCompliance,
    gapTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, i) => ({
      label,
      value: Math.round(gaps.length / 2000 + i * 120),
    })),
    prevalenceByCondition: [
      'Diabetes',
      'Hypertension',
      'CHF',
      'COPD',
      'Asthma',
    ].map((label, i) => ({
      label,
      value:
        MOCK_CHRONIC_PROGRAMS.filter(
          (p) => p.type.includes(label.toLowerCase().split(' ')[0]!) || i === 0,
        ).reduce((s, p) => s + p.enrolledCount, 0) / 10 || 500 + i * 200,
    })),
    riskDistribution: aggregateRiskDistribution(scores.slice(0, 500)),
    geographicTrend: regions
      .slice(0, 8)
      .map((r) => ({ label: r.zipCode, value: r.prevalenceRate })),
    providerPerformance: [
      'Dr. Chen',
      'Dr. Martin',
      'Dr. Dupont',
      'Dr. Bernard',
    ].map((label, i) => ({ label, value: 75 + i * 5 })),
  };
}
