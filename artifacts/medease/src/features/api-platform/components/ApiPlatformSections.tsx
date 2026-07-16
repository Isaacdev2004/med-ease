import { Code2 } from 'lucide-react';

import {
  ApiAnalyticsPanel,
  ApiEndpointCard,
  ApiKeyCard,
  ApiVersionBadge,
  DeveloperPortal,
  ExportToolbar,
  MarketplaceCard,
  OAuthAppCard,
  OpenApiViewer,
  PartnerCard,
  RateLimitPanel,
  SandboxCard,
  SdkCard,
  WebhookCard,
  WebhookDeliveryPanel,
} from '@/features/api-platform/components/ApiPlatformComponents';
import {
  useApiAnalytics,
  useApiDashboard,
  useApiEndpoints,
  useApiKeys,
  useApiPartners,
  useApiVersions,
  useOAuthApps,
  useOpenApiPreview,
  useOpenApiSpecs,
  useRateLimitPolicies,
  useSandboxes,
  useSdkPackages,
  useWebhookDeliveries,
  useWebhooks,
} from '@/features/api-platform/hooks/use-api-platform';
import { useApiPlatformMutations } from '@/features/api-platform/mutations/api-platform.mutations';
import type { ApiPlatformFilters } from '@/services/api-platform/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

export type ApiPlatformSection =
  | 'developer'
  | 'api-docs'
  | 'webhooks'
  | 'developer-portal'
  | 'api-keys'
  | 'oauth-apps'
  | 'sdk-management'
  | 'rate-limits'
  | 'api-analytics'
  | 'api-marketplace'
  | 'sandbox'
  | 'partners';

interface SectionProps {
  filters?: ApiPlatformFilters;
  variant?: 'professional' | 'facility' | 'admin';
}

export function DeveloperSection({ filters }: SectionProps) {
  const dashboard = useApiDashboard(filters?.partnerId);
  const keys = useApiKeys(filters);
  const { exportData } = useApiPlatformMutations();
  if (dashboard.isLoading) return <LoadingView label="Loading developer portal…" />;
  if (!dashboard.data) return <EmptyState icon={Code2} title="No API platform data" />;
  return (
    <div className="space-y-6">
      <DeveloperPortal dashboard={dashboard.data} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(keys.data?.items ?? []).slice(0, 6).map((k) => <ApiKeyCard key={k.keyId} apiKey={k} />)}
      </div>
      <WebhookDeliveryPanel deliveries={dashboard.data.recentDeliveries} />
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function ApiDocsSection({ filters }: SectionProps) {
  const specs = useOpenApiSpecs();
  const endpoints = useApiEndpoints(filters);
  const versions = useApiVersions();
  const firstSpec = specs.data?.[0];
  const preview = useOpenApiPreview(firstSpec?.specId ?? '');
  if (specs.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {(versions.data ?? []).map((v) => <ApiVersionBadge key={v.versionId} version={v.version} status={v.status} />)}
      </div>
      {(specs.data ?? []).map((spec) => (
        <OpenApiViewer key={spec.specId} spec={spec} preview={spec.specId === firstSpec?.specId ? preview.data?.preview : undefined} />
      ))}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(endpoints.data?.items ?? []).slice(0, 9).map((e) => <ApiEndpointCard key={e.endpointId} endpoint={e} />)}
      </div>
    </div>
  );
}

export function WebhooksSection({ filters }: SectionProps) {
  const webhooks = useWebhooks(filters);
  const deliveries = useWebhookDeliveries(filters);
  const { testWebhook } = useApiPlatformMutations();
  if (webhooks.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(webhooks.data?.items ?? []).slice(0, 9).map((w) => <WebhookCard key={w.webhookId} webhook={w} />)}
      </div>
      <WebhookDeliveryPanel deliveries={deliveries.data?.items ?? []} />
      {(webhooks.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => testWebhook.mutate({ webhookId: webhooks.data!.items[0]!.webhookId, eventType: 'patient.created' })}>
          Test first webhook (demo)
        </button>
      )}
    </div>
  );
}

export function DeveloperPortalSection({ filters }: SectionProps) {
  return <DeveloperSection filters={filters} />;
}

export function ApiKeysSection({ filters }: SectionProps) {
  const keys = useApiKeys(filters);
  const { createApiKey, revokeApiKey } = useApiPlatformMutations();
  if (keys.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(keys.data?.items ?? []).map((k) => <ApiKeyCard key={k.keyId} apiKey={k} />)}
      </div>
      <div className="flex gap-4">
        <button type="button" className="text-sm text-primary underline" onClick={() => createApiKey.mutate({ name: 'New API Key', scopes: ['read:patients'], createdBy: filters?.userId ?? 'current-user' })}>
          Create key (demo)
        </button>
        {(keys.data?.items ?? [])[0] && (
          <button type="button" className="text-sm text-primary underline" onClick={() => revokeApiKey.mutate({ keyId: keys.data!.items[0]!.keyId, revokedBy: filters?.userId ?? 'current-user' })}>
            Revoke first key (demo)
          </button>
        )}
      </div>
    </div>
  );
}

export function OAuthAppsSection({ filters }: SectionProps) {
  const apps = useOAuthApps(filters);
  const { createOAuthApp, publishOAuthApp } = useApiPlatformMutations();
  if (apps.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(apps.data?.items ?? []).map((a) => <OAuthAppCard key={a.appId} app={a} />)}
      </div>
      <div className="flex gap-4">
        <button type="button" className="text-sm text-primary underline" onClick={() => createOAuthApp.mutate({ name: 'New OAuth App', redirectUris: ['https://example.com/callback'], scopes: ['read:patients'] })}>
          Create app (demo)
        </button>
        {(apps.data?.items ?? []).find((a) => a.status === 'draft') && (
          <button type="button" className="text-sm text-primary underline" onClick={() => publishOAuthApp.mutate(apps.data!.items.find((a) => a.status === 'draft')!.appId)}>
            Publish draft app (demo)
          </button>
        )}
      </div>
    </div>
  );
}

export function SdkManagementSection({ filters }: SectionProps) {
  const sdks = useSdkPackages(filters);
  const { publishSdk } = useApiPlatformMutations();
  if (sdks.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(sdks.data?.items ?? []).map((s) => <SdkCard key={s.sdkId} sdk={s} />)}
      </div>
      {(sdks.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => publishSdk.mutate({ sdkId: sdks.data!.items[0]!.sdkId, version: '3.0.0' })}>
          Publish SDK update (demo)
        </button>
      )}
    </div>
  );
}

export function RateLimitsSection({ filters }: SectionProps) {
  const policies = useRateLimitPolicies(filters);
  const { updateRateLimit } = useApiPlatformMutations();
  if (policies.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <RateLimitPanel policies={policies.data?.items ?? []} />
      {(policies.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => updateRateLimit.mutate({ policyId: policies.data!.items[0]!.policyId, requestsPerMinute: 1200, burstLimit: 200, enabled: true })}>
          Update first policy (demo)
        </button>
      )}
    </div>
  );
}

export function ApiAnalyticsSection({ filters }: SectionProps) {
  const analytics = useApiAnalytics(filters?.partnerId);
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return null;
  return <ApiAnalyticsPanel analytics={analytics.data} />;
}

export function ApiMarketplaceSection({ filters }: SectionProps) {
  const partners = useApiPartners(filters);
  if (partners.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(partners.data?.items ?? []).map((p) => <MarketplaceCard key={p.partnerId} partner={p} />)}
    </div>
  );
}

export function SandboxSection({ filters }: SectionProps) {
  const sandboxes = useSandboxes(filters);
  const { createSandbox } = useApiPlatformMutations();
  if (sandboxes.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(sandboxes.data?.items ?? []).map((s) => <SandboxCard key={s.sandboxId} sandbox={s} />)}
      </div>
      <button type="button" className="text-sm text-primary underline" onClick={() => createSandbox.mutate({ name: 'New Sandbox', partnerId: filters?.partnerId })}>
        Create sandbox (demo)
      </button>
    </div>
  );
}

export function PartnersSection({ filters }: SectionProps) {
  const partners = useApiPartners(filters);
  if (partners.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(partners.data?.items ?? []).map((p) => <PartnerCard key={p.partnerId} partner={p} />)}
    </div>
  );
}

export function ApiPlatformSectionContent({ section, filters }: { section: ApiPlatformSection; filters?: ApiPlatformFilters; variant?: 'professional' | 'facility' | 'admin' }) {
  switch (section) {
    case 'api-docs': return <ApiDocsSection filters={filters} />;
    case 'webhooks': return <WebhooksSection filters={filters} />;
    case 'developer-portal': return <DeveloperPortalSection filters={filters} />;
    case 'api-keys': return <ApiKeysSection filters={filters} />;
    case 'oauth-apps': return <OAuthAppsSection filters={filters} />;
    case 'sdk-management': return <SdkManagementSection filters={filters} />;
    case 'rate-limits': return <RateLimitsSection filters={filters} />;
    case 'api-analytics': return <ApiAnalyticsSection filters={filters} />;
    case 'api-marketplace': return <ApiMarketplaceSection filters={filters} />;
    case 'sandbox': return <SandboxSection filters={filters} />;
    case 'partners': return <PartnersSection filters={filters} />;
    default: return <DeveloperSection filters={filters} />;
  }
}
