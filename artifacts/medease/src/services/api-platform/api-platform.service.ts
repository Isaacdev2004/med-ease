import { apiPlatformRepository } from '@/services/api-platform/repository';
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

const DELAY = 250;
async function delay(ms = DELAY) { await new Promise((r) => setTimeout(r, ms)); }

export const apiPlatformService = {
  async dashboard(partnerId?: string) { await delay(); return apiPlatformRepository.dashboard(partnerId); },
  async analytics(partnerId?: string) { await delay(); return apiPlatformRepository.analytics(partnerId); },

  async getApiKeys(filters?: ApiPlatformFilters) { await delay(); return apiPlatformRepository.getApiKeys(filters); },
  async getApiKey(keyId: string) { await delay(); return apiPlatformRepository.getApiKey(keyId); },
  async getOAuthApps(filters?: ApiPlatformFilters) { await delay(); return apiPlatformRepository.getOAuthApps(filters); },
  async getOAuthApp(appId: string) { await delay(); return apiPlatformRepository.getOAuthApp(appId); },
  async getWebhooks(filters?: ApiPlatformFilters) { await delay(); return apiPlatformRepository.getWebhooks(filters); },
  async getWebhook(webhookId: string) { await delay(); return apiPlatformRepository.getWebhook(webhookId); },
  async getWebhookDeliveries(filters?: ApiPlatformFilters) { await delay(); return apiPlatformRepository.getWebhookDeliveries(filters); },
  async getSdkPackages(filters?: ApiPlatformFilters) { await delay(); return apiPlatformRepository.getSdkPackages(filters); },
  async getRateLimitPolicies(filters?: ApiPlatformFilters) { await delay(); return apiPlatformRepository.getRateLimitPolicies(filters); },
  async getEndpoints(filters?: ApiPlatformFilters) { await delay(); return apiPlatformRepository.getEndpoints(filters); },
  async getApiVersions() { await delay(); return apiPlatformRepository.getApiVersions(); },
  async getOpenApiSpecs() { await delay(); return apiPlatformRepository.getOpenApiSpecs(); },
  async getOpenApiPreview(specId: string) { await delay(); return apiPlatformRepository.getOpenApiPreview(specId); },
  async getPartners(filters?: ApiPlatformFilters) { await delay(); return apiPlatformRepository.getPartners(filters); },
  async getPartner(partnerId: string) { await delay(); return apiPlatformRepository.getPartner(partnerId); },
  async getSandboxes(filters?: ApiPlatformFilters) { await delay(); return apiPlatformRepository.getSandboxes(filters); },

  async createApiKey(input: CreateApiKeyInput) { await delay(); return apiPlatformRepository.createApiKey(input); },
  async revokeApiKey(input: RevokeApiKeyInput) { await delay(); return apiPlatformRepository.revokeApiKey(input); },
  async createOAuthApp(input: CreateOAuthAppInput) { await delay(); return apiPlatformRepository.createOAuthApp(input); },
  async publishOAuthApp(appId: string) { await delay(); return apiPlatformRepository.publishOAuthApp(appId); },
  async createWebhook(input: CreateWebhookInput) { await delay(); return apiPlatformRepository.createWebhook(input); },
  async testWebhook(input: TestWebhookInput) { await delay(); return apiPlatformRepository.testWebhook(input); },
  async createSandbox(input: CreateSandboxInput) { await delay(); return apiPlatformRepository.createSandbox(input); },
  async publishSdk(input: PublishSdkInput) { await delay(); return apiPlatformRepository.publishSdk(input); },
  async updateRateLimit(input: UpdateRateLimitInput) { await delay(); return apiPlatformRepository.updateRateLimit(input); },

  async search(query: string, filters?: ApiPlatformFilters) { await delay(); return apiPlatformRepository.search(query, filters); },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') { await delay(); return apiPlatformRepository.exportData(format); },
};
