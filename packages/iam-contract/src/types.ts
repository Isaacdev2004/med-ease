export type UserStatus = 'active' | 'inactive' | 'locked' | 'pending';
export type SessionStatus = 'active' | 'expired' | 'revoked';
export type MfaMethod = 'totp' | 'sms' | 'email' | 'hardware_key' | 'push';
export type PolicyEffect = 'allow' | 'deny';
export type ConsentStatus = 'active' | 'revoked' | 'expired';
export type BreakGlassStatus = 'active' | 'ended' | 'reviewed';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface AbacContext {
  tenantId?: string;
  facilityId?: string;
  departmentId?: string;
  timeOfDay?: number;
  ipRange?: string;
}

export interface IamFilters {
  q?: string;
  tenantId?: string;
  organizationId?: string;
  facilityId?: string;
  userId?: string;
  patientId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IamUser {
  userId: string;
  email: string;
  displayName: string;
  tenantId: string;
  organizationId: string;
  facilityId?: string;
  status: UserStatus;
  roles: string[];
  mfaEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface IamTenant {
  tenantId: string;
  name: string;
  slug: string;
  status: 'active' | 'suspended';
  organizationCount: number;
  userCount: number;
  createdAt: string;
}

export interface IamOrganization {
  organizationId: string;
  tenantId: string;
  name: string;
  type: 'health_system' | 'hospital' | 'clinic' | 'department';
  parentId?: string;
  facilityCount: number;
}

export interface IamRole {
  roleId: string;
  name: string;
  description: string;
  tenantId?: string;
  permissionCount: number;
  isSystem: boolean;
}

export interface IamPermission {
  permissionId: string;
  name: string;
  module: string;
  description: string;
}

export interface IamPolicy {
  policyId: string;
  name: string;
  description: string;
  effect: PolicyEffect;
  resource: string;
  action: string;
  conditions?: string[];
  tenantId?: string;
  enabled: boolean;
}

export interface IamSession {
  sessionId: string;
  userId: string;
  deviceId?: string;
  ipAddress: string;
  userAgent: string;
  status: SessionStatus;
  startedAt: string;
  lastActivityAt: string;
  expiresAt: string;
}

export interface LoginAttempt {
  attemptId: string;
  userId?: string;
  email: string;
  success: boolean;
  ipAddress: string;
  reason?: string;
  attemptedAt: string;
}

export interface MfaDevice {
  deviceId: string;
  userId: string;
  method: MfaMethod;
  label: string;
  verified: boolean;
  registeredAt: string;
  lastUsedAt?: string;
}

export interface TrustedDevice {
  deviceId: string;
  userId: string;
  name: string;
  platform: string;
  trustScore: number;
  registeredAt: string;
  lastSeenAt: string;
}

export interface OAuthClient {
  clientId: string;
  name: string;
  tenantId: string;
  redirectUris: string[];
  scopes: string[];
  status: 'active' | 'revoked';
  createdAt: string;
}

export interface ApiKey {
  keyId: string;
  name: string;
  tenantId: string;
  prefix: string;
  scopes: string[];
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
}

export interface ConsentRecord {
  consentId: string;
  patientId: string;
  granteeId: string;
  purpose: string;
  status: ConsentStatus;
  grantedAt: string;
  expiresAt?: string;
  revokedAt?: string;
}

export interface DelegationRecord {
  delegationId: string;
  delegatorId: string;
  delegateId: string;
  scope: string;
  startsAt: string;
  endsAt: string;
  status: 'active' | 'expired' | 'revoked';
}

export interface ProxyAccess {
  proxyId: string;
  patientId: string;
  proxyUserId: string;
  relationship: string;
  status: 'active' | 'revoked';
  grantedAt: string;
}

export interface BreakGlassEvent {
  eventId: string;
  userId: string;
  patientId?: string;
  reason: string;
  status: BreakGlassStatus;
  startedAt: string;
  endedAt?: string;
  reviewedBy?: string;
}

export interface SecurityIncident {
  incidentId: string;
  title: string;
  severity: IncidentSeverity;
  category: string;
  status: 'open' | 'investigating' | 'resolved';
  detectedAt: string;
  resolvedAt?: string;
}

export interface IamAuditEvent {
  auditId: string;
  action: string;
  actorId: string;
  resourceType: string;
  resourceId: string;
  outcome: 'success' | 'failure';
  ipAddress?: string;
  timestamp: string;
  tenantId?: string;
}

export interface RiskScore {
  scoreId: string;
  userId: string;
  score: number;
  factors: string[];
  level: 'low' | 'medium' | 'high' | 'critical';
  assessedAt: string;
}

export interface SamlProvider {
  providerId: string;
  name: string;
  entityId: string;
  tenantId: string;
  status: 'active' | 'inactive';
}

export interface OidcProvider {
  providerId: string;
  name: string;
  issuer: string;
  tenantId: string;
  status: 'active' | 'inactive';
}

export interface IamDashboard {
  totalUsers: number;
  activeSessions: number;
  mfaAdoptionRate: number;
  failedLogins24h: number;
  activePolicies: number;
  openIncidents: number;
  breakGlassActive: number;
  sessionTrend: { label: string; value: number }[];
  loginTrend: { label: string; value: number }[];
  recentIncidents: SecurityIncident[];
  recentAudit: IamAuditEvent[];
}

export interface IamAnalytics {
  authenticationSuccessRate: number;
  mfaEnrollmentRate: number;
  averageSessionDuration: number;
  policyDenialRate: number;
  breakGlassUsage: number;
  consentComplianceRate: number;
  riskScoreAverage: number;
  authTrend: { label: string; value: number }[];
  accessByModule: { label: string; value: number }[];
  incidentTrend: { label: string; value: number }[];
}

export interface IamPermissions {
  canView: boolean;
  canWrite: boolean;
  canUsers: boolean;
  canRoles: boolean;
  canPermissions: boolean;
  canPolicies: boolean;
  canSessions: boolean;
  canMfa: boolean;
  canSso: boolean;
  canOauth: boolean;
  canApiKeys: boolean;
  canAudit: boolean;
  canAnalytics: boolean;
  canConsent: boolean;
  canBreakGlass: boolean;
  canAdmin: boolean;
}

export interface IamFavorite {
  userId: string;
  entityType: 'user' | 'role' | 'policy' | 'session' | 'client';
  entityId: string;
  createdAt: string;
}

export interface CreateUserInput {
  email: string;
  displayName: string;
  tenantId: string;
  organizationId: string;
  roleIds: string[];
}

export interface InviteUserInput {
  email: string;
  tenantId: string;
  organizationId: string;
  roleIds: string[];
}

export interface AssignRoleInput {
  userId: string;
  roleId: string;
}

export interface CreatePolicyInput {
  name: string;
  description: string;
  effect: PolicyEffect;
  resource: string;
  action: string;
  tenantId?: string;
}

export interface RevokeSessionInput {
  sessionId: string;
}

export interface StartBreakGlassInput {
  userId: string;
  patientId?: string;
  reason: string;
}

export interface EndBreakGlassInput {
  eventId: string;
}

export interface GrantConsentInput {
  patientId: string;
  granteeId: string;
  purpose: string;
  expiresAt?: string;
}

export interface DelegateAccessInput {
  delegatorId: string;
  delegateId: string;
  scope: string;
  endsAt: string;
}

export interface ShareIamInput {
  entityType: IamFavorite['entityType'];
  entityId: string;
  recipientIds: string[];
}
