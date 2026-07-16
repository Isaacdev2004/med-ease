import { activeApiKeyCount, computeApiAnalytics } from '@/services/api-platform/analytics-engine';
import { publishedOAuthAppCount } from '@/services/api-platform/oauth-engine';
import { activeEndpointCount } from '@/services/api-platform/openapi-engine';
import { activeRateLimitPolicies } from '@/services/api-platform/rate-limit-engine';
import { totalSdkDownloads } from '@/services/api-platform/sdk-engine';
import { pendingDeliveryCount, webhookSuccessRate } from '@/services/api-platform/webhook-engine';
import type {
  ApiDashboard,
  ApiEndpoint,
  ApiKey,
  ApiPartner,
  ApiVersion,
  OAuthApp,
  OpenApiSpec,
  RateLimitPolicy,
  SandboxEnvironment,
  SdkPackage,
  Webhook,
  WebhookDelivery,
} from '@/services/api-platform/types';

const SCALE = { keys: 80, oauth: 40, webhooks: 60, deliveries: 200, endpoints: 120, sdks: 12, policies: 20, partners: 35, sandboxes: 15 };
const ENTERPRISE = { keys: 12_000, oauth: 3_500, webhooks: 8_000, endpoints: 450, partners: 280, sandboxes: 120, requests: 45_000_000 };

const MODULES = ['patients', 'appointments', 'medications', 'billing', 'laboratory', 'radiology', 'workforce', 'documents', 'iam', 'workflows'];
const SCOPES = ['read:patients', 'write:appointments', 'read:medications', 'write:billing', 'read:lab', 'admin:iam'];
const WEBHOOK_EVENTS = ['patient.created', 'appointment.scheduled', 'medication.dispensed', 'lab.result.ready', 'invoice.paid'];
const SDK_LANGUAGES = ['TypeScript', 'Python', 'Java', 'C#', 'Go', 'Ruby'];
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_API_KEYS: ApiKey[] = Array.from({ length: SCALE.keys }, (_, i) => ({
  keyId: `key-${String(i + 1).padStart(4, '0')}`,
  name: `API Key ${(i % 20) + 1}`,
  prefix: `me_live_${String(i + 1).padStart(4, '0')}`,
  status: (['active', 'active', 'revoked', 'expired'] as const)[i % 4]!,
  scopes: SCOPES.slice(0, 2 + (i % 4)),
  partnerId: i % 3 === 0 ? `ptr-${String((i % 10) + 1).padStart(3, '0')}` : undefined,
  createdBy: `user-${String((i % 15) + 1).padStart(5, '0')}`,
  createdAt: daysAgo(i % 180),
  lastUsedAt: i % 4 !== 2 ? daysAgo(i % 7) : undefined,
  expiresAt: i % 5 === 0 ? daysAgo(-90) : undefined,
}));

export const MOCK_OAUTH_APPS: OAuthApp[] = Array.from({ length: SCALE.oauth }, (_, i) => ({
  appId: `app-${String(i + 1).padStart(4, '0')}`,
  name: `OAuth App ${(i % 15) + 1}`,
  clientId: `medease_client_${String(i + 1).padStart(4, '0')}`,
  status: (['published', 'published', 'draft', 'suspended'] as const)[i % 4]!,
  redirectUris: [`https://partner${(i % 10) + 1}.example.com/callback`],
  scopes: SCOPES.slice(0, 3 + (i % 3)),
  partnerId: i % 2 === 0 ? `ptr-${String((i % 10) + 1).padStart(3, '0')}` : undefined,
  createdAt: daysAgo(i % 120),
  updatedAt: daysAgo(i % 30),
}));

export const MOCK_WEBHOOKS: Webhook[] = Array.from({ length: SCALE.webhooks }, (_, i) => ({
  webhookId: `wh-${String(i + 1).padStart(4, '0')}`,
  name: `Webhook ${(i % 25) + 1}`,
  url: `https://hooks.partner${(i % 10) + 1}.example.com/medease`,
  events: WEBHOOK_EVENTS.slice(0, 1 + (i % 4)),
  status: (['active', 'active', 'paused', 'disabled'] as const)[i % 4]!,
  secretPrefix: `whsec_${String(i + 1).padStart(4, '0')}`,
  partnerId: i % 3 === 0 ? `ptr-${String((i % 10) + 1).padStart(3, '0')}` : undefined,
  createdAt: daysAgo(i % 90),
  lastDeliveryAt: i % 4 !== 3 ? daysAgo(i % 3) : undefined,
}));

export const MOCK_WEBHOOK_DELIVERIES: WebhookDelivery[] = Array.from({ length: SCALE.deliveries }, (_, i) => ({
  deliveryId: `del-${String(i + 1).padStart(5, '0')}`,
  webhookId: MOCK_WEBHOOKS[i % MOCK_WEBHOOKS.length]!.webhookId,
  eventType: WEBHOOK_EVENTS[i % WEBHOOK_EVENTS.length]!,
  status: (['delivered', 'delivered', 'failed', 'retrying', 'pending'] as const)[i % 5]!,
  attemptCount: 1 + (i % 3),
  responseCode: i % 5 === 2 ? 500 : 200,
  deliveredAt: i % 5 !== 4 ? daysAgo(i % 5) : undefined,
  createdAt: daysAgo(i % 14),
}));

export const MOCK_API_ENDPOINTS: ApiEndpoint[] = Array.from({ length: SCALE.endpoints }, (_, i) => ({
  endpointId: `ep-${String(i + 1).padStart(4, '0')}`,
  path: `/v1/${MODULES[i % MODULES.length]}/${['list', 'create', 'update', 'delete', 'search'][i % 5]}`,
  method: HTTP_METHODS[i % HTTP_METHODS.length]!,
  module: MODULES[i % MODULES.length]!,
  status: (['active', 'active', 'beta', 'deprecated'] as const)[i % 4]!,
  version: `v${1 + (i % 3)}`,
  description: `${HTTP_METHODS[i % HTTP_METHODS.length]} endpoint for ${MODULES[i % MODULES.length]}`,
  rateLimitPolicyId: i % 4 === 0 ? `rl-${String((i % 10) + 1).padStart(3, '0')}` : undefined,
}));

export const MOCK_API_VERSIONS: ApiVersion[] = [
  { versionId: 'ver-001', version: 'v3', status: 'beta', releaseDate: daysAgo(-30), endpointCount: 45 },
  { versionId: 'ver-002', version: 'v2', status: 'active', releaseDate: daysAgo(180), endpointCount: 120 },
  { versionId: 'ver-003', version: 'v1', status: 'deprecated', releaseDate: daysAgo(540), deprecationDate: daysAgo(30), endpointCount: 85 },
];

export const MOCK_SDK_PACKAGES: SdkPackage[] = SDK_LANGUAGES.map((lang, i) => ({
  sdkId: `sdk-${String(i + 1).padStart(3, '0')}`,
  name: `Med-Ease ${lang} SDK`,
  language: lang,
  version: `${2 + (i % 2)}.${i % 5}.${i % 10}`,
  status: (['published', 'published', 'beta', 'deprecated'] as const)[i % 4]!,
  downloadCount: 5000 + i * 3200,
  publishedAt: daysAgo(i * 30),
  changelog: `Initial release with ${MODULES[i % MODULES.length]} support`,
}));

export const MOCK_RATE_LIMIT_POLICIES: RateLimitPolicy[] = Array.from({ length: SCALE.policies }, (_, i) => ({
  policyId: `rl-${String(i + 1).padStart(3, '0')}`,
  name: `Rate Limit ${i + 1}`,
  requestsPerMinute: 60 * (10 + (i % 5) * 10),
  burstLimit: 100 + i * 50,
  tier: (['standard', 'premium', 'enterprise'] as const)[i % 3]!,
  endpointPattern: `/v1/${MODULES[i % MODULES.length]}/*`,
  enabled: i % 6 !== 0,
}));

export const MOCK_API_PARTNERS: ApiPartner[] = Array.from({ length: SCALE.partners }, (_, i) => ({
  partnerId: `ptr-${String(i + 1).padStart(3, '0')}`,
  name: `Partner ${(i % 20) + 1} Health Tech`,
  tier: (['standard', 'premium', 'enterprise'] as const)[i % 3]!,
  contactEmail: `api-partner${i + 1}@example.com`,
  apiKeyCount: 1 + (i % 8),
  webhookCount: i % 4,
  status: (['active', 'active', 'pending', 'suspended'] as const)[i % 4]!,
  onboardedAt: daysAgo(i % 365),
}));

export const MOCK_SANDBOX_ENVIRONMENTS: SandboxEnvironment[] = Array.from({ length: SCALE.sandboxes }, (_, i) => ({
  sandboxId: `sbx-${String(i + 1).padStart(3, '0')}`,
  name: `Sandbox ${i + 1}`,
  baseUrl: `https://sandbox-${i + 1}.api.medease.io`,
  status: (['active', 'active', 'provisioning', 'suspended'] as const)[i % 4]!,
  partnerId: i % 2 === 0 ? `ptr-${String((i % 10) + 1).padStart(3, '0')}` : undefined,
  apiKeyCount: 1 + (i % 3),
  createdAt: daysAgo(i % 60),
  expiresAt: i % 3 === 0 ? daysAgo(-30) : undefined,
}));

export const MOCK_OPENAPI_SPECS: OpenApiSpec[] = [
  { specId: 'spec-001', title: 'Med-Ease Platform API', version: '2.4.0', endpointCount: 120, lastUpdated: daysAgo(2), format: 'openapi3' },
  { specId: 'spec-002', title: 'Med-Ease Clinical API', version: '1.8.0', endpointCount: 65, lastUpdated: daysAgo(7), format: 'openapi3' },
  { specId: 'spec-003', title: 'Med-Ease Legacy API', version: '1.0.0', endpointCount: 45, lastUpdated: daysAgo(90), format: 'swagger2' },
];

export function buildApiDashboard(partnerId?: string): ApiDashboard {
  let keys = MOCK_API_KEYS;
  let webhooks = MOCK_WEBHOOKS;
  let deliveries = MOCK_WEBHOOK_DELIVERIES;
  if (partnerId) {
    keys = keys.filter((k) => k.partnerId === partnerId);
    webhooks = webhooks.filter((w) => w.partnerId === partnerId);
    deliveries = deliveries.filter((d) => MOCK_WEBHOOKS.find((w) => w.webhookId === d.webhookId)?.partnerId === partnerId);
  }

  return {
    totalEndpoints: ENTERPRISE.endpoints,
    activeApiKeys: activeApiKeyCount(keys) * 150,
    oauthApps: publishedOAuthAppCount(MOCK_OAUTH_APPS) * 80,
    activeWebhooks: webhooks.filter((w) => w.status === 'active').length * 120,
    sdkDownloads: totalSdkDownloads(MOCK_SDK_PACKAGES),
    sandboxEnvironments: MOCK_SANDBOX_ENVIRONMENTS.filter((s) => s.status === 'active').length * 8,
    partners: MOCK_API_PARTNERS.filter((p) => p.status === 'active').length * 12,
    requestsToday: ENTERPRISE.requests / 365,
    requestTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
      label,
      value: 120_000 + i * 18_000,
    })),
    moduleBreakdown: MODULES.slice(0, 6).map((label) => ({
      label,
      value: MOCK_API_ENDPOINTS.filter((e) => e.module === label).length * 800,
    })),
    recentDeliveries: deliveries.slice(0, 8),
  };
}

export function computeApiPlatformAnalytics(partnerId?: string) {
  let keys = MOCK_API_KEYS;
  let deliveries = MOCK_WEBHOOK_DELIVERIES;
  if (partnerId) {
    keys = keys.filter((k) => k.partnerId === partnerId);
    deliveries = deliveries.filter((d) => MOCK_WEBHOOKS.find((w) => w.webhookId === d.webhookId)?.partnerId === partnerId);
  }
  return computeApiAnalytics(keys, MOCK_API_ENDPOINTS, deliveries, totalSdkDownloads(MOCK_SDK_PACKAGES));
}

export {
  activeEndpointCount,
  activeRateLimitPolicies,
  pendingDeliveryCount,
  webhookSuccessRate,
};
