import type { ResearchAnalytics } from '@/services/research/types';
import {
  buildResearchDashboard,
  MOCK_ADVERSE_EVENTS,
  MOCK_DEVIATIONS,
  MOCK_PARTICIPANTS,
  MOCK_PUBLICATIONS,
  MOCK_TRIALS,
  MOCK_VISITS,
} from '@/services/research/mock-data';
import { computeComplianceRate } from '@/services/research/protocol';

export function computeResearchAnalytics(
  facilityId?: string,
): ResearchAnalytics {
  const dashboard = buildResearchDashboard(facilityId);
  const trials = facilityId
    ? MOCK_TRIALS.filter((t) => t.facilityId === facilityId)
    : MOCK_TRIALS;
  const participants = facilityId
    ? MOCK_PARTICIPANTS.filter((p) => p.facilityId === facilityId)
    : MOCK_PARTICIPANTS;
  const visits = facilityId
    ? MOCK_VISITS.filter((v) => v.facilityId === facilityId)
    : MOCK_VISITS;
  const deviations = facilityId
    ? MOCK_DEVIATIONS.filter((d) => d.facilityId === facilityId)
    : MOCK_DEVIATIONS;
  const aes = facilityId
    ? MOCK_ADVERSE_EVENTS.filter((e) => e.facilityId === facilityId)
    : MOCK_ADVERSE_EVENTS;
  const signedConsents = participants.filter(
    (p) => p.consentStatus === 'signed',
  ).length;

  return {
    enrollmentRate: Math.round(
      (participants.filter(
        (p) => p.status === 'enrolled' || p.status === 'active',
      ).length /
        Math.max(participants.length, 1)) *
        100,
    ),
    protocolCompliance: computeComplianceRate(visits.length, deviations.length),
    consentCompletionRate: Math.round(
      (signedConsents / Math.max(participants.length, 1)) * 100,
    ),
    saeRate:
      Math.round(
        (aes.filter((e) => e.serious).length /
          Math.max(participants.length, 1)) *
          1000,
      ) / 10,
    activeTrials: dashboard.activeTrials,
    totalPublications:
      MOCK_PUBLICATIONS.filter((p) => p.status === 'published').length * 25,
    enrollmentTrend: dashboard.enrollmentTrend,
    phaseDistribution: [
      'Phase I',
      'Phase II',
      'Phase III',
      'Phase IV',
      'Observational',
    ].map((label) => ({
      label,
      value:
        trials.filter((t) => {
          const map = {
            I: 'Phase I',
            II: 'Phase II',
            III: 'Phase III',
            IV: 'Phase IV',
            observational: 'Observational',
          };
          return map[t.phase] === label;
        }).length * 5,
    })),
    topTrials: dashboard.topTrials.map((t) => ({
      label: t.title.slice(0, 28),
      value: t.currentEnrollment * 50,
    })),
    adverseEventTrend: ['W1', 'W2', 'W3', 'W4'].map((label, i) => ({
      label,
      value: Math.round(aes.length / 4 + i * 12),
    })),
  };
}

export { buildResearchDashboard };
