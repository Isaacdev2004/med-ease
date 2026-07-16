import {
  ApiClientCard,
  AuditCard,
  CdaDocumentCard,
  DicomStudyCard,
  EndpointCard,
  FhirServerCard,
  HealthDashboard,
  Hl7MessageCard,
  IntegrationTimeline,
  InteropAnalyticsPanel,
  InteropExportToolbar,
  InteropQueueCard,
  MappingCard,
  SmartAppCard,
  SubscriptionCard,
  TerminologyPanel,
  ValidationCard,
  WebhookCard,
} from '@/features/interoperability/components/InteropComponents';
import {
  useApiClients,
  useCdaDocuments,
  useDicomStudies,
  useFhirServers,
  useHl7Messages,
  useIntegrationAudit,
  useIntegrationEndpoints,
  useIntegrationQueue,
  useInteroperabilityAnalytics,
  useInteroperabilityDashboard,
  useMappings,
  useSmartApps,
  useSubscriptions,
  useTerminology,
  useWebhooks,
} from '@/features/interoperability/hooks/use-interoperability';
import { useInteropMutations } from '@/features/interoperability/mutations/interop.mutations';
import type { InteropFilters } from '@/services/interoperability/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Globe } from 'lucide-react';

export type InteropSection =
  | 'dashboard'
  | 'external-records'
  | 'fhir'
  | 'dicom'
  | 'interface-engine'
  | 'queue'
  | 'webhooks'
  | 'api-clients'
  | 'hub'
  | 'fhir-servers'
  | 'hl7'
  | 'cda'
  | 'smart-apps'
  | 'api-gateway'
  | 'terminology'
  | 'audit'
  | 'analytics';

export function DashboardSection({ filters }: { filters?: InteropFilters }) {
  const dashboard = useInteroperabilityDashboard(filters?.facilityId);
  const endpoints = useIntegrationEndpoints(filters);
  const hl7 = useHl7Messages(filters);
  const { runSync } = useInteropMutations();
  if (dashboard.isLoading) return <LoadingView label="Loading integration dashboard…" />;
  if (!dashboard.data) return <EmptyState icon={Globe} title="No integration data" />;
  return (
    <div className="space-y-6">
      <HealthDashboard dashboard={dashboard.data} />
      <IntegrationTimeline jobs={dashboard.data.recentJobs} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(endpoints.data?.items ?? dashboard.data.topEndpoints).slice(0, 6).map((e) => (
          <EndpointCard key={e.endpointId} endpoint={e} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(hl7.data?.items ?? dashboard.data.recentMessages).slice(0, 6).map((m) => (
          <Hl7MessageCard key={m.messageId} message={m} />
        ))}
      </div>
      <button type="button" className="text-sm text-primary underline" onClick={() => runSync.mutate({ endpointId: endpoints.data?.items[0]?.endpointId ?? 'ep-0001', facilityId: filters?.facilityId })}>
        Run sample synchronization
      </button>
    </div>
  );
}

export function ExternalRecordsSection({ filters }: { filters?: InteropFilters }) {
  const cda = useCdaDocuments(filters);
  const fhir = useFhirServers(filters);
  if (cda.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(fhir.data?.items ?? []).slice(0, 4).map((s) => <FhirServerCard key={s.serverId} server={s} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(cda.data?.items ?? []).slice(0, 9).map((d) => <CdaDocumentCard key={d.documentId} doc={d} />)}
      </div>
    </div>
  );
}

export function FhirSection({ filters }: { filters?: InteropFilters }) {
  const servers = useFhirServers(filters);
  const subs = useSubscriptions(filters);
  if (servers.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(servers.data?.items ?? []).slice(0, 9).map((s) => <FhirServerCard key={s.serverId} server={s} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(subs.data?.items ?? []).slice(0, 6).map((s) => <SubscriptionCard key={s.subscriptionId} subscription={s} />)}
      </div>
    </div>
  );
}

export function DicomSection({ filters }: { filters?: InteropFilters }) {
  const studies = useDicomStudies(filters);
  if (studies.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(studies.data?.items ?? []).slice(0, 12).map((s) => <DicomStudyCard key={s.studyId} study={s} />)}
    </div>
  );
}

export function InterfaceEngineSection({ filters }: { filters?: InteropFilters }) {
  const endpoints = useIntegrationEndpoints(filters);
  const mappings = useMappings(filters);
  const { validateMapping } = useInteropMutations();
  if (endpoints.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(endpoints.data?.items ?? []).slice(0, 9).map((e) => <EndpointCard key={e.endpointId} endpoint={e} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(mappings.data?.items ?? []).slice(0, 6).map((m) => (
          <MappingCard key={m.profileId} mapping={m} />
        ))}
      </div>
      <button type="button" className="text-sm text-primary underline" onClick={() => validateMapping.mutate({ profileId: mappings.data?.items[0]?.profileId ?? '' })}>
        Validate sample mapping
      </button>
    </div>
  );
}

export function QueueSection() {
  const queue = useIntegrationQueue();
  const { retryJob } = useInteropMutations();
  if (queue.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(queue.data ?? []).map((q) => <InteropQueueCard key={q.queueId} queue={q} />)}
      </div>
      <button type="button" className="text-sm text-primary underline" onClick={() => retryJob.mutate({ jobId: 'job-0001' })}>
        Retry failed job
      </button>
    </div>
  );
}

export function WebhooksSection({ filters }: { filters?: InteropFilters }) {
  const webhooks = useWebhooks(filters);
  const { publishWebhook } = useInteropMutations();
  if (webhooks.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(webhooks.data?.items ?? []).slice(0, 12).map((w) => <WebhookCard key={w.webhookId} webhook={w} />)}
      </div>
      <button type="button" className="text-sm text-primary underline" onClick={() => publishWebhook.mutate({ webhookId: webhooks.data?.items[0]?.webhookId ?? '' })}>
        Publish sample webhook
      </button>
    </div>
  );
}

export function ApiClientsSection({ filters }: { filters?: InteropFilters }) {
  const clients = useApiClients(filters);
  const { createApiClient } = useInteropMutations();
  if (clients.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(clients.data?.items ?? []).slice(0, 9).map((c) => <ApiClientCard key={c.clientId} client={c} />)}
      </div>
      <button type="button" className="text-sm text-primary underline" onClick={() => createApiClient.mutate({ name: 'Partner Integration', scopes: ['interop.read', 'fhir.read'], facilityId: filters?.facilityId })}>
        Create API client
      </button>
    </div>
  );
}

export function HubSection({ filters }: { filters?: InteropFilters }) {
  return <DashboardSection filters={filters} />;
}

export function FhirServersSection({ filters }: { filters?: InteropFilters }) {
  return <FhirSection filters={filters} />;
}

export function Hl7Section({ filters }: { filters?: InteropFilters }) {
  const messages = useHl7Messages(filters);
  if (messages.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(messages.data?.items ?? []).slice(0, 12).map((m) => <Hl7MessageCard key={m.messageId} message={m} />)}
    </div>
  );
}

export function CdaSection({ filters }: { filters?: InteropFilters }) {
  const docs = useCdaDocuments(filters);
  if (docs.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(docs.data?.items ?? []).slice(0, 12).map((d) => <CdaDocumentCard key={d.documentId} doc={d} />)}
    </div>
  );
}

export function SmartAppsSection({ filters }: { filters?: InteropFilters }) {
  const apps = useSmartApps(filters);
  const { registerSmartApp } = useInteropMutations();
  if (apps.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(apps.data?.items ?? []).slice(0, 9).map((a) => <SmartAppCard key={a.appId} app={a} />)}
      </div>
      <button type="button" className="text-sm text-primary underline" onClick={() => registerSmartApp.mutate({ name: 'Clinical Viewer', launchUrl: 'https://apps.example.com/launch', scopes: ['patient/*.read', 'launch'] })}>
        Register SMART app
      </button>
    </div>
  );
}

export function ApiGatewaySection({ filters }: { filters?: InteropFilters }) {
  const clients = useApiClients(filters);
  if (clients.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(clients.data?.items ?? []).slice(0, 12).map((c) => <ApiClientCard key={c.clientId} client={c} />)}
    </div>
  );
}

export function TerminologySection() {
  const terminology = useTerminology();
  if (terminology.isLoading) return <LoadingView />;
  if (!terminology.data) return <EmptyState title="No terminology data" />;
  return (
    <div className="space-y-6">
      <TerminologyPanel servers={terminology.data.servers} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {terminology.data.codeSystems.slice(0, 4).map((cs) => (
          <ValidationCard key={cs.systemId} result={{ validationId: cs.systemId, resourceType: 'CodeSystem', resourceId: cs.systemId, status: 'valid', issueCount: 0, validatedAt: new Date().toISOString(), issues: [] }} />
        ))}
      </div>
    </div>
  );
}

export function AuditSection({ filters }: { filters?: InteropFilters }) {
  const audit = useIntegrationAudit(filters);
  if (audit.isLoading) return <LoadingView />;
  return (
    <div className="space-y-2">
      {(audit.data?.items ?? []).slice(0, 15).map((log) => <AuditCard key={log.auditId} log={log} />)}
    </div>
  );
}

export function AnalyticsSection({ filters }: { filters?: InteropFilters }) {
  const analytics = useInteroperabilityAnalytics(filters?.facilityId);
  const { exportData } = useInteropMutations();
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return <EmptyState title="No analytics data" />;
  return (
    <div className="space-y-6">
      <InteropAnalyticsPanel analytics={analytics.data} />
      <InteropExportToolbar onExport={(f) => exportData.mutate(f)} />
    </div>
  );
}

export function InteropSectionContent({ section, filters }: { section: InteropSection; filters?: InteropFilters }) {
  switch (section) {
    case 'external-records': return <ExternalRecordsSection filters={filters} />;
    case 'fhir': return <FhirSection filters={filters} />;
    case 'dicom': return <DicomSection filters={filters} />;
    case 'interface-engine': return <InterfaceEngineSection filters={filters} />;
    case 'queue': return <QueueSection />;
    case 'webhooks': return <WebhooksSection filters={filters} />;
    case 'api-clients': return <ApiClientsSection filters={filters} />;
    case 'hub': return <HubSection filters={filters} />;
    case 'fhir-servers': return <FhirServersSection filters={filters} />;
    case 'hl7': return <Hl7Section filters={filters} />;
    case 'cda': return <CdaSection filters={filters} />;
    case 'smart-apps': return <SmartAppsSection filters={filters} />;
    case 'api-gateway': return <ApiGatewaySection filters={filters} />;
    case 'terminology': return <TerminologySection />;
    case 'audit': return <AuditSection filters={filters} />;
    case 'analytics': return <AnalyticsSection filters={filters} />;
    default: return <DashboardSection filters={filters} />;
  }
}
