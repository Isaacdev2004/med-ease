import { interoperabilityRepository } from '@/services/interoperability/repository';
import type {
  CreateApiClientInput,
  CreateEndpointInput,
  InteropFilters,
  PublishWebhookInput,
  RegisterSmartAppInput,
  RetryJobInput,
  RunSyncInput,
  UpdateEndpointInput,
  ValidateMappingInput,
} from '@/services/interoperability/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const interoperabilityService = {
  async dashboard(facilityId?: string) {
    await delay();
    return interoperabilityRepository.dashboard(facilityId);
  },
  async analytics(facilityId?: string) {
    await delay();
    return interoperabilityRepository.analytics(facilityId);
  },
  async getEndpoints(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getEndpoints(filters);
  },
  async getFhirServers(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getFhirServers(filters);
  },
  async getHl7Messages(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getHl7Messages(filters);
  },
  async getDicomStudies(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getDicomStudies(filters);
  },
  async getCdaDocuments(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getCdaDocuments(filters);
  },
  async getMappings(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getMappings(filters);
  },
  async getSubscriptions(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getSubscriptions(filters);
  },
  async getQueue() {
    await delay();
    return interoperabilityRepository.getQueue();
  },
  async getJobs(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getJobs(filters);
  },
  async getWebhooks(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getWebhooks(filters);
  },
  async getApiClients(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getApiClients(filters);
  },
  async getApiKeys() {
    await delay();
    return interoperabilityRepository.getApiKeys();
  },
  async getSmartApps(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getSmartApps(filters);
  },
  async getAudit(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getAudit(filters);
  },
  async getTerminology() {
    await delay();
    return interoperabilityRepository.getTerminology();
  },
  async getValidations(filters?: InteropFilters) {
    await delay();
    return interoperabilityRepository.getValidations(filters);
  },

  async createEndpoint(input: CreateEndpointInput) {
    await delay();
    return interoperabilityRepository.createEndpoint(input);
  },
  async updateEndpoint(input: UpdateEndpointInput) {
    await delay();
    return interoperabilityRepository.updateEndpoint(input);
  },
  async runSync(input: RunSyncInput) {
    await delay();
    return interoperabilityRepository.runSync(input);
  },
  async retryJob(input: RetryJobInput) {
    await delay();
    return interoperabilityRepository.retryJob(input);
  },
  async validateMapping(input: ValidateMappingInput) {
    await delay();
    return interoperabilityRepository.validateMapping(input);
  },
  async publishWebhook(input: PublishWebhookInput) {
    await delay();
    return interoperabilityRepository.publishWebhook(input);
  },
  async createApiClient(input: CreateApiClientInput) {
    await delay();
    return interoperabilityRepository.createApiClient(input);
  },
  async regenerateApiKey(keyId: string) {
    await delay();
    return interoperabilityRepository.regenerateApiKey(keyId);
  },
  async registerSmartApp(input: RegisterSmartAppInput) {
    await delay();
    return interoperabilityRepository.registerSmartApp(input);
  },

  async search(query: string, facilityId?: string) {
    await delay();
    return interoperabilityRepository.search(query, facilityId);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return interoperabilityRepository.exportData(format);
  },
  async favorite(
    userId: string,
    entityType:
      'endpoint' | 'mapping' | 'webhook' | 'fhir_server' | 'smart_app',
    entityId: string,
  ) {
    await delay();
    return interoperabilityRepository.favorite(userId, entityType, entityId);
  },
  async getFavorites(userId: string) {
    await delay();
    return interoperabilityRepository.getFavorites(userId);
  },
};
