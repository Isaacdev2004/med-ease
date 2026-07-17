import { format } from 'date-fns';
import {
  Activity,
  BarChart3,
  Box,
  Code2,
  Globe,
  Key,
  Layers,
  Package,
  Shield,
  Store,
  Webhook,
  Zap,
} from 'lucide-react';

import type {
  ApiAnalytics,
  ApiDashboard,
  ApiEndpoint,
  ApiKey,
  ApiPartner,
  OAuthApp,
  OpenApiSpec,
  RateLimitPolicy,
  SandboxEnvironment,
  SdkPackage,
  Webhook as WebhookType,
  WebhookDelivery,
} from '@/services/api-platform/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const keyVariant = {
  active: 'default',
  revoked: 'destructive',
  expired: 'secondary',
} as const;
const webhookVariant = {
  active: 'default',
  paused: 'secondary',
  disabled: 'destructive',
} as const;
const deliveryVariant = {
  delivered: 'default',
  failed: 'destructive',
  retrying: 'secondary',
  pending: 'outline',
} as const;

export function DeveloperPortal({ dashboard }: { dashboard: ApiDashboard }) {
  const metrics = [
    {
      label: 'API Endpoints',
      value: dashboard.totalEndpoints.toLocaleString(),
      icon: Globe,
    },
    {
      label: 'Active API Keys',
      value: dashboard.activeApiKeys.toLocaleString(),
      icon: Key,
    },
    {
      label: 'OAuth Apps',
      value: dashboard.oauthApps.toLocaleString(),
      icon: Shield,
    },
    {
      label: 'Active Webhooks',
      value: dashboard.activeWebhooks.toLocaleString(),
      icon: Webhook,
    },
    {
      label: 'SDK Downloads',
      value: dashboard.sdkDownloads.toLocaleString(),
      icon: Package,
    },
    {
      label: 'Partners',
      value: dashboard.partners.toLocaleString(),
      icon: Store,
    },
  ];
  return (
    <div className="space-y-6">
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
      <BarChartPanel
        title="API Request Activity"
        data={dashboard.requestTrend}
      />
      <BarChartPanel
        title="Requests by Module"
        data={dashboard.moduleBreakdown}
      />
    </div>
  );
}

export function ApiKeyCard({ apiKey }: { apiKey: ApiKey }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1">
            <Key className="h-4 w-4" /> {apiKey.name}
          </span>
          <Badge variant={keyVariant[apiKey.status]} className="capitalize">
            {apiKey.status}
          </Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          {apiKey.prefix}••••••••
        </p>
        <div className="flex flex-wrap gap-1">
          {apiKey.scopes.slice(0, 3).map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))}
        </div>
        {apiKey.lastUsedAt && (
          <p className="text-xs text-muted-foreground">
            Last used: {format(new Date(apiKey.lastUsedAt), 'MMM d, yyyy')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function OAuthAppCard({ app }: { app: OAuthApp }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1">
            <Shield className="h-4 w-4" /> {app.name}
          </span>
          <Badge className="capitalize">{app.status}</Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          {app.clientId}
        </p>
        <div className="flex flex-wrap gap-1">
          {app.scopes.slice(0, 3).map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {app.redirectUris.length} redirect URI(s)
        </p>
      </CardContent>
    </Card>
  );
}

export function WebhookCard({ webhook }: { webhook: WebhookType }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1">
            <Webhook className="h-4 w-4" /> {webhook.name}
          </span>
          <Badge
            variant={webhookVariant[webhook.status]}
            className="capitalize"
          >
            {webhook.status}
          </Badge>
        </div>
        <p className="text-xs font-mono truncate text-muted-foreground">
          {webhook.url}
        </p>
        <div className="flex flex-wrap gap-1">
          {webhook.events.slice(0, 3).map((e) => (
            <Badge key={e} variant="outline">
              {e}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function WebhookDeliveryPanel({
  deliveries,
}: {
  deliveries: WebhookDelivery[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Deliveries</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {deliveries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No deliveries yet.</p>
        ) : (
          deliveries.slice(0, 8).map((d) => (
            <div
              key={d.deliveryId}
              className="flex justify-between text-sm border-b pb-2 last:border-0"
            >
              <div>
                <p className="font-medium">{d.eventType}</p>
                <p className="text-xs text-muted-foreground">
                  {d.webhookId} · {d.attemptCount} attempt(s)
                </p>
              </div>
              <Badge variant={deliveryVariant[d.status]} className="capitalize">
                {d.status}
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function SdkCard({ sdk }: { sdk: SdkPackage }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1">
            <Package className="h-4 w-4" /> {sdk.name}
          </span>
          <Badge className="capitalize">{sdk.status}</Badge>
        </div>
        <div className="flex gap-1">
          <Badge variant="outline">{sdk.language}</Badge>
          <Badge variant="outline">v{sdk.version}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {sdk.downloadCount.toLocaleString()} downloads
        </p>
      </CardContent>
    </Card>
  );
}

export function RateLimitPanel({ policies }: { policies: RateLimitPolicy[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {policies.slice(0, 8).map((p) => (
        <Card key={p.policyId}>
          <CardContent className="pt-4 text-sm space-y-2">
            <div className="flex justify-between gap-2">
              <span className="font-medium flex items-center gap-1">
                <Zap className="h-4 w-4" /> {p.name}
              </span>
              <Badge variant={p.enabled ? 'default' : 'secondary'}>
                {p.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <p className="text-xs font-mono">{p.endpointPattern}</p>
            <p className="text-xs">
              {p.requestsPerMinute} req/min · burst {p.burstLimit}
            </p>
            <Badge variant="outline" className="capitalize">
              {p.tier}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ApiAnalyticsPanel({ analytics }: { analytics: ApiAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: 'Total Requests',
            value: analytics.totalRequests.toLocaleString(),
          },
          { label: 'Error Rate', value: `${analytics.errorRate}%` },
          { label: 'Avg Latency (ms)', value: analytics.avgLatencyMs },
          { label: 'P99 Latency (ms)', value: analytics.p99LatencyMs },
          { label: 'Active Keys', value: analytics.activeKeys },
          {
            label: 'Webhook Success',
            value: `${analytics.webhookSuccessRate}%`,
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
      <BarChartPanel title="Request Trend" data={analytics.requestTrend} />
      <BarChartPanel title="Top Endpoints" data={analytics.topEndpoints} />
      <BarChartPanel title="Partner Usage" data={analytics.partnerUsage} />
    </div>
  );
}

export function MarketplaceCard({ partner }: { partner: ApiPartner }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1">
            <Store className="h-4 w-4" /> {partner.name}
          </span>
          <Badge className="capitalize">{partner.status}</Badge>
        </div>
        <Badge variant="outline" className="capitalize">
          {partner.tier}
        </Badge>
        <p className="text-xs text-muted-foreground">
          {partner.apiKeyCount} keys · {partner.webhookCount} webhooks
        </p>
        <p className="text-xs">{partner.contactEmail}</p>
      </CardContent>
    </Card>
  );
}

export function OpenApiViewer({
  spec,
  preview,
}: {
  spec: OpenApiSpec;
  preview?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Code2 className="h-5 w-5" /> {spec.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Badge variant="outline">v{spec.version}</Badge>
          <Badge variant="outline">{spec.format}</Badge>
          <Badge variant="outline">{spec.endpointCount} endpoints</Badge>
        </div>
        <pre className="rounded-md border bg-muted/30 p-4 text-xs font-mono overflow-auto max-h-64">
          {preview ??
            `# OpenAPI spec for ${spec.title}\n# ${spec.endpointCount} endpoints`}
        </pre>
      </CardContent>
    </Card>
  );
}

export function SandboxCard({ sandbox }: { sandbox: SandboxEnvironment }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1">
            <Box className="h-4 w-4" /> {sandbox.name}
          </span>
          <Badge className="capitalize">{sandbox.status}</Badge>
        </div>
        <p className="text-xs font-mono text-muted-foreground">
          {sandbox.baseUrl}
        </p>
        <p className="text-xs">{sandbox.apiKeyCount} API key(s)</p>
        {sandbox.expiresAt && (
          <p className="text-xs text-muted-foreground">
            Expires: {format(new Date(sandbox.expiresAt), 'MMM d, yyyy')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function PartnerCard({ partner }: { partner: ApiPartner }) {
  return <MarketplaceCard partner={partner} />;
}

export function ApiEndpointCard({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium font-mono text-xs">
            {endpoint.method} {endpoint.path}
          </span>
          <Badge className="capitalize">{endpoint.status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {endpoint.description}
        </p>
        <div className="flex gap-1">
          <Badge variant="outline">{endpoint.module}</Badge>
          <Badge variant="outline">{endpoint.version}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function ApiVersionBadge({
  version,
  status,
}: {
  version: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Layers className="h-4 w-4" />
      <span className="font-medium">{version}</span>
      <Badge className="capitalize">{status}</Badge>
    </div>
  );
}

export function ExportToolbar({
  onExport,
}: {
  onExport: (format: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
        <BarChart3 className="h-4 w-4 mr-1" /> Export CSV
      </Button>
      <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
        <Activity className="h-4 w-4 mr-1" /> Export PDF
      </Button>
      <Button variant="outline" size="sm" onClick={() => onExport('xlsx')}>
        Export XLSX
      </Button>
    </div>
  );
}
