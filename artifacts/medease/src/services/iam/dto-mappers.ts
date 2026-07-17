import type {
  ApiKey,
  BreakGlassEvent,
  ConsentRecord,
  DelegationRecord,
  IamAnalytics,
  IamAuditEvent,
  IamDashboard,
  IamFavorite,
  IamFilters,
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
  PaginatedResult,
  ProxyAccess,
  RiskScore,
  SamlProvider,
  SecurityIncident,
  TrustedDevice,
} from '@/services/iam/types';

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

export function mapUserDto(dto: unknown): IamUser {
  const raw = asRecord(dto);
  return {
    userId: asString(raw.userId),
    email: asString(raw.email),
    displayName: asString(raw.displayName),
    tenantId: asString(raw.tenantId),
    organizationId: asString(raw.organizationId),
    facilityId: typeof raw.facilityId === 'string' ? raw.facilityId : undefined,
    status: asString(raw.status, 'pending') as IamUser['status'],
    roles: asStringArray(raw.roles),
    mfaEnabled: asBoolean(raw.mfaEnabled),
    lastLoginAt:
      typeof raw.lastLoginAt === 'string' ? raw.lastLoginAt : undefined,
    createdAt: asString(raw.createdAt),
  };
}

export function mapTenantDto(dto: unknown): IamTenant {
  const raw = asRecord(dto);
  return {
    tenantId: asString(raw.tenantId),
    name: asString(raw.name),
    slug: asString(raw.slug),
    status: asString(raw.status, 'active') as IamTenant['status'],
    organizationCount: asNumber(raw.organizationCount),
    userCount: asNumber(raw.userCount),
    createdAt: asString(raw.createdAt),
  };
}

export function mapOrganizationDto(dto: unknown): IamOrganization {
  const raw = asRecord(dto);
  return {
    organizationId: asString(raw.organizationId),
    tenantId: asString(raw.tenantId),
    name: asString(raw.name),
    type: asString(raw.type, 'department') as IamOrganization['type'],
    parentId: typeof raw.parentId === 'string' ? raw.parentId : undefined,
    facilityCount: asNumber(raw.facilityCount),
  };
}

export function mapRoleDto(dto: unknown): IamRole {
  const raw = asRecord(dto);
  return {
    roleId: asString(raw.roleId),
    name: asString(raw.name),
    description: asString(raw.description),
    tenantId: typeof raw.tenantId === 'string' ? raw.tenantId : undefined,
    permissionCount: asNumber(raw.permissionCount),
    isSystem: asBoolean(raw.isSystem),
  };
}

export function mapPermissionDto(dto: unknown): IamPermission {
  const raw = asRecord(dto);
  return {
    permissionId: asString(raw.permissionId),
    name: asString(raw.name),
    module: asString(raw.module),
    description: asString(raw.description),
  };
}

export function mapPolicyDto(dto: unknown): IamPolicy {
  const raw = asRecord(dto);
  return {
    policyId: asString(raw.policyId),
    name: asString(raw.name),
    description: asString(raw.description),
    effect: asString(raw.effect, 'allow') as IamPolicy['effect'],
    resource: asString(raw.resource),
    action: asString(raw.action),
    conditions: Array.isArray(raw.conditions)
      ? raw.conditions.filter(
          (item): item is string => typeof item === 'string',
        )
      : undefined,
    tenantId: typeof raw.tenantId === 'string' ? raw.tenantId : undefined,
    enabled: asBoolean(raw.enabled, true),
  };
}

export function mapSessionDto(dto: unknown): IamSession {
  const raw = asRecord(dto);
  return {
    sessionId: asString(raw.sessionId),
    userId: asString(raw.userId),
    deviceId: typeof raw.deviceId === 'string' ? raw.deviceId : undefined,
    ipAddress: asString(raw.ipAddress),
    userAgent: asString(raw.userAgent),
    status: asString(raw.status, 'active') as IamSession['status'],
    startedAt: asString(raw.startedAt),
    lastActivityAt: asString(raw.lastActivityAt),
    expiresAt: asString(raw.expiresAt),
  };
}

export function mapLoginAttemptDto(dto: unknown): LoginAttempt {
  const raw = asRecord(dto);
  return {
    attemptId: asString(raw.attemptId),
    userId: typeof raw.userId === 'string' ? raw.userId : undefined,
    email: asString(raw.email),
    success: asBoolean(raw.success),
    ipAddress: asString(raw.ipAddress),
    reason: typeof raw.reason === 'string' ? raw.reason : undefined,
    attemptedAt: asString(raw.attemptedAt),
  };
}

export function mapMfaDeviceDto(dto: unknown): MfaDevice {
  const raw = asRecord(dto);
  return {
    deviceId: asString(raw.deviceId),
    userId: asString(raw.userId),
    method: asString(raw.method, 'totp') as MfaDevice['method'],
    label: asString(raw.label),
    verified: asBoolean(raw.verified),
    registeredAt: asString(raw.registeredAt),
    lastUsedAt: typeof raw.lastUsedAt === 'string' ? raw.lastUsedAt : undefined,
  };
}

export function mapTrustedDeviceDto(dto: unknown): TrustedDevice {
  const raw = asRecord(dto);
  return {
    deviceId: asString(raw.deviceId),
    userId: asString(raw.userId),
    name: asString(raw.name),
    platform: asString(raw.platform),
    trustScore: asNumber(raw.trustScore),
    registeredAt: asString(raw.registeredAt),
    lastSeenAt: asString(raw.lastSeenAt),
  };
}

export function mapOAuthClientDto(dto: unknown): OAuthClient {
  const raw = asRecord(dto);
  return {
    clientId: asString(raw.clientId),
    name: asString(raw.name),
    tenantId: asString(raw.tenantId),
    redirectUris: asStringArray(raw.redirectUris),
    scopes: asStringArray(raw.scopes),
    status: asString(raw.status, 'active') as OAuthClient['status'],
    createdAt: asString(raw.createdAt),
  };
}

export function mapApiKeyDto(dto: unknown): ApiKey {
  const raw = asRecord(dto);
  return {
    keyId: asString(raw.keyId),
    name: asString(raw.name),
    tenantId: asString(raw.tenantId),
    prefix: asString(raw.prefix),
    scopes: asStringArray(raw.scopes),
    status: asString(raw.status, 'active') as ApiKey['status'],
    createdAt: asString(raw.createdAt),
    expiresAt: typeof raw.expiresAt === 'string' ? raw.expiresAt : undefined,
    lastUsedAt: typeof raw.lastUsedAt === 'string' ? raw.lastUsedAt : undefined,
  };
}

export function mapConsentDto(dto: unknown): ConsentRecord {
  const raw = asRecord(dto);
  return {
    consentId: asString(raw.consentId),
    patientId: asString(raw.patientId),
    granteeId: asString(raw.granteeId),
    purpose: asString(raw.purpose),
    status: asString(raw.status, 'active') as ConsentRecord['status'],
    grantedAt: asString(raw.grantedAt),
    expiresAt: typeof raw.expiresAt === 'string' ? raw.expiresAt : undefined,
    revokedAt: typeof raw.revokedAt === 'string' ? raw.revokedAt : undefined,
  };
}

export function mapDelegationDto(dto: unknown): DelegationRecord {
  const raw = asRecord(dto);
  return {
    delegationId: asString(raw.delegationId),
    delegatorId: asString(raw.delegatorId),
    delegateId: asString(raw.delegateId),
    scope: asString(raw.scope),
    startsAt: asString(raw.startsAt),
    endsAt: asString(raw.endsAt),
    status: asString(raw.status, 'active') as DelegationRecord['status'],
  };
}

export function mapProxyAccessDto(dto: unknown): ProxyAccess {
  const raw = asRecord(dto);
  return {
    proxyId: asString(raw.proxyId),
    patientId: asString(raw.patientId),
    proxyUserId: asString(raw.proxyUserId),
    relationship: asString(raw.relationship),
    status: asString(raw.status, 'active') as ProxyAccess['status'],
    grantedAt: asString(raw.grantedAt),
  };
}

export function mapBreakGlassDto(dto: unknown): BreakGlassEvent {
  const raw = asRecord(dto);
  return {
    eventId: asString(raw.eventId),
    userId: asString(raw.userId),
    patientId: typeof raw.patientId === 'string' ? raw.patientId : undefined,
    reason: asString(raw.reason),
    status: asString(raw.status, 'active') as BreakGlassEvent['status'],
    startedAt: asString(raw.startedAt),
    endedAt: typeof raw.endedAt === 'string' ? raw.endedAt : undefined,
    reviewedBy: typeof raw.reviewedBy === 'string' ? raw.reviewedBy : undefined,
  };
}

export function mapAuditDto(dto: unknown): IamAuditEvent {
  const raw = asRecord(dto);
  return {
    auditId: asString(raw.auditId),
    action: asString(raw.action),
    actorId: asString(raw.actorId),
    resourceType: asString(raw.resourceType),
    resourceId: asString(raw.resourceId),
    outcome: asString(raw.outcome, 'success') as IamAuditEvent['outcome'],
    ipAddress: typeof raw.ipAddress === 'string' ? raw.ipAddress : undefined,
    timestamp: asString(raw.timestamp),
    tenantId: typeof raw.tenantId === 'string' ? raw.tenantId : undefined,
  };
}

export function mapSecurityIncidentDto(dto: unknown): SecurityIncident {
  const raw = asRecord(dto);
  return {
    incidentId: asString(raw.incidentId),
    title: asString(raw.title),
    severity: asString(raw.severity, 'low') as SecurityIncident['severity'],
    category: asString(raw.category),
    status: asString(raw.status, 'open') as SecurityIncident['status'],
    detectedAt: asString(raw.detectedAt),
    resolvedAt: typeof raw.resolvedAt === 'string' ? raw.resolvedAt : undefined,
  };
}

export function mapRiskScoreDto(dto: unknown): RiskScore {
  const raw = asRecord(dto);
  return {
    scoreId: asString(raw.scoreId),
    userId: asString(raw.userId),
    score: asNumber(raw.score),
    factors: asStringArray(raw.factors),
    level: asString(raw.level, 'low') as RiskScore['level'],
    assessedAt: asString(raw.assessedAt),
  };
}

export function mapSamlProviderDto(dto: unknown): SamlProvider {
  const raw = asRecord(dto);
  return {
    providerId: asString(raw.providerId),
    name: asString(raw.name),
    entityId: asString(raw.entityId),
    tenantId: asString(raw.tenantId),
    status: asString(raw.status, 'active') as SamlProvider['status'],
  };
}

export function mapOidcProviderDto(dto: unknown): OidcProvider {
  const raw = asRecord(dto);
  return {
    providerId: asString(raw.providerId),
    name: asString(raw.name),
    issuer: asString(raw.issuer),
    tenantId: asString(raw.tenantId),
    status: asString(raw.status, 'active') as OidcProvider['status'],
  };
}

export function mapFavoriteDto(dto: unknown): IamFavorite {
  const raw = asRecord(dto);
  return {
    userId: asString(raw.userId),
    entityType: asString(raw.entityType, 'user') as IamFavorite['entityType'],
    entityId: asString(raw.entityId),
    createdAt: asString(raw.createdAt),
  };
}

export function mapDashboardDto(dto: unknown): IamDashboard {
  const raw = asRecord(dto);
  const trend = (value: unknown) =>
    Array.isArray(value)
      ? value.map((item) => {
          const point = asRecord(item);
          return { label: asString(point.label), value: asNumber(point.value) };
        })
      : [];

  return {
    totalUsers: asNumber(raw.totalUsers),
    activeSessions: asNumber(raw.activeSessions),
    mfaAdoptionRate: asNumber(raw.mfaAdoptionRate),
    failedLogins24h: asNumber(raw.failedLogins24h),
    activePolicies: asNumber(raw.activePolicies),
    openIncidents: asNumber(raw.openIncidents),
    breakGlassActive: asNumber(raw.breakGlassActive),
    sessionTrend: trend(raw.sessionTrend),
    loginTrend: trend(raw.loginTrend),
    recentIncidents: Array.isArray(raw.recentIncidents)
      ? raw.recentIncidents.map(mapSecurityIncidentDto)
      : [],
    recentAudit: Array.isArray(raw.recentAudit)
      ? raw.recentAudit.map(mapAuditDto)
      : [],
  };
}

export function mapAnalyticsDto(dto: unknown): IamAnalytics {
  const raw = asRecord(dto);
  const trend = (value: unknown) =>
    Array.isArray(value)
      ? value.map((item) => {
          const point = asRecord(item);
          return { label: asString(point.label), value: asNumber(point.value) };
        })
      : [];

  return {
    authenticationSuccessRate: asNumber(raw.authenticationSuccessRate),
    mfaEnrollmentRate: asNumber(raw.mfaEnrollmentRate),
    averageSessionDuration: asNumber(raw.averageSessionDuration),
    policyDenialRate: asNumber(raw.policyDenialRate),
    breakGlassUsage: asNumber(raw.breakGlassUsage),
    consentComplianceRate: asNumber(raw.consentComplianceRate),
    riskScoreAverage: asNumber(raw.riskScoreAverage),
    authTrend: trend(raw.authTrend),
    accessByModule: trend(raw.accessByModule),
    incidentTrend: trend(raw.incidentTrend),
  };
}

export function mapPaginatedDto<T>(
  dto: unknown,
  mapItem: (item: unknown) => T,
): PaginatedResult<T> {
  const raw = asRecord(dto);
  const items = Array.isArray(raw.items) ? raw.items.map(mapItem) : [];
  return {
    items,
    total: asNumber(raw.total, items.length),
    page: asNumber(raw.page, 1),
    pageSize: asNumber(raw.pageSize, items.length || 25),
  };
}

export function mapSearchResultDto(dto: unknown): {
  users: IamUser[];
  policies: IamPolicy[];
} {
  const raw = asRecord(dto);
  return {
    users: Array.isArray(raw.users) ? raw.users.map(mapUserDto) : [],
    policies: Array.isArray(raw.policies) ? raw.policies.map(mapPolicyDto) : [],
  };
}

export function mapExportResultDto(dto: unknown): {
  format: 'csv' | 'pdf' | 'xlsx';
  exportedAt: string;
  recordCount: number;
} {
  const raw = asRecord(dto);
  const format = asString(raw.format, 'csv');
  return {
    format: format === 'pdf' || format === 'xlsx' ? format : 'csv',
    exportedAt: asString(raw.exportedAt),
    recordCount: asNumber(raw.recordCount),
  };
}

export function mapShareResultDto(dto: unknown): {
  shared: boolean;
  recipients: number;
} {
  const raw = asRecord(dto);
  return {
    shared: asBoolean(raw.shared, true),
    recipients: asNumber(raw.recipients),
  };
}

export function filtersToQuery(filters?: IamFilters) {
  return filters as
    Record<string, string | number | boolean | null | undefined> | undefined;
}
