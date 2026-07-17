import type {
  AssignRoleInput,
  CreatePolicyInput,
  CreateUserInput,
  DelegateAccessInput,
  EndBreakGlassInput,
  GrantConsentInput,
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
  InviteUserInput,
  LoginAttempt,
  MfaDevice,
  OAuthClient,
  OidcProvider,
  PaginatedResult,
  ProxyAccess,
  RevokeSessionInput,
  RiskScore,
  SamlProvider,
  SecurityIncident,
  ShareIamInput,
  StartBreakGlassInput,
  TrustedDevice,
  ApiKey,
  BreakGlassEvent,
  ConsentRecord,
  DelegationRecord,
} from './types.js';

/**
 * Canonical IAM repository contract — the single source of truth for mock and HTTP adapters.
 * All methods are async; missing resources throw {@link NotFoundError} from repository-transport.
 */
export interface IamRepositoryContract {
  dashboard(tenantId?: string): Promise<IamDashboard>;
  analytics(tenantId?: string): Promise<IamAnalytics>;

  getUsers(filters?: IamFilters): Promise<PaginatedResult<IamUser>>;
  getUser(userId: string): Promise<IamUser>;
  getTenants(filters?: IamFilters): Promise<PaginatedResult<IamTenant>>;
  getOrganizations(
    filters?: IamFilters,
  ): Promise<PaginatedResult<IamOrganization>>;
  getRoles(filters?: IamFilters): Promise<PaginatedResult<IamRole>>;
  getPermissions(filters?: IamFilters): Promise<PaginatedResult<IamPermission>>;
  getPolicies(filters?: IamFilters): Promise<PaginatedResult<IamPolicy>>;
  getSessions(filters?: IamFilters): Promise<PaginatedResult<IamSession>>;
  getLoginHistory(filters?: IamFilters): Promise<PaginatedResult<LoginAttempt>>;
  getMfaDevices(filters?: IamFilters): Promise<PaginatedResult<MfaDevice>>;
  getTrustedDevices(
    filters?: IamFilters,
  ): Promise<PaginatedResult<TrustedDevice>>;
  getOauthClients(filters?: IamFilters): Promise<PaginatedResult<OAuthClient>>;
  getApiKeys(filters?: IamFilters): Promise<PaginatedResult<ApiKey>>;
  getConsents(filters?: IamFilters): Promise<PaginatedResult<ConsentRecord>>;
  getDelegations(
    filters?: IamFilters,
  ): Promise<PaginatedResult<DelegationRecord>>;
  getProxyAccess(filters?: IamFilters): Promise<PaginatedResult<ProxyAccess>>;
  getBreakGlass(
    filters?: IamFilters,
  ): Promise<PaginatedResult<BreakGlassEvent>>;
  getAuditEvents(filters?: IamFilters): Promise<PaginatedResult<IamAuditEvent>>;
  getSecurityIncidents(
    filters?: IamFilters,
  ): Promise<PaginatedResult<SecurityIncident>>;
  getRiskScores(filters?: IamFilters): Promise<PaginatedResult<RiskScore>>;
  getSamlProviders(
    filters?: IamFilters,
  ): Promise<PaginatedResult<SamlProvider>>;
  getOidcProviders(
    filters?: IamFilters,
  ): Promise<PaginatedResult<OidcProvider>>;

  createUser(input: CreateUserInput): Promise<IamUser>;
  inviteUser(input: InviteUserInput): Promise<IamUser>;
  lockAccount(userId: string): Promise<IamUser>;
  unlockAccount(userId: string): Promise<IamUser>;
  assignRole(input: AssignRoleInput): Promise<IamUser>;
  removeRole(input: AssignRoleInput): Promise<IamUser>;
  createPolicy(input: CreatePolicyInput): Promise<IamPolicy>;
  enableMfa(userId: string): Promise<IamUser>;
  disableMfa(userId: string): Promise<IamUser>;
  revokeSession(input: RevokeSessionInput): Promise<IamSession>;
  createOAuthClient(name: string, tenantId: string): Promise<OAuthClient>;
  rotateApiKey(keyId: string): Promise<ApiKey>;
  grantConsent(input: GrantConsentInput): Promise<ConsentRecord>;
  revokeConsent(consentId: string): Promise<ConsentRecord>;
  delegateAccess(input: DelegateAccessInput): Promise<DelegationRecord>;
  startBreakGlass(input: StartBreakGlassInput): Promise<BreakGlassEvent>;
  endBreakGlass(input: EndBreakGlassInput): Promise<BreakGlassEvent>;

  search(
    query: string,
    tenantId?: string,
  ): Promise<{ users: IamUser[]; policies: IamPolicy[] }>;
  exportData(format: 'csv' | 'pdf' | 'xlsx'): Promise<{
    format: 'csv' | 'pdf' | 'xlsx';
    exportedAt: string;
    recordCount: number;
  }>;
  favorite(
    userId: string,
    entityType: IamFavorite['entityType'],
    entityId: string,
  ): Promise<IamFavorite>;
  getFavorites(userId: string): Promise<IamFavorite[]>;
  share(input: ShareIamInput): Promise<{ shared: boolean; recipients: number }>;
}
