import { computeApiPlatformAnalytics, buildApiDashboard } from '@/services/api-platform/analytics';
import { generateClientId, generateClientSecret, nextOAuthAppStatus, canPublishOAuthApp } from '@/services/api-platform/oauth-engine';
import { generateOpenApiPreview } from '@/services/api-platform/openapi-engine';
import { nextSdkStatus } from '@/services/api-platform/sdk-engine';
import { buildWebhookSignature, canDeliverWebhook, nextDeliveryStatus } from '@/services/api-platform/webhook-engine';
import {
  MOCK_API_ENDPOINTS,
  MOCK_API_KEYS,
  MOCK_API_PARTNERS,
  MOCK_API_VERSIONS,
  MOCK_OAUTH_APPS,
  MOCK_OPENAPI_SPECS,
  MOCK_RATE_LIMIT_POLICIES,
  MOCK_SANDBOX_ENVIRONMENTS,
  MOCK_SDK_PACKAGES,
  MOCK_WEBHOOKS,
  MOCK_WEBHOOK_DELIVERIES,
} from '@/services/api-platform/mock-data';
import type {
  ApiPlatformFilters,
  CreateApiKeyInput,
  CreateOAuthAppInput,
  CreateSandboxInput,
  CreateWebhookInput,
  PublishSdkInput,
  RevokeApiKeyInput,
  TestWebhookInput,
  UpdateRateLimitInput,
} from '@/services/api-platform/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return { items: items.slice(start, start + pageSize), total: items.length, page: page ?? 1, pageSize: pageSize ?? 25 };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

class ApiPlatformRepository {
  private apiKeys = [...MOCK_API_KEYS];
  private oauthApps = [...MOCK_OAUTH_APPS];
  private webhooks = [...MOCK_WEBHOOKS];
  private deliveries = [...MOCK_WEBHOOK_DELIVERIES];
  private rateLimits = [...MOCK_RATE_LIMIT_POLICIES];
  private sandboxes = [...MOCK_SANDBOX_ENVIRONMENTS];
  private sdks = [...MOCK_SDK_PACKAGES];
  private nextId = 880000;

  dashboard(partnerId?: string) { return buildApiDashboard(partnerId); }
  analytics(partnerId?: string) { return computeApiPlatformAnalytics(partnerId); }

  getApiKeys(filters?: ApiPlatformFilters) {
    let items = this.apiKeys;
    if (filters?.partnerId) items = items.filter((k) => k.partnerId === filters.partnerId);
    if (filters?.status) items = items.filter((k) => k.status === filters.status);
    if (filters?.q) items = items.filter((k) => matchQ(filters.q, k.name, k.prefix));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getApiKey(keyId: string) { return this.apiKeys.find((k) => k.keyId === keyId) ?? null; }

  getOAuthApps(filters?: ApiPlatformFilters) {
    let items = this.oauthApps;
    if (filters?.partnerId) items = items.filter((a) => a.partnerId === filters.partnerId);
    if (filters?.status) items = items.filter((a) => a.status === filters.status);
    if (filters?.q) items = items.filter((a) => matchQ(filters.q, a.name, a.clientId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getOAuthApp(appId: string) { return this.oauthApps.find((a) => a.appId === appId) ?? null; }

  getWebhooks(filters?: ApiPlatformFilters) {
    let items = this.webhooks;
    if (filters?.partnerId) items = items.filter((w) => w.partnerId === filters.partnerId);
    if (filters?.status) items = items.filter((w) => w.status === filters.status);
    if (filters?.q) items = items.filter((w) => matchQ(filters.q, w.name, w.url));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getWebhook(webhookId: string) { return this.webhooks.find((w) => w.webhookId === webhookId) ?? null; }

  getWebhookDeliveries(filters?: ApiPlatformFilters) {
    let items = this.deliveries;
    if (filters?.status) items = items.filter((d) => d.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSdkPackages(filters?: ApiPlatformFilters) {
    let items = this.sdks;
    if (filters?.status) items = items.filter((s) => s.status === filters.status);
    if (filters?.q) items = items.filter((s) => matchQ(filters.q, s.name, s.language));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getRateLimitPolicies(filters?: ApiPlatformFilters) {
    let items = this.rateLimits;
    if (filters?.q) items = items.filter((p) => matchQ(filters.q, p.name, p.endpointPattern));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getEndpoints(filters?: ApiPlatformFilters) {
    let items = MOCK_API_ENDPOINTS;
    if (filters?.module) items = items.filter((e) => e.module === filters.module);
    if (filters?.status) items = items.filter((e) => e.status === filters.status);
    if (filters?.q) items = items.filter((e) => matchQ(filters.q, e.path, e.description));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getApiVersions() { return MOCK_API_VERSIONS; }

  getOpenApiSpecs() { return MOCK_OPENAPI_SPECS; }

  getOpenApiPreview(specId: string) {
    const spec = MOCK_OPENAPI_SPECS.find((s) => s.specId === specId);
    if (!spec) return null;
    return { spec, preview: generateOpenApiPreview(spec, MOCK_API_ENDPOINTS) };
  }

  getPartners(filters?: ApiPlatformFilters) {
    let items = MOCK_API_PARTNERS;
    if (filters?.status) items = items.filter((p) => p.status === filters.status);
    if (filters?.q) items = items.filter((p) => matchQ(filters.q, p.name, p.contactEmail));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getPartner(partnerId: string) { return MOCK_API_PARTNERS.find((p) => p.partnerId === partnerId) ?? null; }

  getSandboxes(filters?: ApiPlatformFilters) {
    let items = this.sandboxes;
    if (filters?.partnerId) items = items.filter((s) => s.partnerId === filters.partnerId);
    if (filters?.status) items = items.filter((s) => s.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  createApiKey(input: CreateApiKeyInput) {
    const key = {
      keyId: `key-${this.nextId++}`,
      name: input.name,
      prefix: `me_live_${String(this.nextId).slice(-4)}`,
      status: 'active' as const,
      scopes: input.scopes,
      partnerId: input.partnerId,
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
      expiresAt: input.expiresAt,
    };
    this.apiKeys.unshift(key);
    return { ...key, secret: `sk_${Math.random().toString(36).slice(2, 18)}` };
  }

  revokeApiKey(input: RevokeApiKeyInput) {
    const key = this.apiKeys.find((k) => k.keyId === input.keyId);
    if (!key) return null;
    key.status = 'revoked';
    return key;
  }

  createOAuthApp(input: CreateOAuthAppInput) {
    const app = {
      appId: `app-${this.nextId++}`,
      name: input.name,
      clientId: generateClientId(input.name),
      status: 'draft' as const,
      redirectUris: input.redirectUris,
      scopes: input.scopes,
      partnerId: input.partnerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.oauthApps.unshift(app);
    return { ...app, clientSecret: generateClientSecret() };
  }

  publishOAuthApp(appId: string) {
    const app = this.oauthApps.find((a) => a.appId === appId);
    if (!app || !canPublishOAuthApp(app)) return null;
    app.status = nextOAuthAppStatus(app.status, 'publish');
    app.updatedAt = new Date().toISOString();
    return app;
  }

  createWebhook(input: CreateWebhookInput) {
    const webhook = {
      webhookId: `wh-${this.nextId++}`,
      name: input.name,
      url: input.url,
      events: input.events,
      status: 'active' as const,
      secretPrefix: `whsec_${String(this.nextId).slice(-4)}`,
      partnerId: input.partnerId,
      createdAt: new Date().toISOString(),
    };
    this.webhooks.unshift(webhook);
    return webhook;
  }

  testWebhook(input: TestWebhookInput) {
    const webhook = this.webhooks.find((w) => w.webhookId === input.webhookId);
    if (!webhook || !canDeliverWebhook(webhook)) return null;
    const delivery = {
      deliveryId: `del-${this.nextId++}`,
      webhookId: input.webhookId,
      eventType: input.eventType,
      status: nextDeliveryStatus('pending', 'deliver'),
      attemptCount: 1,
      responseCode: 200,
      deliveredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.deliveries.unshift(delivery);
    webhook.lastDeliveryAt = delivery.deliveredAt;
    return { delivery, signature: buildWebhookSignature(webhook.secretPrefix, input.eventType) };
  }

  createSandbox(input: CreateSandboxInput) {
    const sandbox = {
      sandboxId: `sbx-${this.nextId++}`,
      name: input.name,
      baseUrl: `https://sandbox-${this.nextId}.api.medease.io`,
      status: 'provisioning' as const,
      partnerId: input.partnerId,
      apiKeyCount: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
    };
    this.sandboxes.unshift(sandbox);
    return sandbox;
  }

  publishSdk(input: PublishSdkInput) {
    const sdk = this.sdks.find((s) => s.sdkId === input.sdkId);
    if (!sdk) return null;
    sdk.version = input.version;
    sdk.status = nextSdkStatus(sdk.status, 'publish');
    sdk.publishedAt = new Date().toISOString();
    return sdk;
  }

  updateRateLimit(input: UpdateRateLimitInput) {
    const policy = this.rateLimits.find((p) => p.policyId === input.policyId);
    if (!policy) return null;
    policy.requestsPerMinute = input.requestsPerMinute;
    policy.burstLimit = input.burstLimit;
    policy.enabled = input.enabled;
    return policy;
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return { format, exportedAt: new Date().toISOString(), recordCount: this.apiKeys.length + this.webhooks.length };
  }

  search(query: string, filters?: ApiPlatformFilters) {
    const keys = this.apiKeys.filter((k) => matchQ(query, k.name, k.prefix));
    const endpoints = MOCK_API_ENDPOINTS.filter((e) => matchQ(query, e.path, e.description));
    return {
      apiKeys: paginate(keys, filters?.page, filters?.pageSize),
      endpoints: paginate(endpoints, filters?.page, filters?.pageSize),
    };
  }
}

export const apiPlatformRepository = new ApiPlatformRepository();
