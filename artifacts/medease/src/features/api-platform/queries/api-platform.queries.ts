import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { apiPlatformService } from '@/services/api-platform/api-platform.service';
import type { ApiPlatformFilters } from '@/services/api-platform/types';

export const apiPlatformQueries = {
  dashboard: (partnerId?: string) => ({
    queryKey: queryKeys.apiPlatform.dashboard(partnerId),
    queryFn: () => apiPlatformService.dashboard(partnerId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (partnerId?: string) => ({
    queryKey: queryKeys.apiPlatform.analytics(partnerId),
    queryFn: () => apiPlatformService.analytics(partnerId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  apiKeys: (filters?: ApiPlatformFilters) => ({
    queryKey: queryKeys.apiPlatform.apiKeys(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => apiPlatformService.getApiKeys(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  apiKey: (keyId: string) => ({
    queryKey: queryKeys.apiPlatform.apiKey(keyId),
    queryFn: () => apiPlatformService.getApiKey(keyId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(keyId),
  }),
  oauthApps: (filters?: ApiPlatformFilters) => ({
    queryKey: queryKeys.apiPlatform.oauthApps(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => apiPlatformService.getOAuthApps(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  oauthApp: (appId: string) => ({
    queryKey: queryKeys.apiPlatform.oauthApp(appId),
    queryFn: () => apiPlatformService.getOAuthApp(appId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(appId),
  }),
  webhooks: (filters?: ApiPlatformFilters) => ({
    queryKey: queryKeys.apiPlatform.webhooks(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => apiPlatformService.getWebhooks(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  webhook: (webhookId: string) => ({
    queryKey: queryKeys.apiPlatform.webhook(webhookId),
    queryFn: () => apiPlatformService.getWebhook(webhookId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(webhookId),
  }),
  webhookDeliveries: (filters?: ApiPlatformFilters) => ({
    queryKey: queryKeys.apiPlatform.webhookDeliveries(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => apiPlatformService.getWebhookDeliveries(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  sdkPackages: (filters?: ApiPlatformFilters) => ({
    queryKey: queryKeys.apiPlatform.sdkPackages(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => apiPlatformService.getSdkPackages(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  rateLimitPolicies: (filters?: ApiPlatformFilters) => ({
    queryKey: queryKeys.apiPlatform.rateLimitPolicies(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => apiPlatformService.getRateLimitPolicies(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  endpoints: (filters?: ApiPlatformFilters) => ({
    queryKey: queryKeys.apiPlatform.endpoints(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => apiPlatformService.getEndpoints(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  apiVersions: () => ({
    queryKey: queryKeys.apiPlatform.apiVersions(),
    queryFn: () => apiPlatformService.getApiVersions(),
    staleTime: CACHE_TIMES.patientList,
  }),
  openApiSpecs: () => ({
    queryKey: queryKeys.apiPlatform.openApiSpecs(),
    queryFn: () => apiPlatformService.getOpenApiSpecs(),
    staleTime: CACHE_TIMES.patientList,
  }),
  openApiPreview: (specId: string) => ({
    queryKey: queryKeys.apiPlatform.openApiPreview(specId),
    queryFn: () => apiPlatformService.getOpenApiPreview(specId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(specId),
  }),
  partners: (filters?: ApiPlatformFilters) => ({
    queryKey: queryKeys.apiPlatform.partners(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => apiPlatformService.getPartners(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  partner: (partnerId: string) => ({
    queryKey: queryKeys.apiPlatform.partner(partnerId),
    queryFn: () => apiPlatformService.getPartner(partnerId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(partnerId),
  }),
  sandboxes: (filters?: ApiPlatformFilters) => ({
    queryKey: queryKeys.apiPlatform.sandboxes(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => apiPlatformService.getSandboxes(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  search: (query: string, filters?: ApiPlatformFilters) => ({
    queryKey: queryKeys.apiPlatform.search(
      query,
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => apiPlatformService.search(query, filters),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
