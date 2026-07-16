import { computeInteropAnalytics } from '@/services/interoperability/analytics';
import { shouldRetry } from '@/services/interoperability/integration-engine';
import { validateMappingProfile } from '@/services/interoperability/mapping-engine';
import {
  buildInteropDashboard,
  MOCK_AUDIT,
  MOCK_CDA_DOCUMENTS,
  MOCK_CODE_SYSTEMS,
  MOCK_CONCEPT_MAPS,
  MOCK_DICOM_STUDIES,
  MOCK_ENDPOINTS,
  MOCK_FHIR_SERVERS,
  MOCK_HL7_MESSAGES,
  MOCK_JOBS,
  MOCK_MAPPINGS,
  MOCK_OAUTH_CLIENTS,
  MOCK_QUEUES,
  MOCK_SMART_APPS,
  MOCK_SUBSCRIPTIONS,
  MOCK_TERMINOLOGY,
  MOCK_VALIDATIONS,
  MOCK_VALUE_SETS,
  MOCK_WEBHOOKS,
  MOCK_API_KEYS,
} from '@/services/interoperability/mock-data';
import type {
  CreateApiClientInput,
  CreateEndpointInput,
  InteropFavorite,
  InteropFilters,
  PublishWebhookInput,
  RegisterSmartAppInput,
  RetryJobInput,
  RunSyncInput,
  UpdateEndpointInput,
  ValidateMappingInput,
} from '@/services/interoperability/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return { items: items.slice(start, start + pageSize), total: items.length, page: page ?? 1, pageSize: pageSize ?? 25 };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

class InteroperabilityRepository {
  private endpoints = [...MOCK_ENDPOINTS];
  private jobs = [...MOCK_JOBS];
  private webhooks = [...MOCK_WEBHOOKS];
  private oauthClients = [...MOCK_OAUTH_CLIENTS];
  private smartApps = [...MOCK_SMART_APPS];
  private mappings = [...MOCK_MAPPINGS];
  private favorites: InteropFavorite[] = [];
  private nextId = 700000;

  getEndpoints(filters?: InteropFilters) {
    let items = this.endpoints;
    if (filters?.facilityId) items = items.filter((e) => e.facilityId === filters.facilityId);
    if (filters?.protocol) items = items.filter((e) => e.protocol === filters.protocol);
    if (filters?.status) items = items.filter((e) => e.status === filters.status);
    if (filters?.q) items = items.filter((e) => matchQ(filters.q, e.name, e.baseUrl));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getFhirServers(filters?: InteropFilters) {
    let items = MOCK_FHIR_SERVERS;
    if (filters?.facilityId) items = items.filter((s) => s.facilityId === filters.facilityId);
    if (filters?.q) items = items.filter((s) => matchQ(filters.q, s.name, s.baseUrl));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getHl7Messages(filters?: InteropFilters) {
    let items = MOCK_HL7_MESSAGES;
    if (filters?.facilityId) items = items.filter((m) => m.facilityId === filters.facilityId);
    if (filters?.messageType) items = items.filter((m) => m.type === filters.messageType);
    if (filters?.status) items = items.filter((m) => m.status === filters.status);
    if (filters?.q) items = items.filter((m) => matchQ(filters.q, m.controlId, m.patientId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDicomStudies(filters?: InteropFilters) {
    let items = MOCK_DICOM_STUDIES;
    if (filters?.facilityId) items = items.filter((s) => s.facilityId === filters.facilityId);
    if (filters?.q) items = items.filter((s) => matchQ(filters.q, s.patientName, s.modality));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getCdaDocuments(filters?: InteropFilters) {
    let items = MOCK_CDA_DOCUMENTS;
    if (filters?.facilityId) items = items.filter((d) => d.facilityId === filters.facilityId);
    if (filters?.q) items = items.filter((d) => matchQ(filters.q, d.type, d.patientId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getMappings(filters?: InteropFilters) {
    let items = this.mappings;
    if (filters?.q) items = items.filter((m) => matchQ(filters.q, m.name, m.sourceEntity));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSubscriptions(filters?: InteropFilters) {
    let items = MOCK_SUBSCRIPTIONS;
    if (filters?.q) items = items.filter((s) => matchQ(filters.q, s.criteria, s.endpoint));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getQueue() {
    return MOCK_QUEUES;
  }

  getJobs(filters?: InteropFilters) {
    let items = this.jobs;
    if (filters?.facilityId) items = items.filter((j) => j.facilityId === filters.facilityId);
    if (filters?.jobStatus) items = items.filter((j) => j.status === filters.jobStatus);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getWebhooks(filters?: InteropFilters) {
    let items = this.webhooks;
    if (filters?.facilityId) items = items.filter((w) => !w.facilityId || w.facilityId === filters.facilityId);
    if (filters?.q) items = items.filter((w) => matchQ(filters.q, w.name, w.url));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getApiClients(filters?: InteropFilters) {
    let items = this.oauthClients;
    if (filters?.q) items = items.filter((c) => matchQ(filters.q, c.name, c.clientId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSmartApps(filters?: InteropFilters) {
    let items = this.smartApps;
    if (filters?.q) items = items.filter((a) => matchQ(filters.q, a.name, a.launchUrl));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAudit(filters?: InteropFilters) {
    let items = MOCK_AUDIT;
    if (filters?.facilityId) items = items.filter((a) => a.facilityId === filters.facilityId);
    if (filters?.q) items = items.filter((a) => matchQ(filters.q, a.action, a.resourceType));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getTerminology() {
    return {
      servers: MOCK_TERMINOLOGY,
      codeSystems: MOCK_CODE_SYSTEMS,
      valueSets: MOCK_VALUE_SETS,
      conceptMaps: MOCK_CONCEPT_MAPS,
    };
  }

  getValidations(filters?: InteropFilters) {
    let items = MOCK_VALIDATIONS;
    if (filters?.q) items = items.filter((v) => matchQ(filters.q, v.resourceType, v.resourceId));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  createEndpoint(input: CreateEndpointInput) {
    const endpoint = {
      endpointId: `ep-${String(++this.nextId)}`,
      name: input.name,
      protocol: input.protocol,
      facilityId: input.facilityId,
      baseUrl: input.baseUrl,
      status: 'active' as const,
      successRate: 100,
      messageCount: 0,
    };
    this.endpoints.unshift(endpoint);
    return endpoint;
  }

  updateEndpoint(input: UpdateEndpointInput) {
    const idx = this.endpoints.findIndex((e) => e.endpointId === input.endpointId);
    if (idx < 0) return null;
    if (input.name) this.endpoints[idx]!.name = input.name;
    if (input.baseUrl) this.endpoints[idx]!.baseUrl = input.baseUrl;
    if (input.status) this.endpoints[idx]!.status = input.status;
    return this.endpoints[idx];
  }

  runSync(input: RunSyncInput) {
    const job = {
      jobId: `job-${String(++this.nextId)}`,
      name: `Sync ${input.endpointId}`,
      endpointId: input.endpointId,
      facilityId: input.facilityId ?? 'fac-001',
      status: 'completed' as const,
      progress: 100,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      retryCount: 0,
    };
    this.jobs.unshift(job);
    return job;
  }

  retryJob(input: RetryJobInput) {
    const idx = this.jobs.findIndex((j) => j.jobId === input.jobId);
    if (idx < 0) return null;
    const job = this.jobs[idx]!;
    if (!shouldRetry(job)) return job;
    this.jobs[idx] = { ...job, status: 'retrying', retryCount: job.retryCount + 1, progress: 0 };
    return this.jobs[idx];
  }

  validateMapping(input: ValidateMappingInput) {
    const profile = this.mappings.find((m) => m.profileId === input.profileId);
    if (!profile) return null;
    profile.validated = validateMappingProfile(profile);
    return profile;
  }

  publishWebhook(input: PublishWebhookInput) {
    const idx = this.webhooks.findIndex((w) => w.webhookId === input.webhookId);
    if (idx < 0) return null;
    this.webhooks[idx]!.status = 'active';
    this.webhooks[idx]!.lastDelivery = new Date().toISOString();
    return this.webhooks[idx];
  }

  createApiClient(input: CreateApiClientInput) {
    const client = {
      clientId: `client-${String(++this.nextId)}`,
      name: input.name,
      grantTypes: ['client_credentials'],
      redirectUris: [],
      status: 'active' as const,
    };
    this.oauthClients.unshift(client);
    const key = {
      keyId: `key-${String(++this.nextId)}`,
      name: `${input.name} Key`,
      prefix: `me_${String(this.nextId).padStart(6, '0')}`,
      createdAt: new Date().toISOString().split('T')[0]!,
      scopes: input.scopes,
    };
    return { client, apiKey: key };
  }

  regenerateApiKey(keyId: string) {
    return {
      keyId,
      prefix: `me_${String(++this.nextId).padStart(6, '0')}`,
      regeneratedAt: new Date().toISOString(),
    };
  }

  registerSmartApp(input: RegisterSmartAppInput) {
    const app = {
      appId: `smart-${String(++this.nextId)}`,
      name: input.name,
      clientId: input.clientId ?? `client-${String(++this.nextId)}`,
      launchUrl: input.launchUrl,
      scopes: input.scopes,
      status: 'active' as const,
      registeredAt: new Date().toISOString().split('T')[0]!,
    };
    this.smartApps.unshift(app);
    return app;
  }

  dashboard(facilityId?: string) {
    return buildInteropDashboard(facilityId);
  }

  analytics(facilityId?: string) {
    return computeInteropAnalytics(facilityId);
  }

  search(query: string, facilityId?: string) {
    const q = query.toLowerCase();
    const matches = (...fields: (string | undefined)[]) => fields.some((f) => f?.toLowerCase().includes(q));
    return {
      endpoints: this.endpoints.filter((e) => (!facilityId || e.facilityId === facilityId) && matches(e.name)).slice(0, 12),
      messages: MOCK_HL7_MESSAGES.filter((m) => (!facilityId || m.facilityId === facilityId) && matches(m.controlId, m.type)).slice(0, 12),
      mappings: this.mappings.filter((m) => matches(m.name)).slice(0, 12),
      webhooks: this.webhooks.filter((w) => matches(w.name)).slice(0, 12),
    };
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return { format, exportedAt: new Date().toISOString(), recordCount: this.endpoints.length + MOCK_HL7_MESSAGES.length };
  }

  favorite(userId: string, entityType: InteropFavorite['entityType'], entityId: string) {
    const fav: InteropFavorite = {
      favoriteId: `fav-${String(++this.nextId)}`,
      userId,
      entityType,
      entityId,
      createdAt: new Date().toISOString(),
    };
    this.favorites.unshift(fav);
    return fav;
  }

  getFavorites(userId: string) {
    return this.favorites.filter((f) => f.userId === userId);
  }

  getApiKeys() {
    return MOCK_API_KEYS;
  }
}

export const interoperabilityRepository = new InteroperabilityRepository();
