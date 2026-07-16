import { FHIR_RESOURCE_TYPES } from '@/services/interoperability/fhir-engine';
import { DICOM_MODALITIES } from '@/services/interoperability/dicom-engine';
import { CDA_TYPES } from '@/services/interoperability/cda-engine';
import type {
  ApiKey,
  AuditLog,
  CdaDocument,
  CodeSystem,
  ConceptMap,
  DicomStudy,
  EndpointProtocol,
  FhirBundle,
  FhirServer,
  FhirTransaction,
  HealthInformationExchange,
  Hl7Message,
  Hl7MessageType,
  IntegrationEndpoint,
  IntegrationJob,
  IntegrationQueue,
  InteropDashboard,
  MappingProfile,
  MappingDirection,
  OAuthClient,
  SmartApp,
  Subscription,
  SyncStatus,
  TerminologyServer,
  ValidationResult,
  ValueSet,
  Webhook,
} from '@/services/interoperability/types';

const FACILITIES = Array.from({ length: 25 }, (_, i) => `fac-${String(i + 1).padStart(3, '0')}`);
const PROTOCOLS: EndpointProtocol[] = ['fhir', 'hl7', 'dicom', 'cda', 'rest', 'webhook'];
const HL7_TYPES: Hl7MessageType[] = ['ADT', 'ORM', 'ORU', 'SIU', 'DFT', 'BAR', 'RDE', 'VXU', 'MDM'];
const JOB_STATUSES = ['pending', 'running', 'completed', 'failed', 'retrying', 'dead_letter'] as const;
const MAPPING_DIRECTIONS: MappingDirection[] = ['internal_to_fhir', 'internal_to_hl7', 'internal_to_cda', 'internal_to_dicom', 'internal_to_json', 'internal_to_csv'];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_ENDPOINTS: IntegrationEndpoint[] = Array.from({ length: 200 }, (_, i) => {
  const protocol = PROTOCOLS[i % PROTOCOLS.length]!;
  return {
    endpointId: `ep-${String(i + 1).padStart(4, '0')}`,
    name: `${protocol.toUpperCase()} Endpoint ${(i % 40) + 1}`,
    protocol,
    facilityId: FACILITIES[i % 25],
    baseUrl: `https://integration-${(i % 40) + 1}.medease.local/${protocol}`,
    status: (['active', 'active', 'inactive', 'error', 'maintenance'] as const)[i % 5]!,
    lastSync: i % 4 === 0 ? undefined : daysAgo(i % 7),
    successRate: 85 + (i % 14),
    messageCount: 1000 + (i % 500) * 10,
  };
});

export const MOCK_FHIR_SERVERS: FhirServer[] = Array.from({ length: 80 }, (_, i) => ({
  serverId: `fhir-${String(i + 1).padStart(3, '0')}`,
  name: `FHIR Server ${i + 1}`,
  baseUrl: `https://fhir-${(i % 20) + 1}.medease.local/r4`,
  version: (['R4', 'R4B', 'R5'] as const)[i % 3]!,
  facilityId: FACILITIES[i % 25],
  status: i % 9 === 0 ? 'error' : 'active',
  resourceCount: 5000 + (i % 100) * 100,
  lastTransaction: daysAgo(i % 3),
}));

export const MOCK_HL7_MESSAGES: Hl7Message[] = Array.from({ length: 3000 }, (_, i) => {
  const type = HL7_TYPES[i % HL7_TYPES.length]!;
  return {
    messageId: `hl7-${String(i + 1).padStart(5, '0')}`,
    type,
    facilityId: FACILITIES[i % 25]!,
    patientId: `phr-${String((i % 3000) + 1).padStart(4, '0')}`,
    controlId: `CTRL${String(i + 1).padStart(8, '0')}`,
    status: (['received', 'processed', 'failed', 'acknowledged', 'queued'] as const)[i % 5]!,
    receivedAt: daysAgo(i % 14),
    segmentCount: 5 + (i % 20),
    rawPreview: `MSH|^~\\&|SEND|FAC|REC|SYS|${daysAgo(0)}||${type}^A01|${i}|P|2.5`,
  };
});

export const MOCK_FHIR_BUNDLES: FhirBundle[] = Array.from({ length: 800 }, (_, i) => ({
  bundleId: `bundle-${String(i + 1).padStart(4, '0')}`,
  type: (['transaction', 'batch', 'searchset', 'collection'] as const)[i % 4]!,
  entryCount: 1 + (i % 50),
  facilityId: FACILITIES[i % 25],
  createdAt: daysAgo(i % 30),
  status: JOB_STATUSES[i % JOB_STATUSES.length]!,
}));

export const MOCK_DICOM_STUDIES: DicomStudy[] = Array.from({ length: 600 }, (_, i) => ({
  studyId: `dcm-${String(i + 1).padStart(4, '0')}`,
  studyInstanceUid: `1.2.840.${100000 + i}`,
  patientId: `phr-${String((i % 2000) + 1).padStart(4, '0')}`,
  patientName: `Patient ${(i % 2000) + 1}`,
  facilityId: FACILITIES[i % 25]!,
  modality: DICOM_MODALITIES[i % DICOM_MODALITIES.length]!,
  seriesCount: 1 + (i % 8),
  instanceCount: 10 + (i % 200),
  status: (['idle', 'syncing', 'success', 'conflict', 'error'] as const)[i % 5]!,
  receivedAt: daysAgo(i % 10),
}));

export const MOCK_CDA_DOCUMENTS: CdaDocument[] = Array.from({ length: 400 }, (_, i) => ({
  documentId: `cda-${String(i + 1).padStart(4, '0')}`,
  type: CDA_TYPES[i % CDA_TYPES.length]!,
  patientId: `phr-${String((i % 2000) + 1).padStart(4, '0')}`,
  facilityId: FACILITIES[i % 25]!,
  author: `prov-${String((i % 100) + 1).padStart(4, '0')}`,
  createdAt: daysAgo(i % 60).split('T')[0]!,
  validated: i % 5 !== 0,
}));

export const MOCK_JOBS: IntegrationJob[] = Array.from({ length: 800 }, (_, i) => ({
  jobId: `job-${String(i + 1).padStart(4, '0')}`,
  name: `Sync Job ${(i % 50) + 1}`,
  endpointId: `ep-${String((i % 200) + 1).padStart(4, '0')}`,
  facilityId: FACILITIES[i % 25]!,
  status: JOB_STATUSES[i % JOB_STATUSES.length]!,
  progress: i % 6 === 2 ? 100 : (i % 100),
  startedAt: daysAgo(i % 5),
  completedAt: i % 6 === 2 ? daysAgo(i % 5) : undefined,
  retryCount: i % 4,
}));

export const MOCK_WEBHOOKS: Webhook[] = Array.from({ length: 120 }, (_, i) => ({
  webhookId: `wh-${String(i + 1).padStart(4, '0')}`,
  name: `Webhook ${i + 1}`,
  url: `https://partner-${(i % 30) + 1}.example.com/hooks/med-ease`,
  facilityId: i % 3 === 0 ? FACILITIES[i % 25] : undefined,
  events: ['Patient.created', 'Observation.updated', 'Appointment.scheduled'].slice(0, 1 + (i % 3)),
  status: i % 8 === 0 ? 'error' : 'active',
  lastDelivery: daysAgo(i % 3),
  successRate: 90 + (i % 10),
}));

export const MOCK_OAUTH_CLIENTS: OAuthClient[] = Array.from({ length: 60 }, (_, i) => ({
  clientId: `client-${String(i + 1).padStart(4, '0')}`,
  name: `API Client ${i + 1}`,
  grantTypes: ['client_credentials', 'authorization_code'].slice(0, 1 + (i % 2)),
  redirectUris: [`https://app-${i + 1}.example.com/callback`],
  status: i % 10 === 0 ? 'inactive' : 'active',
}));

export const MOCK_SMART_APPS: SmartApp[] = Array.from({ length: 50 }, (_, i) => ({
  appId: `smart-${String(i + 1).padStart(3, '0')}`,
  name: `SMART App ${i + 1}`,
  clientId: `client-${String((i % 60) + 1).padStart(4, '0')}`,
  launchUrl: `https://smart-app-${i + 1}.example.com/launch`,
  scopes: ['patient/*.read', 'user/*.read', 'launch'].slice(0, 2 + (i % 2)),
  status: 'active',
  registeredAt: daysAgo(i % 365).split('T')[0]!,
}));

export const MOCK_SUBSCRIPTIONS: Subscription[] = Array.from({ length: 100 }, (_, i) => ({
  subscriptionId: `sub-${String(i + 1).padStart(4, '0')}`,
  channel: (['fhir', 'webhook', 'queue'] as const)[i % 3]!,
  criteria: `Observation?code=${1000 + (i % 50)}`,
  endpoint: `https://notify-${(i % 20) + 1}.example.com/events`,
  status: i % 7 === 0 ? 'inactive' : 'active',
  deliveryCount: i % 500,
}));

export const MOCK_MAPPINGS: MappingProfile[] = Array.from({ length: 200 }, (_, i) => ({
  profileId: `map-${String(i + 1).padStart(4, '0')}`,
  name: `Mapping ${FHIR_RESOURCE_TYPES[i % FHIR_RESOURCE_TYPES.length]} ${i + 1}`,
  direction: MAPPING_DIRECTIONS[i % MAPPING_DIRECTIONS.length]!,
  sourceEntity: ['Patient', 'Observation', 'Encounter', 'MedicationRequest', 'DiagnosticReport'][i % 5]!,
  targetFormat: MAPPING_DIRECTIONS[i % MAPPING_DIRECTIONS.length]!.split('_').pop()!.toUpperCase(),
  fieldCount: 10 + (i % 40),
  validated: i % 4 !== 0,
}));

export const MOCK_AUDIT: AuditLog[] = Array.from({ length: 1000 }, (_, i) => ({
  auditId: `aud-${String(i + 1).padStart(5, '0')}`,
  action: ['read', 'create', 'update', 'delete', 'export', 'sync'][i % 6]!,
  actorId: `prov-${String((i % 200) + 1).padStart(4, '0')}`,
  resourceType: FHIR_RESOURCE_TYPES[i % FHIR_RESOURCE_TYPES.length]!,
  resourceId: `res-${String(i + 1).padStart(5, '0')}`,
  timestamp: daysAgo(i % 90),
  facilityId: FACILITIES[i % 25],
  outcome: i % 12 === 0 ? 'failure' : 'success',
}));

export const MOCK_VALIDATIONS: ValidationResult[] = Array.from({ length: 100 }, (_, i) => ({
  validationId: `val-${String(i + 1).padStart(4, '0')}`,
  resourceType: FHIR_RESOURCE_TYPES[i % FHIR_RESOURCE_TYPES.length]!,
  resourceId: `res-${String(i + 1).padStart(5, '0')}`,
  status: (['valid', 'warning', 'invalid'] as const)[i % 3]!,
  issueCount: i % 5,
  validatedAt: daysAgo(i % 14),
  issues: i % 5 === 0 ? [] : [`Issue ${i + 1}: terminology binding`],
}));

export const MOCK_SYNC_STATUS: SyncStatus[] = MOCK_ENDPOINTS.slice(0, 50).map((ep, i) => ({
  syncId: `sync-${String(i + 1).padStart(3, '0')}`,
  endpointId: ep.endpointId,
  state: (['idle', 'syncing', 'success', 'conflict', 'error'] as const)[i % 5]!,
  lastSync: daysAgo(i % 7),
  recordsSynced: 100 + (i % 1000),
  conflicts: i % 10,
}));

export const MOCK_QUEUES: IntegrationQueue[] = [
  { queueId: 'q-hl7-inbound', name: 'HL7 Inbound', pendingCount: 245, failedCount: 12, throughputPerHour: 1200 },
  { queueId: 'q-fhir-transactions', name: 'FHIR Transactions', pendingCount: 89, failedCount: 3, throughputPerHour: 800 },
  { queueId: 'q-dicom-stow', name: 'DICOM STOW-RS', pendingCount: 34, failedCount: 1, throughputPerHour: 150 },
  { queueId: 'q-dead-letter', name: 'Dead Letter', pendingCount: 18, failedCount: 18, throughputPerHour: 0 },
];

export const MOCK_TERMINOLOGY: TerminologyServer[] = [
  { serverId: 'term-001', name: 'SNOMED CT', url: 'https://terminology.medease.local/snomed', systems: ['http://snomed.info/sct'], status: 'active' },
  { serverId: 'term-002', name: 'LOINC', url: 'https://terminology.medease.local/loinc', systems: ['http://loinc.org'], status: 'active' },
  { serverId: 'term-003', name: 'RxNorm', url: 'https://terminology.medease.local/rxnorm', systems: ['http://www.nlm.nih.gov/research/umls/rxnorm'], status: 'active' },
  { serverId: 'term-004', name: 'ICD-10', url: 'https://terminology.medease.local/icd10', systems: ['http://hl7.org/fhir/sid/icd-10'], status: 'active' },
];

export const MOCK_CODE_SYSTEMS: CodeSystem[] = MOCK_TERMINOLOGY.map((t, i) => ({
  systemId: `cs-${String(i + 1).padStart(3, '0')}`,
  url: t.systems[0]!,
  name: t.name,
  conceptCount: 10000 + i * 5000,
}));

export const MOCK_VALUE_SETS: ValueSet[] = Array.from({ length: 30 }, (_, i) => ({
  valueSetId: `vs-${String(i + 1).padStart(3, '0')}`,
  name: `ValueSet ${i + 1}`,
  codeSystemUrl: MOCK_CODE_SYSTEMS[i % 4]!.url,
  conceptCount: 50 + (i % 200),
}));

export const MOCK_CONCEPT_MAPS: ConceptMap[] = Array.from({ length: 20 }, (_, i) => ({
  mapId: `cm-${String(i + 1).padStart(3, '0')}`,
  name: `Concept Map ${i + 1}`,
  sourceSystem: MOCK_CODE_SYSTEMS[i % 4]!.url,
  targetSystem: MOCK_CODE_SYSTEMS[(i + 1) % 4]!.url,
  mappingCount: 100 + (i % 500),
}));

export const MOCK_HIE: HealthInformationExchange[] = Array.from({ length: 10 }, (_, i) => ({
  hieId: `hie-${String(i + 1).padStart(3, '0')}`,
  name: `Regional HIE ${i + 1}`,
  region: `Region ${i + 1}`,
  participantCount: 10 + (i % 50),
  status: 'active',
  protocols: ['fhir', 'hl7', 'cda'].slice(0, 2 + (i % 2)) as EndpointProtocol[],
}));

export const MOCK_FHIR_TRANSACTIONS: FhirTransaction[] = Array.from({ length: 200 }, (_, i) => ({
  transactionId: `txn-${String(i + 1).padStart(4, '0')}`,
  serverId: `fhir-${String((i % 80) + 1).padStart(3, '0')}`,
  operation: (['create', 'update', 'delete', 'search', 'bulk_export', 'bulk_import'] as const)[i % 6]!,
  resourceCount: 1 + (i % 100),
  status: JOB_STATUSES[i % JOB_STATUSES.length]!,
  timestamp: daysAgo(i % 7),
}));

export const MOCK_API_KEYS: ApiKey[] = Array.from({ length: 40 }, (_, i) => ({
  keyId: `key-${String(i + 1).padStart(3, '0')}`,
  name: `API Key ${i + 1}`,
  prefix: `me_${String(i + 1).padStart(6, '0')}`,
  createdAt: daysAgo(i % 180).split('T')[0]!,
  expiresAt: i % 3 === 0 ? undefined : daysAgo(-365).split('T')[0],
  scopes: ['interop.read', 'fhir.read', 'hl7.write'].slice(0, 1 + (i % 3)),
}));

export function buildInteropDashboard(facilityId?: string): InteropDashboard {
  const endpoints = facilityId ? MOCK_ENDPOINTS.filter((e) => e.facilityId === facilityId) : MOCK_ENDPOINTS;
  const messages = facilityId ? MOCK_HL7_MESSAGES.filter((m) => m.facilityId === facilityId) : MOCK_HL7_MESSAGES;
  const jobs = facilityId ? MOCK_JOBS.filter((j) => j.facilityId === facilityId) : MOCK_JOBS;
  const studies = facilityId ? MOCK_DICOM_STUDIES.filter((s) => s.facilityId === facilityId) : MOCK_DICOM_STUDIES;
  return {
    facilityId,
    activeEndpoints: endpoints.filter((e) => e.status === 'active').length,
    messagesToday: Math.round(messages.length / 30),
    fhirTransactions: MOCK_FHIR_TRANSACTIONS.length,
    hl7Processed: messages.filter((m) => m.status === 'processed').length,
    dicomStudies: studies.length,
    failedJobs: jobs.filter((j) => j.status === 'failed' || j.status === 'dead_letter').length,
    queueDepth: MOCK_QUEUES.reduce((s, q) => s + q.pendingCount, 0),
    recentJobs: jobs.slice(0, 8),
    recentMessages: messages.slice(0, 8),
    topEndpoints: [...endpoints].sort((a, b) => b.messageCount - a.messageCount).slice(0, 6),
  };
}
