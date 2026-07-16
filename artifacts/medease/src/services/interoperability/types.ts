export type EndpointStatus = 'active' | 'inactive' | 'error' | 'maintenance';
export type EndpointProtocol = 'fhir' | 'hl7' | 'dicom' | 'cda' | 'rest' | 'graphql' | 'webhook';
export type FhirVersion = 'R4' | 'R4B' | 'R5';
export type Hl7MessageType = 'ADT' | 'ORM' | 'ORU' | 'SIU' | 'DFT' | 'BAR' | 'RDE' | 'VXU' | 'MDM';
export type Hl7MessageStatus = 'received' | 'processed' | 'failed' | 'acknowledged' | 'queued';
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'retrying' | 'dead_letter';
export type SyncState = 'idle' | 'syncing' | 'success' | 'conflict' | 'error';
export type ValidationStatus = 'valid' | 'invalid' | 'warning';
export type IheProfile = 'XDS' | 'XCA' | 'PIX' | 'PDQ' | 'XCPD' | 'ATNA' | 'BPPC';
export type MappingDirection = 'internal_to_fhir' | 'internal_to_hl7' | 'internal_to_cda' | 'internal_to_dicom' | 'internal_to_json' | 'internal_to_csv';

export interface InteropFilters {
  q?: string;
  facilityId?: string;
  protocol?: EndpointProtocol;
  status?: string;
  messageType?: Hl7MessageType;
  jobStatus?: JobStatus;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IntegrationEndpoint {
  endpointId: string;
  name: string;
  protocol: EndpointProtocol;
  facilityId?: string;
  baseUrl: string;
  status: EndpointStatus;
  lastSync?: string;
  successRate: number;
  messageCount: number;
}

export interface FhirServer {
  serverId: string;
  name: string;
  baseUrl: string;
  version: FhirVersion;
  facilityId?: string;
  status: EndpointStatus;
  resourceCount: number;
  lastTransaction?: string;
}

export interface Hl7Message {
  messageId: string;
  type: Hl7MessageType;
  facilityId: string;
  patientId?: string;
  controlId: string;
  status: Hl7MessageStatus;
  receivedAt: string;
  segmentCount: number;
  rawPreview: string;
}

export interface Hl7Batch {
  batchId: string;
  messageCount: number;
  facilityId: string;
  status: JobStatus;
  processedAt: string;
}

export interface FhirResource {
  resourceId: string;
  resourceType: string;
  patientId?: string;
  facilityId?: string;
  lastUpdated: string;
  versionId: string;
}

export interface FhirBundle {
  bundleId: string;
  type: 'transaction' | 'batch' | 'searchset' | 'collection';
  entryCount: number;
  facilityId?: string;
  createdAt: string;
  status: JobStatus;
}

export interface FhirTransaction {
  transactionId: string;
  serverId: string;
  operation: 'create' | 'update' | 'delete' | 'search' | 'bulk_export' | 'bulk_import';
  resourceCount: number;
  status: JobStatus;
  timestamp: string;
}

export interface DicomStudy {
  studyId: string;
  studyInstanceUid: string;
  patientId: string;
  patientName: string;
  facilityId: string;
  modality: string;
  seriesCount: number;
  instanceCount: number;
  status: SyncState;
  receivedAt: string;
}

export interface DicomSeries {
  seriesId: string;
  studyId: string;
  modality: string;
  instanceCount: number;
}

export interface DicomInstance {
  instanceId: string;
  seriesId: string;
  sopInstanceUid: string;
  sizeBytes: number;
}

export interface CdaDocument {
  documentId: string;
  type: 'CCD' | 'C-CDA' | 'Discharge Summary' | 'Referral';
  patientId: string;
  facilityId: string;
  author: string;
  createdAt: string;
  validated: boolean;
}

export interface IntegrationJob {
  jobId: string;
  name: string;
  endpointId: string;
  facilityId: string;
  status: JobStatus;
  progress: number;
  startedAt: string;
  completedAt?: string;
  retryCount: number;
}

export interface IntegrationQueue {
  queueId: string;
  name: string;
  pendingCount: number;
  failedCount: number;
  throughputPerHour: number;
}

export interface IntegrationEvent {
  eventId: string;
  type: string;
  endpointId: string;
  timestamp: string;
  payload: string;
  status: JobStatus;
}

export interface Webhook {
  webhookId: string;
  name: string;
  url: string;
  facilityId?: string;
  events: string[];
  status: EndpointStatus;
  lastDelivery?: string;
  successRate: number;
}

export interface ApiKey {
  keyId: string;
  name: string;
  prefix: string;
  createdAt: string;
  expiresAt?: string;
  scopes: string[];
}

export interface OAuthClient {
  clientId: string;
  name: string;
  grantTypes: string[];
  redirectUris: string[];
  status: EndpointStatus;
}

export interface SmartApp {
  appId: string;
  name: string;
  clientId: string;
  launchUrl: string;
  scopes: string[];
  status: EndpointStatus;
  registeredAt: string;
}

export interface Subscription {
  subscriptionId: string;
  channel: 'fhir' | 'webhook' | 'queue';
  criteria: string;
  endpoint: string;
  status: EndpointStatus;
  deliveryCount: number;
}

export interface MessageBroker {
  brokerId: string;
  name: string;
  type: 'kafka' | 'rabbitmq' | 'sqs' | 'redis';
  status: EndpointStatus;
  queueCount: number;
}

export interface TerminologyServer {
  serverId: string;
  name: string;
  url: string;
  systems: string[];
  status: EndpointStatus;
}

export interface CodeSystem {
  systemId: string;
  url: string;
  name: string;
  conceptCount: number;
}

export interface ValueSet {
  valueSetId: string;
  name: string;
  codeSystemUrl: string;
  conceptCount: number;
}

export interface ConceptMap {
  mapId: string;
  name: string;
  sourceSystem: string;
  targetSystem: string;
  mappingCount: number;
}

export interface MappingProfile {
  profileId: string;
  name: string;
  direction: MappingDirection;
  sourceEntity: string;
  targetFormat: string;
  fieldCount: number;
  validated: boolean;
}

export interface ValidationResult {
  validationId: string;
  resourceType: string;
  resourceId: string;
  status: ValidationStatus;
  issueCount: number;
  validatedAt: string;
  issues: string[];
}

export interface AuditLog {
  auditId: string;
  action: string;
  actorId: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  facilityId?: string;
  outcome: 'success' | 'failure';
}

export interface SyncStatus {
  syncId: string;
  endpointId: string;
  state: SyncState;
  lastSync: string;
  recordsSynced: number;
  conflicts: number;
}

export interface HealthInformationExchange {
  hieId: string;
  name: string;
  region: string;
  participantCount: number;
  status: EndpointStatus;
  protocols: EndpointProtocol[];
}

export interface InteropAnalytics {
  messageVolume: number;
  successRate: number;
  avgLatencyMs: number;
  activeEndpoints: number;
  failedJobs: number;
  volumeTrend: { label: string; value: number }[];
  protocolDistribution: { label: string; value: number }[];
  topEndpoints: { label: string; value: number }[];
  errorTrend: { label: string; value: number }[];
}

export interface InteropDashboard {
  facilityId?: string;
  activeEndpoints: number;
  messagesToday: number;
  fhirTransactions: number;
  hl7Processed: number;
  dicomStudies: number;
  failedJobs: number;
  queueDepth: number;
  recentJobs: IntegrationJob[];
  recentMessages: Hl7Message[];
  topEndpoints: IntegrationEndpoint[];
}

export interface InteropPermissions {
  canView: boolean;
  canWrite: boolean;
  canManageFhir: boolean;
  canManageHl7: boolean;
  canManageDicom: boolean;
  canManageApi: boolean;
  canManageMapping: boolean;
  canViewAudit: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface InteropFavorite {
  favoriteId: string;
  userId: string;
  entityType: 'endpoint' | 'mapping' | 'webhook' | 'fhir_server' | 'smart_app';
  entityId: string;
  createdAt: string;
}

export interface CreateEndpointInput {
  name: string;
  protocol: EndpointProtocol;
  baseUrl: string;
  facilityId?: string;
}

export interface UpdateEndpointInput {
  endpointId: string;
  name?: string;
  baseUrl?: string;
  status?: EndpointStatus;
}

export interface RunSyncInput {
  endpointId: string;
  facilityId?: string;
  incremental?: boolean;
}

export interface RetryJobInput {
  jobId: string;
}

export interface ValidateMappingInput {
  profileId: string;
}

export interface PublishWebhookInput {
  webhookId: string;
}

export interface CreateApiClientInput {
  name: string;
  scopes: string[];
  facilityId?: string;
}

export interface RegisterSmartAppInput {
  name: string;
  launchUrl: string;
  scopes: string[];
  clientId?: string;
}
