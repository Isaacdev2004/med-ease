import { useQuery } from '@tanstack/react-query';

import { iamQueries } from '@/features/iam/queries/iam.queries';
import type { IamFilters } from '@/services/iam/types';

export function useIamDashboard(tenantId?: string) {
  return useQuery(iamQueries.dashboard(tenantId));
}

export function useIamAnalytics(tenantId?: string) {
  return useQuery(iamQueries.analytics(tenantId));
}

export function useUsers(filters?: IamFilters) {
  return useQuery(iamQueries.users(filters));
}

export function useRoles(filters?: IamFilters) {
  return useQuery(iamQueries.roles(filters));
}

export function usePermissions(filters?: IamFilters) {
  return useQuery(iamQueries.permissions(filters));
}

export function usePolicies(filters?: IamFilters) {
  return useQuery(iamQueries.policies(filters));
}

export function useSessions(filters?: IamFilters) {
  return useQuery(iamQueries.sessions(filters));
}

export function useLoginHistory(filters?: IamFilters) {
  return useQuery(iamQueries.loginHistory(filters));
}

export function useMfa(filters?: IamFilters) {
  return useQuery(iamQueries.mfaDevices(filters));
}

export function useTrustedDevices(filters?: IamFilters) {
  return useQuery(iamQueries.trustedDevices(filters));
}

export function useOauthClients(filters?: IamFilters) {
  return useQuery(iamQueries.oauthClients(filters));
}

export function useApiKeys(filters?: IamFilters) {
  return useQuery(iamQueries.apiKeys(filters));
}

export function useConsent(filters?: IamFilters) {
  return useQuery(iamQueries.consents(filters));
}

export function useDelegations(filters?: IamFilters) {
  return useQuery(iamQueries.delegations(filters));
}

export function useBreakGlass(filters?: IamFilters) {
  return useQuery(iamQueries.breakGlass(filters));
}

export function useAuditEvents(filters?: IamFilters) {
  return useQuery(iamQueries.auditEvents(filters));
}

export function useSecurityAnalytics(tenantId?: string) {
  return useQuery(iamQueries.analytics(tenantId));
}

export function useSecurityIncidents(filters?: IamFilters) {
  return useQuery(iamQueries.securityIncidents(filters));
}

export function useRiskScores(filters?: IamFilters) {
  return useQuery(iamQueries.riskScores(filters));
}

export function useTenants(filters?: IamFilters) {
  return useQuery(iamQueries.tenants(filters));
}

export function useOrganizations(filters?: IamFilters) {
  return useQuery(iamQueries.organizations(filters));
}

export function useSamlProviders(filters?: IamFilters) {
  return useQuery(iamQueries.samlProviders(filters));
}

export function useOidcProviders(filters?: IamFilters) {
  return useQuery(iamQueries.oidcProviders(filters));
}

export function useProxyAccess(filters?: IamFilters) {
  return useQuery(iamQueries.proxyAccess(filters));
}

export function useIamSearch(query: string, tenantId?: string) {
  return useQuery(iamQueries.search(query, tenantId));
}

export function useIamFavorites(userId?: string) {
  return useQuery(iamQueries.favorites(userId));
}
