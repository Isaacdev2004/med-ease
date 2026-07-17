import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { iamService } from '@/services/iam/iam.service';
import type { IamFilters } from '@/services/iam/types';

export const iamQueries = {
  dashboard: (tenantId?: string) => ({
    queryKey: queryKeys.iam.dashboard(tenantId),
    queryFn: () => iamService.dashboard(tenantId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (tenantId?: string) => ({
    queryKey: queryKeys.iam.analytics(tenantId),
    queryFn: () => iamService.analytics(tenantId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  users: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.users(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getUsers(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  user: (userId: string) => ({
    queryKey: queryKeys.iam.user(userId),
    queryFn: () => iamService.getUser(userId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
  tenants: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.tenants(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getTenants(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  organizations: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.organizations(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getOrganizations(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  roles: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.roles(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getRoles(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  permissions: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.permissions(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getPermissions(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  policies: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.policies(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getPolicies(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  sessions: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.sessions(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getSessions(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  loginHistory: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.loginHistory(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getLoginHistory(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  mfaDevices: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.mfaDevices(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getMfaDevices(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  trustedDevices: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.trustedDevices(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getTrustedDevices(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  oauthClients: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.oauthClients(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getOauthClients(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  apiKeys: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.apiKeys(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getApiKeys(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  consents: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.consents(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getConsents(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  delegations: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.delegations(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getDelegations(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  proxyAccess: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.proxyAccess(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getProxyAccess(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  breakGlass: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.breakGlass(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getBreakGlass(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  auditEvents: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.auditEvents(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getAuditEvents(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  securityIncidents: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.securityIncidents(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getSecurityIncidents(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  riskScores: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.riskScores(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getRiskScores(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  samlProviders: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.samlProviders(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getSamlProviders(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  oidcProviders: (filters?: IamFilters) => ({
    queryKey: queryKeys.iam.oidcProviders(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => iamService.getOidcProviders(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  search: (query: string, tenantId?: string) => ({
    queryKey: queryKeys.iam.search(query, tenantId),
    queryFn: () => iamService.search(query, tenantId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.iam.favorites(userId),
    queryFn: () => iamService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
};
