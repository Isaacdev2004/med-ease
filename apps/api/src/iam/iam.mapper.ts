import type {
  ApiKey,
  BreakGlassEvent,
  BreakGlassStatus,
  ConsentRecord,
  ConsentStatus,
  DelegationRecord,
  IamAuditEvent,
  IamOrganization,
  IamPermission,
  IamPolicy,
  IamRole,
  IamSession,
  IamTenant,
  IamUser,
  LoginAttempt,
  MfaDevice,
  MfaMethod,
  OAuthClient,
  OidcProvider,
  PolicyEffect,
  ProxyAccess,
  RiskScore,
  SamlProvider,
  SecurityIncident,
  SessionStatus,
  TrustedDevice,
  UserStatus as ContractUserStatus,
} from '@medease/iam-contract';
import type { Prisma } from '@medease/prisma';
import { getPermissionsForRole, type IdentityRole } from '@medease/auth';

import { mapUserStatus, permissionModule } from './iam.helpers';

type UserWithRoles = Prisma.UserGetPayload<{
  include: { roleAssignments: { include: { role: true } } };
}>;

export function mapUser(user: UserWithRoles): IamUser {
  const assignmentRoles =
    user.roleAssignments?.flatMap((assignment) => [
      assignment.roleId,
      assignment.role.name,
    ]) ?? [];
  const roles = [
    user.role,
    ...assignmentRoles.filter((role) => role !== user.role),
  ];

  return {
    userId: user.id,
    email: user.email,
    displayName: user.fullName,
    tenantId: user.tenantId,
    organizationId: user.organizationId,
    facilityId: user.facilityId ?? undefined,
    status: mapUserStatus(user.status) as ContractUserStatus,
    roles,
    mfaEnabled: user.mfaEnabled,
    lastLoginAt: user.lastLoginAt?.toISOString(),
    createdAt: user.createdAt.toISOString(),
  };
}

export function mapSession(
  session: Prisma.UserSessionGetPayload<object>,
): IamSession {
  return {
    sessionId: session.id,
    userId: session.userId,
    deviceId: session.deviceId ?? undefined,
    ipAddress: session.ipAddress ?? '',
    userAgent: session.userAgent ?? '',
    status: session.status as SessionStatus,
    startedAt: session.startedAt.toISOString(),
    lastActivityAt: session.lastActivityAt.toISOString(),
    expiresAt: session.expiresAt.toISOString(),
  };
}

export function mapTenant(
  tenant: Prisma.TenantGetPayload<object>,
  counts?: { organizations: number; users: number },
): IamTenant {
  return {
    tenantId: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    status: tenant.status === 'suspended' ? 'suspended' : 'active',
    organizationCount: counts?.organizations ?? 0,
    userCount: counts?.users ?? 0,
    createdAt: tenant.createdAt.toISOString(),
  };
}

export function mapOrganization(
  organization: Prisma.OrganizationGetPayload<object>,
  facilityCount = 0,
): IamOrganization {
  return {
    organizationId: organization.id,
    tenantId: organization.tenantId,
    name: organization.name,
    type: (organization.type as IamOrganization['type']) ?? 'health_system',
    parentId: organization.parentId ?? undefined,
    facilityCount,
  };
}

function rolePermissionCount(roleName: string): number {
  try {
    return getPermissionsForRole(roleName as IdentityRole).length;
  } catch {
    return 0;
  }
}

export function mapRole(role: Prisma.IamRoleRecordGetPayload<object>): IamRole {
  const permissionCount = role.isSystem ? rolePermissionCount(role.name) : 0;

  return {
    roleId: role.id,
    name: role.name,
    description: role.description,
    tenantId: role.tenantId ?? undefined,
    permissionCount,
    isSystem: role.isSystem,
  };
}

export function mapPermission(name: string, index: number): IamPermission {
  return {
    permissionId: `perm-${String(index + 1).padStart(4, '0')}`,
    name,
    module: permissionModule(name),
    description: `Permission: ${name}`,
  };
}

export function mapPolicy(
  policy: Prisma.IamPolicyRecordGetPayload<object>,
): IamPolicy {
  const conditions = Array.isArray(policy.conditions)
    ? (policy.conditions as string[])
    : undefined;

  return {
    policyId: policy.id,
    name: policy.name,
    description: policy.description,
    effect: policy.effect as PolicyEffect,
    resource: policy.resource,
    action: policy.action,
    conditions,
    tenantId: policy.tenantId ?? undefined,
    enabled: policy.enabled,
  };
}

export function mapLoginAttempt(
  attempt: Prisma.LoginAttemptGetPayload<object>,
): LoginAttempt {
  return {
    attemptId: attempt.id,
    userId: attempt.userId ?? undefined,
    email: attempt.email,
    success: attempt.success,
    ipAddress: attempt.ipAddress ?? '',
    reason: attempt.reason ?? undefined,
    attemptedAt: attempt.attemptedAt.toISOString(),
  };
}

export function mapMfaDevice(
  device: Prisma.MfaDeviceGetPayload<object>,
): MfaDevice {
  return {
    deviceId: device.id,
    userId: device.userId,
    method: device.method as MfaMethod,
    label: device.label,
    verified: device.verified,
    registeredAt: device.registeredAt.toISOString(),
    lastUsedAt: device.lastUsedAt?.toISOString(),
  };
}

export function mapTrustedDevice(
  device: Prisma.TrustedDeviceGetPayload<object>,
): TrustedDevice {
  return {
    deviceId: device.id,
    userId: device.userId,
    name: device.name,
    platform: device.platform,
    trustScore: device.trustScore,
    registeredAt: device.registeredAt.toISOString(),
    lastSeenAt: device.lastSeenAt.toISOString(),
  };
}

export function mapOAuthClient(
  client: Prisma.OAuthClientGetPayload<object>,
): OAuthClient {
  return {
    clientId: client.id,
    name: client.name,
    tenantId: client.tenantId,
    redirectUris: client.redirectUris,
    scopes: client.scopes,
    status: client.status as OAuthClient['status'],
    createdAt: client.createdAt.toISOString(),
  };
}

export function mapApiKey(key: Prisma.ApiKeyGetPayload<object>): ApiKey {
  return {
    keyId: key.id,
    name: key.name,
    tenantId: key.tenantId,
    prefix: key.prefix,
    scopes: key.scopes,
    status: key.status as ApiKey['status'],
    createdAt: key.createdAt.toISOString(),
    expiresAt: key.expiresAt?.toISOString(),
    lastUsedAt: key.lastUsedAt?.toISOString(),
  };
}

export function mapConsent(
  consent: Prisma.ConsentRecordGetPayload<object>,
): ConsentRecord {
  return {
    consentId: consent.id,
    patientId: consent.patientId,
    granteeId: consent.granteeId,
    purpose: consent.purpose,
    status: consent.status as ConsentStatus,
    grantedAt: consent.grantedAt.toISOString(),
    expiresAt: consent.expiresAt?.toISOString(),
    revokedAt: consent.revokedAt?.toISOString(),
  };
}

export function mapDelegation(
  delegation: Prisma.DelegationRecordGetPayload<object>,
): DelegationRecord {
  return {
    delegationId: delegation.id,
    delegatorId: delegation.delegatorId,
    delegateId: delegation.delegateId,
    scope: delegation.scope,
    startsAt: delegation.startsAt.toISOString(),
    endsAt: delegation.endsAt.toISOString(),
    status: delegation.status as DelegationRecord['status'],
  };
}

export function mapProxyAccess(
  proxy: Prisma.ProxyAccessGetPayload<object>,
): ProxyAccess {
  return {
    proxyId: proxy.id,
    patientId: proxy.patientId,
    proxyUserId: proxy.proxyUserId,
    relationship: proxy.relationship,
    status: proxy.status as ProxyAccess['status'],
    grantedAt: proxy.grantedAt.toISOString(),
  };
}

export function mapBreakGlass(
  event: Prisma.BreakGlassEventGetPayload<object>,
): BreakGlassEvent {
  return {
    eventId: event.id,
    userId: event.userId,
    patientId: event.patientId ?? undefined,
    reason: event.reason,
    status: event.status as BreakGlassStatus,
    startedAt: event.startedAt.toISOString(),
    endedAt: event.endedAt?.toISOString(),
    reviewedBy: event.reviewedBy ?? undefined,
  };
}

export function mapAuditEvent(
  log: Prisma.IamAuditLogGetPayload<object>,
): IamAuditEvent {
  return {
    auditId: log.id,
    action: log.action,
    actorId: log.actorId,
    resourceType: log.resourceType,
    resourceId: log.resourceId,
    outcome: log.outcome as IamAuditEvent['outcome'],
    ipAddress: log.ipAddress ?? undefined,
    timestamp: log.createdAt.toISOString(),
    tenantId: log.tenantId ?? undefined,
  };
}

export function mapSecurityIncident(
  incident: Prisma.SecurityIncidentGetPayload<object>,
): SecurityIncident {
  return {
    incidentId: incident.id,
    title: incident.title,
    severity: incident.severity as SecurityIncident['severity'],
    category: incident.category,
    status: incident.status as SecurityIncident['status'],
    detectedAt: incident.detectedAt.toISOString(),
    resolvedAt: incident.resolvedAt?.toISOString(),
  };
}

export function mapRiskScore(
  score: Prisma.RiskScoreGetPayload<object>,
): RiskScore {
  return {
    scoreId: score.id,
    userId: score.userId,
    score: score.score,
    factors: score.factors,
    level: score.level as RiskScore['level'],
    assessedAt: score.assessedAt.toISOString(),
  };
}

export function mapSamlProvider(
  provider: Prisma.SamlProviderGetPayload<object>,
): SamlProvider {
  return {
    providerId: provider.id,
    name: provider.name,
    entityId: provider.entityId,
    tenantId: provider.tenantId,
    status: provider.status as SamlProvider['status'],
  };
}

export function mapOidcProvider(
  provider: Prisma.OidcProviderGetPayload<object>,
): OidcProvider {
  return {
    providerId: provider.id,
    name: provider.name,
    issuer: provider.issuer,
    tenantId: provider.tenantId,
    status: provider.status as OidcProvider['status'],
  };
}
