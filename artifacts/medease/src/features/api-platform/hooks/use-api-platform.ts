import { useQuery } from '@tanstack/react-query';

import { apiPlatformQueries } from '@/features/api-platform/queries/api-platform.queries';
import type { ApiPlatformFilters } from '@/services/api-platform/types';

export function useApiDashboard(partnerId?: string) {
  return useQuery(apiPlatformQueries.dashboard(partnerId));
}

export function useApiAnalytics(partnerId?: string) {
  return useQuery(apiPlatformQueries.analytics(partnerId));
}

export function useApiKeys(filters?: ApiPlatformFilters) {
  return useQuery(apiPlatformQueries.apiKeys(filters));
}

export function useOAuthApps(filters?: ApiPlatformFilters) {
  return useQuery(apiPlatformQueries.oauthApps(filters));
}

export function useWebhooks(filters?: ApiPlatformFilters) {
  return useQuery(apiPlatformQueries.webhooks(filters));
}

export function useWebhookDeliveries(filters?: ApiPlatformFilters) {
  return useQuery(apiPlatformQueries.webhookDeliveries(filters));
}

export function useSdkPackages(filters?: ApiPlatformFilters) {
  return useQuery(apiPlatformQueries.sdkPackages(filters));
}

export function useRateLimitPolicies(filters?: ApiPlatformFilters) {
  return useQuery(apiPlatformQueries.rateLimitPolicies(filters));
}

export function useApiEndpoints(filters?: ApiPlatformFilters) {
  return useQuery(apiPlatformQueries.endpoints(filters));
}

export function useApiVersions() {
  return useQuery(apiPlatformQueries.apiVersions());
}

export function useOpenApiSpecs() {
  return useQuery(apiPlatformQueries.openApiSpecs());
}

export function useOpenApiPreview(specId: string) {
  return useQuery(apiPlatformQueries.openApiPreview(specId));
}

export function useApiPartners(filters?: ApiPlatformFilters) {
  return useQuery(apiPlatformQueries.partners(filters));
}

export function useSandboxes(filters?: ApiPlatformFilters) {
  return useQuery(apiPlatformQueries.sandboxes(filters));
}

export function useApiPlatformSearch(
  query: string,
  filters?: ApiPlatformFilters,
) {
  return useQuery(apiPlatformQueries.search(query, filters));
}
