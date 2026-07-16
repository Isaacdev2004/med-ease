import { computeIamAnalytics } from '@/services/iam/analytics';
import { generateClientSecret } from '@/services/iam/oauth-engine';
import type { IamRepositoryContract } from '@medease/iam-contract';
import { NotFoundError } from '@workspace/repository-transport';
import {
  MOCK_API_KEYS,
  MOCK_BREAK_GLASS,
  MOCK_CONSENTS,
  MOCK_DELEGATIONS,
  MOCK_IAM_AUDIT,
  MOCK_IAM_PERMISSIONS,
  MOCK_IAM_POLICIES,
  MOCK_IAM_ROLES,
  MOCK_IAM_SESSIONS,
  MOCK_IAM_USERS,
  MOCK_LOGIN_HISTORY,
  MOCK_MFA_DEVICES,
  MOCK_OAUTH_CLIENTS,
  MOCK_OIDC_PROVIDERS,
  MOCK_ORGANIZATIONS,
  MOCK_PROXY_ACCESS,
  MOCK_RISK_SCORES,
  MOCK_SAML_PROVIDERS,
  MOCK_SECURITY_INCIDENTS,
  MOCK_TENANTS,
  MOCK_TRUSTED_DEVICES,
  buildIamDashboard,
} from '@/services/iam/mock-data';
import type {
  AssignRoleInput,
  CreatePolicyInput,
  CreateUserInput,
  DelegateAccessInput,
  EndBreakGlassInput,
  GrantConsentInput,
  IamFavorite,
  IamFilters,
  InviteUserInput,
  RevokeSessionInput,
  ShareIamInput,
  StartBreakGlassInput,
} from '@/services/iam/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return { items: items.slice(start, start + pageSize), total: items.length, page: page ?? 1, pageSize: pageSize ?? 25 };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

function audit(action: string, resourceType: string, resourceId: string, actorId = 'system', tenantId?: string) {
  MOCK_IAM_AUDIT.unshift({
    auditId: `iamaudit-${Date.now()}`,
    action,
    actorId,
    resourceType,
    resourceId,
    outcome: 'success',
    timestamp: new Date().toISOString(),
    tenantId: tenantId ?? 'tenant-001',
  });
}

class IamMockRepository implements IamRepositoryContract {
  private users = [...MOCK_IAM_USERS];
  private policies = [...MOCK_IAM_POLICIES];
  private sessions = [...MOCK_IAM_SESSIONS];
  private breakGlass = [...MOCK_BREAK_GLASS];
  private consents = [...MOCK_CONSENTS];
  private delegations = [...MOCK_DELEGATIONS];
  private favorites: IamFavorite[] = [];
  private nextId = 970000;

  async dashboard(tenantId?: string) { return buildIamDashboard(tenantId); }
  async analytics(tenantId?: string) { return computeIamAnalytics(tenantId); }

  async getUsers(filters?: IamFilters) {
    let items = this.users;
    if (filters?.tenantId) items = items.filter((u) => u.tenantId === filters.tenantId);
    if (filters?.organizationId) items = items.filter((u) => u.organizationId === filters.organizationId);
    if (filters?.status) items = items.filter((u) => u.status === filters.status);
    if (filters?.q) items = items.filter((u) => matchQ(filters.q, u.email, u.displayName, u.userId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getUser(userId: string) {
    const user = this.users.find((u) => u.userId === userId);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async getTenants(filters?: IamFilters) {
    let items = MOCK_TENANTS;
    if (filters?.q) items = items.filter((t) => matchQ(filters.q, t.name, t.slug));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getOrganizations(filters?: IamFilters) {
    let items = MOCK_ORGANIZATIONS;
    if (filters?.tenantId) items = items.filter((o) => o.tenantId === filters.tenantId);
    if (filters?.q) items = items.filter((o) => matchQ(filters.q, o.name));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getRoles(filters?: IamFilters) {
    let items = MOCK_IAM_ROLES;
    if (filters?.q) items = items.filter((r) => matchQ(filters.q, r.name, r.description));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getPermissions(filters?: IamFilters) {
    let items = MOCK_IAM_PERMISSIONS;
    if (filters?.q) items = items.filter((p) => matchQ(filters.q, p.name, p.module));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getPolicies(filters?: IamFilters) {
    let items = this.policies;
    if (filters?.tenantId) items = items.filter((p) => !p.tenantId || p.tenantId === filters.tenantId);
    if (filters?.q) items = items.filter((p) => matchQ(filters.q, p.name, p.resource));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getSessions(filters?: IamFilters) {
    let items = this.sessions;
    if (filters?.userId) items = items.filter((s) => s.userId === filters.userId);
    if (filters?.status) items = items.filter((s) => s.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getLoginHistory(filters?: IamFilters) {
    let items = MOCK_LOGIN_HISTORY;
    if (filters?.userId) items = items.filter((l) => l.userId === filters.userId);
    if (filters?.q) items = items.filter((l) => matchQ(filters.q, l.email));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getMfaDevices(filters?: IamFilters) {
    let items = MOCK_MFA_DEVICES;
    if (filters?.userId) items = items.filter((d) => d.userId === filters.userId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getTrustedDevices(filters?: IamFilters) {
    let items = MOCK_TRUSTED_DEVICES;
    if (filters?.userId) items = items.filter((d) => d.userId === filters.userId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getOauthClients(filters?: IamFilters) {
    let items = MOCK_OAUTH_CLIENTS;
    if (filters?.tenantId) items = items.filter((c) => c.tenantId === filters.tenantId);
    if (filters?.q) items = items.filter((c) => matchQ(filters.q, c.name, c.clientId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getApiKeys(filters?: IamFilters) {
    let items = MOCK_API_KEYS;
    if (filters?.tenantId) items = items.filter((k) => k.tenantId === filters.tenantId);
    if (filters?.q) items = items.filter((k) => matchQ(filters.q, k.name, k.keyId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getConsents(filters?: IamFilters) {
    let items = this.consents;
    if (filters?.userId) items = items.filter((c) => c.granteeId === filters.userId);
    if (filters?.patientId) items = items.filter((c) => c.patientId === filters.patientId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getDelegations(filters?: IamFilters) {
    let items = this.delegations;
    if (filters?.userId) items = items.filter((d) => d.delegatorId === filters.userId || d.delegateId === filters.userId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getProxyAccess(filters?: IamFilters) {
    let items = MOCK_PROXY_ACCESS;
    if (filters?.patientId) items = items.filter((p) => p.patientId === filters.patientId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getBreakGlass(filters?: IamFilters) {
    let items = this.breakGlass;
    if (filters?.userId) items = items.filter((e) => e.userId === filters.userId);
    if (filters?.status) items = items.filter((e) => e.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getAuditEvents(filters?: IamFilters) {
    let items = MOCK_IAM_AUDIT;
    if (filters?.tenantId) items = items.filter((a) => a.tenantId === filters.tenantId);
    if (filters?.userId) items = items.filter((a) => a.actorId === filters.userId);
    if (filters?.q) items = items.filter((a) => matchQ(filters.q, a.action, a.resourceType));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getSecurityIncidents(filters?: IamFilters) {
    let items = MOCK_SECURITY_INCIDENTS;
    if (filters?.status) items = items.filter((i) => i.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getRiskScores(filters?: IamFilters) {
    let items = MOCK_RISK_SCORES;
    if (filters?.userId) items = items.filter((r) => r.userId === filters.userId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getSamlProviders(filters?: IamFilters) {
    let items = MOCK_SAML_PROVIDERS;
    if (filters?.tenantId) items = items.filter((p) => p.tenantId === filters.tenantId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async getOidcProviders(filters?: IamFilters) {
    let items = MOCK_OIDC_PROVIDERS;
    if (filters?.tenantId) items = items.filter((p) => p.tenantId === filters.tenantId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  async createUser(input: CreateUserInput) {
    const user = {
      userId: `user-${++this.nextId}`,
      email: input.email,
      displayName: input.displayName,
      tenantId: input.tenantId,
      organizationId: input.organizationId,
      status: 'pending' as const,
      roles: input.roleIds,
      mfaEnabled: false,
      createdAt: new Date().toISOString(),
    };
    this.users.unshift(user);
    audit('create_user', 'user', user.userId, 'system', input.tenantId);
    return user;
  }

  async inviteUser(input: InviteUserInput) {
    return this.createUser({ ...input, displayName: input.email.split('@')[0] ?? 'Invited User' });
  }

  async lockAccount(userId: string) {
    const user = this.users.find((u) => u.userId === userId);
    if (!user) throw new NotFoundError('User not found');
    user.status = 'locked';
    audit('lock_account', 'user', userId, 'system', user.tenantId);
    return user;
  }

  async unlockAccount(userId: string) {
    const user = this.users.find((u) => u.userId === userId);
    if (!user) throw new NotFoundError('User not found');
    user.status = 'active';
    audit('unlock_account', 'user', userId, 'system', user.tenantId);
    return user;
  }

  async assignRole(input: AssignRoleInput) {
    const user = this.users.find((u) => u.userId === input.userId);
    if (!user) throw new NotFoundError('User not found');
    if (!user.roles.includes(input.roleId)) user.roles.push(input.roleId);
    audit('assign_role', 'role', input.roleId, input.userId, user.tenantId);
    return user;
  }

  async removeRole(input: AssignRoleInput) {
    const user = this.users.find((u) => u.userId === input.userId);
    if (!user) throw new NotFoundError('User not found');
    user.roles = user.roles.filter((r) => r !== input.roleId);
    audit('remove_role', 'role', input.roleId, input.userId, user.tenantId);
    return user;
  }

  async createPolicy(input: CreatePolicyInput) {
    const policy = {
      policyId: `pol-${++this.nextId}`,
      name: input.name,
      description: input.description,
      effect: input.effect,
      resource: input.resource,
      action: input.action,
      tenantId: input.tenantId,
      enabled: true,
    };
    this.policies.unshift(policy);
    audit('create_policy', 'policy', policy.policyId, 'system', input.tenantId);
    return policy;
  }

  async enableMfa(userId: string) {
    const user = this.users.find((u) => u.userId === userId);
    if (!user) throw new NotFoundError('User not found');
    user.mfaEnabled = true;
    audit('enable_mfa', 'user', userId, userId, user.tenantId);
    return user;
  }

  async disableMfa(userId: string) {
    const user = this.users.find((u) => u.userId === userId);
    if (!user) throw new NotFoundError('User not found');
    user.mfaEnabled = false;
    audit('disable_mfa', 'user', userId, userId, user.tenantId);
    return user;
  }

  async revokeSession(input: RevokeSessionInput) {
    const session = this.sessions.find((s) => s.sessionId === input.sessionId);
    if (!session) throw new NotFoundError('Session not found');
    session.status = 'revoked';
    audit('revoke_session', 'session', session.sessionId, session.userId);
    return session;
  }

  async createOAuthClient(name: string, tenantId: string) {
    const client = {
      clientId: `client-${++this.nextId}`,
      name,
      tenantId,
      redirectUris: ['https://localhost/callback'],
      scopes: ['openid', 'profile'],
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      secret: generateClientSecret(),
    };
    audit('create_oauth_client', 'client', client.clientId, 'system', tenantId);
    return client;
  }

  async rotateApiKey(keyId: string) {
    const key = MOCK_API_KEYS.find((k) => k.keyId === keyId);
    if (!key) throw new NotFoundError('API key not found');
    audit('rotate_api_key', 'api_key', keyId, 'system', key.tenantId);
    return { ...key, prefix: `mk_${Date.now().toString(36).slice(0, 4)}`, createdAt: new Date().toISOString() };
  }

  async grantConsent(input: GrantConsentInput) {
    const consent = {
      consentId: `consent-${++this.nextId}`,
      patientId: input.patientId,
      granteeId: input.granteeId,
      purpose: input.purpose,
      status: 'active' as const,
      grantedAt: new Date().toISOString(),
      expiresAt: input.expiresAt,
    };
    this.consents.unshift(consent);
    audit('grant_consent', 'consent', consent.consentId);
    return consent;
  }

  async revokeConsent(consentId: string) {
    const consent = this.consents.find((c) => c.consentId === consentId);
    if (!consent) throw new NotFoundError('Consent not found');
    consent.status = 'revoked';
    consent.revokedAt = new Date().toISOString();
    audit('revoke_consent', 'consent', consentId);
    return consent;
  }

  async delegateAccess(input: DelegateAccessInput) {
    const delegation = {
      delegationId: `del-${++this.nextId}`,
      delegatorId: input.delegatorId,
      delegateId: input.delegateId,
      scope: input.scope,
      startsAt: new Date().toISOString(),
      endsAt: input.endsAt,
      status: 'active' as const,
    };
    this.delegations.unshift(delegation);
    audit('delegate_access', 'delegation', delegation.delegationId, input.delegatorId);
    return delegation;
  }

  async startBreakGlass(input: StartBreakGlassInput) {
    const event = {
      eventId: `bg-${++this.nextId}`,
      userId: input.userId,
      patientId: input.patientId,
      reason: input.reason,
      status: 'active' as const,
      startedAt: new Date().toISOString(),
    };
    this.breakGlass.unshift(event);
    audit('start_break_glass', 'break_glass', event.eventId, input.userId);
    return event;
  }

  async endBreakGlass(input: EndBreakGlassInput) {
    const event = this.breakGlass.find((e) => e.eventId === input.eventId);
    if (!event) throw new NotFoundError('Break-glass event not found');
    event.status = 'ended';
    event.endedAt = new Date().toISOString();
    audit('end_break_glass', 'break_glass', event.eventId, event.userId);
    return event;
  }

  async search(query: string, tenantId?: string) {
    const q = query.toLowerCase();
    const users = this.users.filter((u) => (!tenantId || u.tenantId === tenantId) && matchQ(q, u.email, u.displayName));
    const policies = this.policies.filter((p) => matchQ(q, p.name));
    return { users: users.slice(0, 10), policies: policies.slice(0, 10) };
  }

  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return { format, exportedAt: new Date().toISOString(), recordCount: this.users.length + this.policies.length };
  }

  async favorite(userId: string, entityType: IamFavorite['entityType'], entityId: string) {
    const fav = { userId, entityType, entityId, createdAt: new Date().toISOString() };
    this.favorites.push(fav);
    return fav;
  }

  async getFavorites(userId: string) { return this.favorites.filter((f) => f.userId === userId); }

  async share(input: ShareIamInput) {
    audit('share', input.entityType, input.entityId);
    return { shared: true, recipients: input.recipientIds.length };
  }
}

export const iamMockRepository = new IamMockRepository();
