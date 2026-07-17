import { format } from 'date-fns';
import {
  Activity,
  Globe,
  Key,
  Link2,
  Radio,
  Server,
  Webhook as WebhookIcon,
} from 'lucide-react';

import type {
  ApiKey,
  AuditLog,
  CdaDocument,
  DicomStudy,
  FhirServer,
  Hl7Message,
  IntegrationEndpoint,
  IntegrationJob,
  IntegrationQueue,
  InteropAnalytics,
  InteropDashboard,
  MappingProfile,
  OAuthClient,
  SmartApp,
  Subscription,
  SyncStatus,
  ValidationResult,
  Webhook,
} from '@/services/interoperability/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

const statusVariant = {
  active: 'default',
  inactive: 'outline',
  error: 'destructive',
  maintenance: 'secondary',
} as const;
const jobVariant = {
  pending: 'outline',
  running: 'secondary',
  completed: 'default',
  failed: 'destructive',
  retrying: 'secondary',
  dead_letter: 'destructive',
} as const;

export function HealthDashboard({
  dashboard,
}: {
  dashboard: InteropDashboard;
}) {
  const metrics = [
    {
      label: 'Active Endpoints',
      value: dashboard.activeEndpoints,
      icon: Server,
    },
    {
      label: 'Messages Today',
      value: dashboard.messagesToday.toLocaleString(),
      icon: Activity,
    },
    {
      label: 'FHIR Transactions',
      value: dashboard.fhirTransactions.toLocaleString(),
      icon: Globe,
    },
    {
      label: 'HL7 Processed',
      value: dashboard.hl7Processed.toLocaleString(),
      icon: Radio,
    },
    {
      label: 'DICOM Studies',
      value: dashboard.dicomStudies.toLocaleString(),
      icon: Link2,
    },
    {
      label: 'Queue Depth',
      value: dashboard.queueDepth.toLocaleString(),
      icon: WebhookIcon,
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((m) => (
        <Card key={m.label}>
          <CardContent className="pt-4 flex items-center gap-3">
            <m.icon className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export const IntegrationCard = EndpointCard;
export function EndpointCard({ endpoint }: { endpoint: IntegrationEndpoint }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{endpoint.name}</span>
          <Badge
            variant={statusVariant[endpoint.status]}
            className="capitalize"
          >
            {endpoint.status}
          </Badge>
        </div>
        <p className="text-muted-foreground uppercase text-xs">
          {endpoint.protocol}
        </p>
        <p className="text-xs truncate">{endpoint.baseUrl}</p>
        <p className="text-xs">
          {endpoint.successRate}% success ·{' '}
          {endpoint.messageCount.toLocaleString()} messages
        </p>
      </CardContent>
    </Card>
  );
}

export function FhirServerCard({ server }: { server: FhirServer }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{server.name}</span>
          <Badge variant="outline">{server.version}</Badge>
        </div>
        <p className="text-xs truncate">{server.baseUrl}</p>
        <p className="text-xs">
          {server.resourceCount.toLocaleString()} resources
        </p>
      </CardContent>
    </Card>
  );
}

export function Hl7MessageCard({ message }: { message: Hl7Message }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{message.type}</span>
          <Badge className="capitalize">{message.status}</Badge>
        </div>
        <p className="text-muted-foreground">{message.controlId}</p>
        <p className="text-xs font-mono truncate">{message.rawPreview}</p>
        <p className="text-xs">
          {format(new Date(message.receivedAt), 'MMM d, yyyy HH:mm')}
        </p>
      </CardContent>
    </Card>
  );
}

export function DicomStudyCard({ study }: { study: DicomStudy }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{study.patientName}</span>
          <Badge variant="outline">{study.modality}</Badge>
        </div>
        <p className="text-xs">
          {study.seriesCount} series · {study.instanceCount} instances
        </p>
        <Badge className="capitalize">{study.status}</Badge>
      </CardContent>
    </Card>
  );
}

export function WebhookCard({ webhook }: { webhook: Webhook }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{webhook.name}</span>
          <Badge variant={statusVariant[webhook.status]} className="capitalize">
            {webhook.status}
          </Badge>
        </div>
        <p className="text-xs truncate">{webhook.url}</p>
        <p className="text-xs">{webhook.successRate}% delivery success</p>
      </CardContent>
    </Card>
  );
}

export function ApiClientCard({ client }: { client: OAuthClient }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{client.name}</span>
          <Badge variant={statusVariant[client.status]} className="capitalize">
            {client.status}
          </Badge>
        </div>
        <p className="text-xs font-mono">{client.clientId}</p>
        <p className="text-xs">{client.grantTypes.join(', ')}</p>
      </CardContent>
    </Card>
  );
}

export const OAuthClientCard = ApiClientCard;

export function SmartAppCard({ app }: { app: SmartApp }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{app.name}</span>
          <Badge variant="outline">SMART</Badge>
        </div>
        <p className="text-xs truncate">{app.launchUrl}</p>
        <p className="text-xs">{app.scopes.join(' · ')}</p>
      </CardContent>
    </Card>
  );
}

export function InteropQueueCard({ queue }: { queue: IntegrationQueue }) {
  return (
    <Card className={cn(queue.failedCount > 10 && 'border-destructive/50')}>
      <CardContent className="pt-4 text-sm space-y-2">
        <span className="font-medium">{queue.name}</span>
        <p className="text-muted-foreground">
          {queue.pendingCount} pending · {queue.failedCount} failed
        </p>
        <p className="text-xs">{queue.throughputPerHour}/hr throughput</p>
      </CardContent>
    </Card>
  );
}

export const QueueCard = InteropQueueCard;

export function SubscriptionCard({
  subscription,
}: {
  subscription: Subscription;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <Badge variant="outline" className="capitalize">
            {subscription.channel}
          </Badge>
          <Badge
            variant={statusVariant[subscription.status]}
            className="capitalize"
          >
            {subscription.status}
          </Badge>
        </div>
        <p className="text-xs truncate">{subscription.criteria}</p>
        <p className="text-xs">{subscription.deliveryCount} deliveries</p>
      </CardContent>
    </Card>
  );
}

export function AuditCard({ log }: { log: AuditLog }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm flex justify-between gap-2">
        <div>
          <p className="font-medium capitalize">
            {log.action} {log.resourceType}
          </p>
          <p className="text-xs text-muted-foreground">
            {log.resourceId} · {log.actorId}
          </p>
        </div>
        <div className="text-right">
          <Badge
            variant={log.outcome === 'success' ? 'outline' : 'destructive'}
          >
            {log.outcome}
          </Badge>
          <p className="text-xs mt-1">
            {format(new Date(log.timestamp), 'MMM d, HH:mm')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function MappingCard({ mapping }: { mapping: MappingProfile }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{mapping.name}</span>
          {mapping.validated ? (
            <Badge variant="outline">Validated</Badge>
          ) : (
            <Badge variant="secondary">Draft</Badge>
          )}
        </div>
        <p className="text-xs capitalize">
          {mapping.direction.replace(/_/g, ' ')}
        </p>
        <p className="text-xs">
          {mapping.fieldCount} fields · {mapping.sourceEntity} →{' '}
          {mapping.targetFormat}
        </p>
      </CardContent>
    </Card>
  );
}

export function ValidationCard({ result }: { result: ValidationResult }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{result.resourceType}</span>
          <Badge className="capitalize">{result.status}</Badge>
        </div>
        <p className="text-xs">{result.issueCount} issues</p>
      </CardContent>
    </Card>
  );
}

export function SyncStatusCard({ sync }: { sync: SyncStatus }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{sync.endpointId}</span>
          <Badge className="capitalize">{sync.state}</Badge>
        </div>
        <p className="text-xs">
          {sync.recordsSynced.toLocaleString()} synced · {sync.conflicts}{' '}
          conflicts
        </p>
      </CardContent>
    </Card>
  );
}

export function InteropAnalyticsPanel({
  analytics,
}: {
  analytics: InteropAnalytics;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Message Volume',
            value: analytics.messageVolume.toLocaleString(),
          },
          { label: 'Success Rate', value: `${analytics.successRate}%` },
          { label: 'Avg Latency', value: `${analytics.avgLatencyMs}ms` },
          {
            label: 'Failed Jobs',
            value: analytics.failedJobs.toLocaleString(),
          },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <BarChartPanel title="Volume Trend" data={analytics.volumeTrend} />
        <BarChartPanel
          title="Protocol Distribution"
          data={analytics.protocolDistribution}
        />
      </div>
    </div>
  );
}

export function IntegrationTimeline({ jobs }: { jobs: IntegrationJob[] }) {
  return (
    <div className="space-y-2">
      {jobs.slice(0, 10).map((j) => (
        <Card key={j.jobId}>
          <CardContent className="pt-4 text-sm flex justify-between">
            <span>{j.name}</span>
            <Badge variant={jobVariant[j.status]} className="capitalize">
              {j.status.replace('_', ' ')}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function InteropExportToolbar({
  onExport,
}: {
  onExport?: (format: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {(['csv', 'pdf', 'xlsx'] as const).map((f) => (
        <Button
          key={f}
          size="sm"
          variant="outline"
          onClick={() => onExport?.(f)}
        >
          Export {f.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}

export function ApiKeyCard({ apiKey }: { apiKey: ApiKey }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2 flex items-start gap-3">
        <Key className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">{apiKey.name}</p>
          <p className="text-xs font-mono">{apiKey.prefix}••••••••</p>
          <p className="text-xs text-muted-foreground">
            {apiKey.scopes.join(', ')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function CdaDocumentCard({ doc }: { doc: CdaDocument }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{doc.type}</span>
          {doc.validated ? (
            <Badge variant="outline">Valid</Badge>
          ) : (
            <Badge variant="secondary">Unvalidated</Badge>
          )}
        </div>
        <p className="text-xs">
          {doc.patientId} · {doc.author}
        </p>
      </CardContent>
    </Card>
  );
}

export function TerminologyPanel({
  servers,
}: {
  servers: { name: string; url: string; systems: string[] }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {servers.map((s) => (
        <Card key={s.url}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{s.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {s.systems.join(', ')}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
