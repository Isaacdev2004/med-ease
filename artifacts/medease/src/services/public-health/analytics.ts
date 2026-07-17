import type { PublicHealthAnalytics } from '@/services/public-health/types';
import { contactCompletionRate } from '@/services/public-health/contact-tracing';
import { interventionRate } from '@/services/public-health/sdoh';
import { REPORTABLE_DISEASES } from '@/services/public-health/surveillance';
import {
  buildPublicHealthDashboard,
  MOCK_COMMUNITY_PROGRAMS,
  MOCK_CONTACT_TRACING,
  MOCK_DISEASE_CASES,
  MOCK_IMMUNIZATIONS,
  MOCK_SDOH,
} from '@/services/public-health/mock-data';

export function computePublicHealthAnalytics(
  facilityId?: string,
): PublicHealthAnalytics {
  const dashboard = buildPublicHealthDashboard(facilityId);
  const cases = facilityId
    ? MOCK_DISEASE_CASES.filter((c) => c.facilityId === facilityId)
    : MOCK_DISEASE_CASES;
  const immunizations = facilityId
    ? MOCK_IMMUNIZATIONS.filter((i) => i.facilityId === facilityId)
    : MOCK_IMMUNIZATIONS;
  const contacts = facilityId
    ? MOCK_CONTACT_TRACING.filter((c) => c.facilityId === facilityId)
    : MOCK_CONTACT_TRACING;
  const programs = facilityId
    ? MOCK_COMMUNITY_PROGRAMS.filter((p) => p.facilityId === facilityId)
    : MOCK_COMMUNITY_PROGRAMS;
  const sdoh = facilityId
    ? MOCK_SDOH.filter((s) => s.facilityId === facilityId)
    : MOCK_SDOH;

  const administered = immunizations.filter(
    (i) => i.status === 'administered',
  ).length;

  return {
    incidenceRate:
      Math.round(
        (cases.filter((c) => c.status === 'confirmed').length /
          Math.max(cases.length, 1)) *
          1000,
      ) / 10,
    immunizationCoverage: Math.round(
      (administered / Math.max(immunizations.length, 1)) * 100,
    ),
    outbreakResponseTime: 4.2,
    contactTracingCompletion: contactCompletionRate(contacts),
    sdohInterventionRate: interventionRate(sdoh),
    activePrograms: programs.filter((p) => p.status === 'active').length * 10,
    caseTrend: dashboard.caseTrend,
    diseaseDistribution: REPORTABLE_DISEASES.slice(0, 6).map((d) => ({
      label: d,
      value: cases.filter((c) => c.disease === d).length * 100,
    })),
    immunizationTrend: ['Q1', 'Q2', 'Q3', 'Q4'].map((label, i) => ({
      label,
      value: Math.round(administered / 4 + i * 50),
    })),
    regionalHeatmap: ['North', 'South', 'East', 'West', 'Central'].map(
      (label, i) => ({
        label,
        value: Math.round(cases.length / 5 + i * 20),
      }),
    ),
  };
}

export { buildPublicHealthDashboard };
