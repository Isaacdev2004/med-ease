import type { QualityAnalytics } from '@/services/quality/types';
import { capaCompletionRate } from '@/services/quality/capa-engine';
import { averageAuditScore } from '@/services/quality/audit-engine';
import { accreditationReadiness } from '@/services/quality/accreditation';
import { infectionRatePer1000 } from '@/services/quality/infection-control';
import { policyComplianceRate } from '@/services/quality/document-control';
import { summarizeIndicators } from '@/services/quality/quality-indicators';
import {
  buildQualityDashboard,
  MOCK_ACCREDITATION,
  MOCK_AUDITS,
  MOCK_CAPA,
  MOCK_INCIDENTS,
  MOCK_INFECTIONS,
  MOCK_POLICIES,
  MOCK_QUALITY_INDICATORS,
  MOCK_RISKS,
} from '@/services/quality/mock-data';

export function computeQualityAnalytics(facilityId?: string): QualityAnalytics {
  const dashboard = buildQualityDashboard(facilityId);
  const incidents = facilityId
    ? MOCK_INCIDENTS.filter((i) => i.facilityId === facilityId)
    : MOCK_INCIDENTS;
  const risks = facilityId
    ? MOCK_RISKS.filter((r) => r.facilityId === facilityId)
    : MOCK_RISKS;
  const capa = facilityId
    ? MOCK_CAPA.filter((c) => c.facilityId === facilityId)
    : MOCK_CAPA;
  const audits = facilityId
    ? MOCK_AUDITS.filter((a) => a.facilityId === facilityId)
    : MOCK_AUDITS;
  const infections = facilityId
    ? MOCK_INFECTIONS.filter((i) => i.facilityId === facilityId)
    : MOCK_INFECTIONS;
  const policies = facilityId
    ? MOCK_POLICIES.filter((p) => !p.facilityId || p.facilityId === facilityId)
    : MOCK_POLICIES;
  const indicators = facilityId
    ? MOCK_QUALITY_INDICATORS.filter((i) => i.facilityId === facilityId)
    : MOCK_QUALITY_INDICATORS;

  return {
    incidents: dashboard.openIncidents,
    risks: dashboard.openRisks,
    capaCompletion: capaCompletionRate(capa.slice(0, 500)),
    auditScores: averageAuditScore(audits.slice(0, 200)),
    infectionRate: infectionRatePer1000(infections),
    accreditationReadiness: accreditationReadiness(MOCK_ACCREDITATION),
    compliancePercent: dashboard.compliancePercent,
    policyCompliance: policyComplianceRate(policies.slice(0, 200)),
    openFindings: dashboard.openFindings,
    incidentTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(
      (label, i) => ({
        label,
        value: Math.round(incidents.length / 600 + i * 8),
      }),
    ),
    riskByCategory: [
      'clinical',
      'operational',
      'financial',
      'it',
      'cybersecurity',
      'regulatory',
    ].map((label) => ({
      label,
      value: risks.filter((r) => r.category === label).length,
    })),
    capaTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, i) => ({
      label,
      value: Math.round(
        capa.filter((c) => c.status === 'closed').length / 6 + i * 5,
      ),
    })),
    departmentRisk: risks
      .slice(0, 8)
      .map((r) => ({ label: r.departmentId ?? 'General', value: r.riskScore })),
    indicatorSummary: summarizeIndicators(indicators),
  };
}
