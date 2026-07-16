import type { IamAnalytics } from '@/services/iam/types';
import { consentComplianceRate } from '@/services/iam/consent-engine';
import { sessionDurationMinutes } from '@/services/iam/session-engine';
import {
  MOCK_CONSENTS,
  MOCK_IAM_AUDIT,
  MOCK_IAM_POLICIES,
  MOCK_IAM_SESSIONS,
  MOCK_IAM_USERS,
  MOCK_LOGIN_HISTORY,
  MOCK_RISK_SCORES,
  MOCK_BREAK_GLASS,
  buildIamDashboard,
} from '@/services/iam/mock-data';

export function computeIamAnalytics(tenantId?: string): IamAnalytics {
  const dashboard = buildIamDashboard(tenantId);
  const users = tenantId ? MOCK_IAM_USERS.filter((u) => u.tenantId === tenantId) : MOCK_IAM_USERS;
  const sessions = tenantId
    ? MOCK_IAM_SESSIONS.filter((s) => MOCK_IAM_USERS.find((u) => u.userId === s.userId)?.tenantId === tenantId)
    : MOCK_IAM_SESSIONS;
  const logins = MOCK_LOGIN_HISTORY;
  const audit = tenantId ? MOCK_IAM_AUDIT.filter((a) => a.tenantId === tenantId) : MOCK_IAM_AUDIT;

  const avgDuration = sessions.length > 0
    ? sessions.reduce((s, sess) => s + sessionDurationMinutes(sess), 0) / sessions.length
    : 0;

  return {
    authenticationSuccessRate: Math.round((logins.filter((l) => l.success).length / Math.max(logins.length, 1)) * 100),
    mfaEnrollmentRate: dashboard.mfaAdoptionRate,
    averageSessionDuration: Math.round(avgDuration),
    policyDenialRate: Math.round((MOCK_IAM_POLICIES.filter((p) => p.effect === 'deny').length / MOCK_IAM_POLICIES.length) * 100),
    breakGlassUsage: MOCK_BREAK_GLASS.filter((e) => e.status === 'active' || e.status === 'ended').length * 10,
    consentComplianceRate: consentComplianceRate(MOCK_CONSENTS),
    riskScoreAverage: Math.round((MOCK_RISK_SCORES.reduce((s, r) => s + r.score, 0) / MOCK_RISK_SCORES.length) * 100),
    authTrend: dashboard.loginTrend,
    accessByModule: [
      { label: 'Clinical', value: users.length * 80 },
      { label: 'Operations', value: users.length * 60 },
      { label: 'Intelligence', value: users.length * 40 },
      { label: 'IAM', value: audit.length * 10 },
      { label: 'Platform', value: users.length * 30 },
    ],
    incidentTrend: ['W1', 'W2', 'W3', 'W4'].map((label, i) => ({
      label,
      value: dashboard.openIncidents / 4 + i * 5,
    })),
  };
}

export { buildIamDashboard };
