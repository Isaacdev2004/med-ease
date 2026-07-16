export type ApiKeyStatus = 'active' | 'revoked' | 'expired';
export type OAuthAppStatus = 'draft' | 'published' | 'suspended';
export type WebhookStatus = 'active' | 'paused' | 'disabled';
export type DeliveryStatus = 'pending' | 'delivered' | 'failed' | 'retrying';
export type SdkStatus = 'published' | 'beta' | 'deprecated';
export type EndpointStatus = 'active' | 'deprecated' | 'beta';
export type PartnerTier = 'standard' | 'premium' | 'enterprise';
export type SandboxStatus = 'active' | 'provisioning' | 'suspended';

export interface ApiPlatformFilters {
  q?: string;
  tenantId?: string;
  facilityId?: string;
  partnerId?: string;
  status?: string;
  module?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiKey {
  keyId: string;
  name: string;
  prefix: string;
  status: ApiKeyStatus;
  scopes: string[];
  partnerId?: string;
  createdBy: string;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

export interface OAuthApp {
  appId: string;
  name: string;
  clientId: string;
  status: OAuthAppStatus;
  redirectUris: string[];
  scopes: string[];
  partnerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SdkPackage {
  sdkId: string;
  name: string;
  language: string;
  version: string;
  status: SdkStatus;
  downloadCount: number;
  publishedAt: string;
  changelog?: string;
}

export interface RateLimitPolicy {
  policyId: string;
  name: string;
  requestsPerMinute: number;
  burstLimit: number;
  tier: PartnerTier;
  endpointPattern: string;
  enabled: boolean;
}

export interface Webhook {
  webhookId: string;
  name: string;
  url: string;
  events: string[];
  status: WebhookStatus;
  secretPrefix: string;
  partnerId?: string;
  createdAt: string;
  lastDeliveryAt?: string;
}

export interface WebhookDelivery {
  deliveryId: string;
  webhookId: string;
  eventType: string;
  status: DeliveryStatus;
  attemptCount: number;
  responseCode?: number;
  deliveredAt?: string;
  createdAt: string;
}

export interface ApiEndpoint {
  endpointId: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  module: string;
  status: EndpointStatus;
  version: string;
  description: string;
  rateLimitPolicyId?: string;
}

export interface ApiVersion {
  versionId: string;
  version: string;
  status: EndpointStatus;
  releaseDate: string;
  deprecationDate?: string;
  endpointCount: number;
}

export interface ApiPartner {
  partnerId: string;
  name: string;
  tier: PartnerTier;
  contactEmail: string;
  apiKeyCount: number;
  webhookCount: number;
  status: 'active' | 'suspended' | 'pending';
  onboardedAt: string;
}

export interface SandboxEnvironment {
  sandboxId: string;
  name: string;
  baseUrl: string;
  status: SandboxStatus;
  partnerId?: string;
  apiKeyCount: number;
  createdAt: string;
  expiresAt?: string;
}

export interface OpenApiSpec {
  specId: string;
  title: string;
  version: string;
  endpointCount: number;
  lastUpdated: string;
  format: 'openapi3' | 'swagger2';
}

export interface ApiAnalytics {
  totalRequests: number;
  errorRate: number;
  avgLatencyMs: number;
  p99LatencyMs: number;
  activeKeys: number;
  webhookSuccessRate: number;
  topEndpoints: { label: string; value: number }[];
  requestTrend: { label: string; value: number }[];
  errorTrend: { label: string; value: number }[];
  partnerUsage: { label: string; value: number }[];
}

export interface ApiDashboard {
  totalEndpoints: number;
  activeApiKeys: number;
  oauthApps: number;
  activeWebhooks: number;
  sdkDownloads: number;
  sandboxEnvironments: number;
  partners: number;
  requestsToday: number;
  requestTrend: { label: string; value: number }[];
  moduleBreakdown: { label: string; value: number }[];
  recentDeliveries: WebhookDelivery[];
}

export interface ApiPlatformPermissions {
  canView: boolean;
  canWrite: boolean;
  canKeys: boolean;
  canOAuth: boolean;
  canWebhooks: boolean;
  canSdk: boolean;
  canAnalytics: boolean;
  canMarketplace: boolean;
  canAdmin: boolean;
}

export interface CreateApiKeyInput {
  name: string;
  scopes: string[];
  partnerId?: string;
  createdBy: string;
  expiresAt?: string;
}

export interface CreateOAuthAppInput {
  name: string;
  redirectUris: string[];
  scopes: string[];
  partnerId?: string;
}

export interface CreateWebhookInput {
  name: string;
  url: string;
  events: string[];
  partnerId?: string;
}

export interface CreateSandboxInput {
  name: string;
  partnerId?: string;
}

export interface RevokeApiKeyInput {
  keyId: string;
  revokedBy: string;
}

export interface TestWebhookInput {
  webhookId: string;
  eventType: string;
}

export interface PublishSdkInput {
  sdkId: string;
  version: string;
}

export interface UpdateRateLimitInput {
  policyId: string;
  requestsPerMinute: number;
  burstLimit: number;
  enabled: boolean;
}
