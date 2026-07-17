import { activeBreakGlassCount } from '@/services/iam/break-glass';
import { activeSessionCount } from '@/services/iam/session-engine';
import { computeRiskScore, riskLevel } from '@/services/iam/risk-engine';
import type {
  ApiKey,
  BreakGlassEvent,
  ConsentRecord,
  DelegationRecord,
  IamAuditEvent,
  IamDashboard,
  IamOrganization,
  IamPermission,
  IamPolicy,
  IamRole,
  IamSession,
  IamTenant,
  IamUser,
  LoginAttempt,
  MfaDevice,
  OAuthClient,
  OidcProvider,
  ProxyAccess,
  RiskScore,
  SamlProvider,
  SecurityIncident,
  TrustedDevice,
} from '@/services/iam/types';

const SCALE = {
  users: 30,
  sessions: 250,
  logins: 800,
  audit: 5000,
  consents: 250,
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_TENANTS: IamTenant[] = Array.from({ length: 15 }, (_, i) => ({
  tenantId: `tenant-${String(i + 1).padStart(3, '0')}`,
  name: `Health System ${i + 1}`,
  slug: `hs-${i + 1}`,
  status: i % 8 === 0 ? ('suspended' as const) : ('active' as const),
  organizationCount: 5 + (i % 20),
  userCount: 200 + (i % 50) * 10,
  createdAt: daysAgo(365 - i * 10),
}));

export const MOCK_ORGANIZATIONS: IamOrganization[] = Array.from(
  { length: 80 },
  (_, i) => ({
    organizationId: `org-${String(i + 1).padStart(4, '0')}`,
    tenantId: MOCK_TENANTS[i % 15]!.tenantId,
    name: [
      'Central Hospital',
      'North Clinic',
      'South Medical',
      'East Health',
      'West Care',
    ][i % 5]!,
    type: (['health_system', 'hospital', 'clinic', 'department'] as const)[
      i % 4
    ]!,
    parentId:
      i % 4 === 3
        ? `org-${String(Math.floor(i / 4) + 1).padStart(4, '0')}`
        : undefined,
    facilityCount: 1 + (i % 8),
  }),
);

export const MOCK_IAM_USERS: IamUser[] = Array.from(
  { length: 400 },
  (_, i) => ({
    userId: `user-${String(i + 1).padStart(5, '0')}`,
    email: `user${i + 1}@medease.health`,
    displayName: `User ${(i % 200) + 1}`,
    tenantId: MOCK_TENANTS[i % 15]!.tenantId,
    organizationId: MOCK_ORGANIZATIONS[i % 80]!.organizationId,
    facilityId:
      i % 3 === 0 ? `fac-${String((i % 25) + 1).padStart(3, '0')}` : undefined,
    status: (
      ['active', 'active', 'active', 'inactive', 'locked', 'pending'] as const
    )[i % 6]!,
    roles: [
      [
        'platform_admin',
        'physician',
        'facility_admin',
        'pharmacist',
        'patient',
      ][i % 5]!,
    ],
    mfaEnabled: i % 3 !== 0,
    lastLoginAt: i % 5 !== 0 ? daysAgo(i % 14) : undefined,
    createdAt: daysAgo(180 - (i % 120)),
  }),
);

export const MOCK_IAM_ROLES: IamRole[] = [
  'platform_admin',
  'facility_admin',
  'physician',
  'pharmacist',
  'nurse',
  'patient',
  'transport_dispatcher',
  'lab_tech',
  'radiologist',
  'billing_clerk',
  'research_coordinator',
].map((name, i) => ({
  roleId: `role-${String(i + 1).padStart(3, '0')}`,
  name,
  description: `${name.replace('_', ' ')} role`,
  permissionCount: 20 + i * 15,
  isSystem: i < 5,
}));

export const MOCK_IAM_PERMISSIONS: IamPermission[] = Array.from(
  { length: 120 },
  (_, i) => ({
    permissionId: `perm-${String(i + 1).padStart(4, '0')}`,
    name:
      [
        'iam.read',
        'iam.write',
        'patients.read',
        'medications.prescribe',
        'billing.read',
        'executive.analytics',
      ][i % 6]! + (i > 5 ? `.${i}` : ''),
    module: ['iam', 'clinical', 'operations', 'intelligence'][i % 4]!,
    description: `Permission for module access ${i + 1}`,
  }),
);

export const MOCK_IAM_POLICIES: IamPolicy[] = Array.from(
  { length: 80 },
  (_, i) => ({
    policyId: `pol-${String(i + 1).padStart(4, '0')}`,
    name: `Policy ${i + 1}`,
    description: `Access policy for ${['clinical', 'admin', 'finance', 'audit'][i % 4]}`,
    effect: i % 7 === 0 ? ('deny' as const) : ('allow' as const),
    resource: ['patients/*', 'iam/*', 'billing/*', '*'][i % 4]!,
    action: ['read', 'write', '*'][i % 3]!,
    conditions:
      i % 3 === 0
        ? ['business_hours']
        : i % 5 === 0
          ? ['tenant_match']
          : undefined,
    tenantId: i % 4 === 0 ? MOCK_TENANTS[i % 15]!.tenantId : undefined,
    enabled: i % 10 !== 0,
  }),
);

export const MOCK_IAM_SESSIONS: IamSession[] = Array.from(
  { length: 300 },
  (_, i) => {
    const user = MOCK_IAM_USERS[i % 400]!;
    const status = (['active', 'active', 'expired', 'revoked'] as const)[
      i % 4
    ]!;
    return {
      sessionId: `sess-${String(i + 1).padStart(5, '0')}`,
      userId: user.userId,
      deviceId:
        i % 2 === 0
          ? `dev-${String((i % 100) + 1).padStart(4, '0')}`
          : undefined,
      ipAddress: `192.168.${i % 255}.${(i % 200) + 1}`,
      userAgent: ['Chrome/120', 'Safari/17', 'Firefox/121', 'Edge/120'][i % 4]!,
      status,
      startedAt: daysAgo(i % 7),
      lastActivityAt: daysAgo(i % 3),
      expiresAt: daysAgo(-1),
    };
  },
);

export const MOCK_LOGIN_HISTORY: LoginAttempt[] = Array.from(
  { length: 500 },
  (_, i) => ({
    attemptId: `login-${String(i + 1).padStart(5, '0')}`,
    userId: i % 4 !== 0 ? MOCK_IAM_USERS[i % 400]!.userId : undefined,
    email: MOCK_IAM_USERS[i % 400]!.email,
    success: i % 8 !== 0,
    ipAddress: `10.0.${i % 255}.${(i % 200) + 1}`,
    reason: i % 8 === 0 ? 'invalid_password' : undefined,
    attemptedAt: daysAgo(i % 30),
  }),
);

export const MOCK_MFA_DEVICES: MfaDevice[] = Array.from(
  { length: 200 },
  (_, i) => ({
    deviceId: `mfa-${String(i + 1).padStart(5, '0')}`,
    userId: MOCK_IAM_USERS[i % 400]!.userId,
    method: (['totp', 'sms', 'email', 'hardware_key', 'push'] as const)[i % 5]!,
    label: ['Authenticator App', 'SMS Phone', 'Email', 'YubiKey', 'Push'][
      i % 5
    ]!,
    verified: i % 5 !== 0,
    registeredAt: daysAgo(60 - (i % 50)),
    lastUsedAt: i % 3 === 0 ? daysAgo(i % 7) : undefined,
  }),
);

export const MOCK_TRUSTED_DEVICES: TrustedDevice[] = Array.from(
  { length: 250 },
  (_, i) => ({
    deviceId: `tdev-${String(i + 1).padStart(5, '0')}`,
    userId: MOCK_IAM_USERS[i % 400]!.userId,
    name: ['MacBook Pro', 'Windows Laptop', 'iPhone', 'iPad', 'Android'][
      i % 5
    ]!,
    platform: ['macOS', 'Windows', 'iOS', 'iPadOS', 'Android'][i % 5]!,
    trustScore: 60 + (i % 35),
    registeredAt: daysAgo(90 - (i % 60)),
    lastSeenAt: daysAgo(i % 14),
  }),
);

export const MOCK_OAUTH_CLIENTS: OAuthClient[] = Array.from(
  { length: 60 },
  (_, i) => ({
    clientId: `client-${String(i + 1).padStart(4, '0')}`,
    name: [
      'Mobile App',
      'Partner Portal',
      'Analytics Integration',
      'Research API',
    ][i % 4]!,
    tenantId: MOCK_TENANTS[i % 15]!.tenantId,
    redirectUris: [`https://app${i + 1}.example.com/callback`],
    scopes: ['openid', 'profile', 'iam.read'],
    status: i % 12 === 0 ? ('revoked' as const) : ('active' as const),
    createdAt: daysAgo(120 - (i % 90)),
  }),
);

export const MOCK_API_KEYS: ApiKey[] = Array.from({ length: 150 }, (_, i) => ({
  keyId: `key-${String(i + 1).padStart(5, '0')}`,
  name: `API Key ${i + 1}`,
  tenantId: MOCK_TENANTS[i % 15]!.tenantId,
  prefix: `mk_${String(i).slice(0, 4)}`,
  scopes: ['read', 'write'].slice(0, 1 + (i % 2)),
  status:
    i % 15 === 0
      ? ('revoked' as const)
      : i % 20 === 0
        ? ('expired' as const)
        : ('active' as const),
  createdAt: daysAgo(90 - (i % 60)),
  expiresAt: i % 5 === 0 ? daysAgo(-30) : undefined,
  lastUsedAt: daysAgo(i % 10),
}));

export const MOCK_CONSENTS: ConsentRecord[] = Array.from(
  { length: 300 },
  (_, i) => {
    const status = (['active', 'active', 'revoked', 'expired'] as const)[
      i % 4
    ]!;
    return {
      consentId: `consent-${String(i + 1).padStart(5, '0')}`,
      patientId: `phr-${String((i % 3000) + 1).padStart(4, '0')}`,
      granteeId: MOCK_IAM_USERS[i % 400]!.userId,
      purpose: ['Treatment', 'Research', 'Billing', 'Care Coordination'][
        i % 4
      ]!,
      status,
      grantedAt: daysAgo(60 - (i % 50)),
      expiresAt: status === 'expired' ? daysAgo(5) : daysAgo(-90),
      revokedAt: status === 'revoked' ? daysAgo(i % 10) : undefined,
    };
  },
);

export const MOCK_DELEGATIONS: DelegationRecord[] = Array.from(
  { length: 80 },
  (_, i) => ({
    delegationId: `del-${String(i + 1).padStart(4, '0')}`,
    delegatorId: MOCK_IAM_USERS[i % 400]!.userId,
    delegateId: MOCK_IAM_USERS[(i + 50) % 400]!.userId,
    scope: ['clinical_read', 'scheduling', 'billing_approve'][i % 3]!,
    startsAt: daysAgo(30 - (i % 20)),
    endsAt: daysAgo(-(30 + (i % 60))),
    status: (['active', 'expired', 'revoked'] as const)[i % 3]!,
  }),
);

export const MOCK_PROXY_ACCESS: ProxyAccess[] = Array.from(
  { length: 100 },
  (_, i) => ({
    proxyId: `proxy-${String(i + 1).padStart(4, '0')}`,
    patientId: `phr-${String((i % 2000) + 1).padStart(4, '0')}`,
    proxyUserId: MOCK_IAM_USERS[(i + 100) % 400]!.userId,
    relationship: ['parent', 'guardian', 'spouse', 'caregiver'][i % 4]!,
    status: i % 8 === 0 ? ('revoked' as const) : ('active' as const),
    grantedAt: daysAgo(90 - (i % 60)),
  }),
);

export const MOCK_BREAK_GLASS: BreakGlassEvent[] = Array.from(
  { length: 50 },
  (_, i) => {
    const status = (['active', 'ended', 'reviewed'] as const)[i % 3]!;
    return {
      eventId: `bg-${String(i + 1).padStart(4, '0')}`,
      userId: MOCK_IAM_USERS[i % 400]!.userId,
      patientId:
        i % 2 === 0
          ? `phr-${String((i % 500) + 1).padStart(4, '0')}`
          : undefined,
      reason: 'Emergency clinical access required',
      status,
      startedAt: daysAgo(i % 14),
      endedAt: status !== 'active' ? daysAgo(i % 10) : undefined,
      reviewedBy: status === 'reviewed' ? 'user-00001' : undefined,
    };
  },
);

export const MOCK_SECURITY_INCIDENTS: SecurityIncident[] = Array.from(
  { length: 40 },
  (_, i) => {
    const status = (['open', 'investigating', 'resolved'] as const)[i % 3]!;
    return {
      incidentId: `inc-${String(i + 1).padStart(4, '0')}`,
      title: [
        'Failed login spike',
        'Suspicious API access',
        'MFA bypass attempt',
        'Policy violation',
      ][i % 4]!,
      severity: (['low', 'medium', 'high', 'critical'] as const)[i % 4]!,
      category: ['authentication', 'authorization', 'api', 'compliance'][
        i % 4
      ]!,
      status,
      detectedAt: daysAgo(i % 20),
      resolvedAt: status === 'resolved' ? daysAgo(i % 5) : undefined,
    };
  },
);

export const MOCK_IAM_AUDIT: IamAuditEvent[] = Array.from(
  { length: 500 },
  (_, i) => ({
    auditId: `iamaudit-${String(i + 1).padStart(5, '0')}`,
    action: [
      'login',
      'logout',
      'role_assign',
      'policy_update',
      'session_revoke',
      'break_glass',
    ][i % 6]!,
    actorId: MOCK_IAM_USERS[i % 400]!.userId,
    resourceType: ['user', 'session', 'role', 'policy', 'consent'][i % 5]!,
    resourceId: `res-${String(i + 1).padStart(4, '0')}`,
    outcome: i % 20 === 0 ? ('failure' as const) : ('success' as const),
    ipAddress: `10.0.0.${(i % 200) + 1}`,
    timestamp: daysAgo(i % 60),
    tenantId: MOCK_TENANTS[i % 15]!.tenantId,
  }),
);

export const MOCK_RISK_SCORES: RiskScore[] = Array.from(
  { length: 150 },
  (_, i) => {
    const score = computeRiskScore(
      ['new_device', 'unusual_location'].slice(0, i % 3),
      0.2 + (i % 5) * 0.1,
    );
    return {
      scoreId: `risk-${String(i + 1).padStart(4, '0')}`,
      userId: MOCK_IAM_USERS[i % 400]!.userId,
      score,
      factors: ['new_device', 'failed_logins', 'geo_anomaly'].slice(
        0,
        1 + (i % 3),
      ),
      level: riskLevel(score),
      assessedAt: daysAgo(i % 7),
    };
  },
);

export const MOCK_SAML_PROVIDERS: SamlProvider[] = Array.from(
  { length: 10 },
  (_, i) => ({
    providerId: `saml-${String(i + 1).padStart(3, '0')}`,
    name: `SAML IdP ${i + 1}`,
    entityId: `https://idp${i + 1}.example.com/metadata`,
    tenantId: MOCK_TENANTS[i % 15]!.tenantId,
    status: i % 5 === 0 ? ('inactive' as const) : ('active' as const),
  }),
);

export const MOCK_OIDC_PROVIDERS: OidcProvider[] = Array.from(
  { length: 10 },
  (_, i) => ({
    providerId: `oidc-${String(i + 1).padStart(3, '0')}`,
    name: `OIDC Provider ${i + 1}`,
    issuer: `https://auth${i + 1}.example.com`,
    tenantId: MOCK_TENANTS[i % 15]!.tenantId,
    status: i % 6 === 0 ? ('inactive' as const) : ('active' as const),
  }),
);

export function buildIamDashboard(tenantId?: string): IamDashboard {
  const users = tenantId
    ? MOCK_IAM_USERS.filter((u) => u.tenantId === tenantId)
    : MOCK_IAM_USERS;
  const sessions = tenantId
    ? MOCK_IAM_SESSIONS.filter(
        (s) =>
          MOCK_IAM_USERS.find((u) => u.userId === s.userId)?.tenantId ===
          tenantId,
      )
    : MOCK_IAM_SESSIONS;
  const logins = MOCK_LOGIN_HISTORY;
  const incidents = MOCK_SECURITY_INCIDENTS.filter(
    (i) => i.status !== 'resolved',
  );
  const audit = tenantId
    ? MOCK_IAM_AUDIT.filter((a) => a.tenantId === tenantId)
    : MOCK_IAM_AUDIT;

  return {
    totalUsers: users.length * SCALE.users,
    activeSessions: activeSessionCount(sessions) * SCALE.sessions,
    mfaAdoptionRate: Math.round(
      (users.filter((u) => u.mfaEnabled).length / Math.max(users.length, 1)) *
        100,
    ),
    failedLogins24h: logins.filter((l) => !l.success).length * 20,
    activePolicies: MOCK_IAM_POLICIES.filter((p) => p.enabled).length * 4,
    openIncidents: incidents.length * 12,
    breakGlassActive: activeBreakGlassCount(MOCK_BREAK_GLASS),
    sessionTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
      (label, i) => ({
        label,
        value: Math.round(sessions.length / 7 + i * 10) * SCALE.sessions,
      }),
    ),
    loginTrend: ['00h', '04h', '08h', '12h', '16h', '20h'].map((label, i) => ({
      label,
      value: Math.round(logins.length / 6 + i * 15) * 20,
    })),
    recentIncidents: incidents.slice(0, 5),
    recentAudit: audit.slice(0, 8),
  };
}
