import type { CdssAnalytics } from '@/services/cdss/types';
import { buildCdssDashboard, MOCK_ALERTS, MOCK_GUIDELINES, MOCK_RECOMMENDATIONS } from '@/services/cdss/mock-data';

export function computeCdssAnalytics(facilityId?: string): CdssAnalytics {
  const dashboard = buildCdssDashboard(facilityId);
  const alerts = facilityId ? MOCK_ALERTS.filter((a) => a.facilityId === facilityId) : MOCK_ALERTS;
  const recs = facilityId ? MOCK_RECOMMENDATIONS.filter((r) => r.facilityId === facilityId) : MOCK_RECOMMENDATIONS;
  const guidelines = facilityId ? MOCK_GUIDELINES.filter((g) => !g.facilityId || g.facilityId === facilityId) : MOCK_GUIDELINES;

  const byType = ['abnormal_lab', 'allergy', 'interaction', 'contraindication', 'preventive'].map((label) => ({
    label: label.replace(/_/g, ' '),
    value: alerts.filter((a) => a.type === label).length || Math.round(alerts.length / 10),
  }));

  return {
    alertVolume: dashboard.activeAlerts,
    acceptanceRate: Math.round((recs.filter((r) => r.status === 'accepted').length / Math.max(recs.length, 1)) * 100),
    overrideRate: Math.round((alerts.filter((a) => a.status === 'overridden').length / Math.max(alerts.length, 1)) * 100),
    guidelineCompliance: dashboard.guidelineCompliance,
    orderSetUsage: dashboard.orderSetsApplied,
    alertTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, i) => ({ label, value: Math.round(alerts.length / 8 + i * 40) })),
    alertsByType: byType,
    recommendationsByStatus: ['pending', 'accepted', 'declined', 'deferred'].map((label) => ({
      label,
      value: recs.filter((r) => r.status === label).length,
    })),
    topGuidelines: guidelines.slice(0, 6).map((g) => ({ label: g.title.slice(0, 30), value: g.complianceRate })),
  };
}

export { buildCdssDashboard };
