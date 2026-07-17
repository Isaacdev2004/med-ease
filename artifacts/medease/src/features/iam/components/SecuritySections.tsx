import { Shield } from 'lucide-react';

import {
  ApiKeyCard,
  AuditTimeline,
  BreakGlassPanel,
  DelegationCard,
  ExportToolbar,
  IamConsentCard,
  LoginHistoryTable,
  MFASetupCard,
  OAuthClientCard,
  OrganizationTree,
  PermissionMatrix,
  PolicyBuilder,
  ProxyAccessCard,
  RiskScoreCard,
  RoleCard,
  SecurityAnalyticsPanel,
  SecurityDashboard,
  SecurityIncidentCard,
  SessionCard,
  SessionTimeline,
  SsoProviderCard,
  TrustedDeviceCard,
  UserCard,
  ZeroTrustDashboard,
} from '@/features/iam/components/SecurityComponents';
import {
  useApiKeys,
  useAuditEvents,
  useBreakGlass,
  useConsent,
  useDelegations,
  useIamAnalytics,
  useIamDashboard,
  useLoginHistory,
  useMfa,
  useOauthClients,
  useOrganizations,
  usePermissions,
  usePolicies,
  useProxyAccess,
  useRiskScores,
  useRoles,
  useSecurityIncidents,
  useSessions,
  useTenants,
  useTrustedDevices,
  useUsers,
  useSamlProviders,
  useOidcProviders,
} from '@/features/iam/hooks/use-iam';
import { useIamMutations } from '@/features/iam/mutations/iam.mutations';
import type { IamFilters } from '@/services/iam/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

export type IamSection =
  | 'dashboard'
  | 'my-access'
  | 'my-devices'
  | 'my-sessions'
  | 'users'
  | 'roles'
  | 'permissions'
  | 'policies'
  | 'identity'
  | 'organizations'
  | 'tenants'
  | 'sessions'
  | 'oauth-clients'
  | 'api-keys'
  | 'sso'
  | 'saml'
  | 'openid'
  | 'mfa'
  | 'device-trust'
  | 'consent'
  | 'delegation'
  | 'break-glass'
  | 'security-incidents'
  | 'security-analytics'
  | 'audit'
  | 'audit-events';

interface SectionProps {
  filters?: IamFilters;
  variant?: 'professional' | 'facility' | 'admin';
}

export function DashboardSection({ filters }: SectionProps) {
  const dashboard = useIamDashboard(filters?.tenantId);
  const risk = useRiskScores(filters);
  const { exportData } = useIamMutations();
  if (dashboard.isLoading)
    return <LoadingView label="Loading security dashboard…" />;
  if (!dashboard.data)
    return <EmptyState icon={Shield} title="No security data" />;
  return (
    <div className="space-y-6">
      <SecurityDashboard dashboard={dashboard.data} />
      <ZeroTrustDashboard dashboard={dashboard.data} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(risk.data?.items ?? []).slice(0, 6).map((r) => (
          <RiskScoreCard key={r.userId} risk={r} />
        ))}
      </div>
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function MyAccessSection({ filters }: SectionProps) {
  const users = useUsers({ ...filters, pageSize: 1 });
  const roles = useRoles(filters);
  const permissions = usePermissions(filters);
  if (users.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {(users.data?.items ?? []).slice(0, 1).map((u) => (
        <UserCard key={u.userId} user={u} />
      ))}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(roles.data?.items ?? []).slice(0, 3).map((r) => (
          <RoleCard key={r.roleId} role={r} />
        ))}
      </div>
      {permissions.data && (
        <PermissionMatrix permissions={permissions.data.items} />
      )}
    </div>
  );
}

export function MyDevicesSection({ filters }: SectionProps) {
  const mfa = useMfa(filters);
  const devices = useTrustedDevices(filters);
  if (mfa.isLoading || devices.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(mfa.data?.items ?? []).slice(0, 6).map((d) => (
          <MFASetupCard key={d.deviceId} device={d} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(devices.data?.items ?? []).slice(0, 6).map((d) => (
          <TrustedDeviceCard key={d.deviceId} device={d} />
        ))}
      </div>
    </div>
  );
}

export function MySessionsSection({ filters }: SectionProps) {
  const sessions = useSessions(filters);
  const loginHistory = useLoginHistory(filters);
  const { revokeSession } = useIamMutations();
  if (sessions.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <SessionTimeline sessions={sessions.data?.items ?? []} />
      <div className="grid gap-4 sm:grid-cols-2">
        {(sessions.data?.items ?? []).slice(0, 4).map((s) => (
          <SessionCard key={s.sessionId} session={s} />
        ))}
      </div>
      <LoginHistoryTable attempts={loginHistory.data?.items ?? []} />
      {(sessions.data?.items ?? [])[0] && (
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() =>
            revokeSession.mutate({
              sessionId: sessions.data!.items[0]!.sessionId,
            })
          }
        >
          Revoke oldest session (demo)
        </button>
      )}
    </div>
  );
}

export function UsersSection({ filters }: SectionProps) {
  const users = useUsers(filters);
  if (users.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(users.data?.items ?? []).slice(0, 12).map((u) => (
        <UserCard key={u.userId} user={u} />
      ))}
    </div>
  );
}

export function RolesSection({ filters }: SectionProps) {
  const roles = useRoles(filters);
  if (roles.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(roles.data?.items ?? []).map((r) => (
        <RoleCard key={r.roleId} role={r} />
      ))}
    </div>
  );
}

export function PermissionsSection({ filters }: SectionProps) {
  const permissions = usePermissions(filters);
  if (permissions.isLoading) return <LoadingView />;
  if (!permissions.data) return null;
  return <PermissionMatrix permissions={permissions.data.items} />;
}

export function PoliciesSection({ filters }: SectionProps) {
  const policies = usePolicies(filters);
  if (policies.isLoading) return <LoadingView />;
  return <PolicyBuilder policies={policies.data?.items ?? []} />;
}

export function IdentitySection({ filters }: SectionProps) {
  const users = useUsers(filters);
  const tenants = useTenants(filters);
  if (users.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(users.data?.items ?? []).slice(0, 9).map((u) => (
          <UserCard key={u.userId} user={u} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(tenants.data?.items ?? []).slice(0, 6).map((t) => (
          <div key={t.tenantId} className="rounded-lg border p-4 text-sm">
            <p className="font-medium">{t.name}</p>
            <p className="text-xs text-muted-foreground">
              {t.userCount.toLocaleString()} users
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OrganizationsSection({ filters }: SectionProps) {
  const orgs = useOrganizations(filters);
  if (orgs.isLoading) return <LoadingView />;
  return <OrganizationTree orgs={orgs.data?.items ?? []} />;
}

export function TenantsSection({ filters }: SectionProps) {
  const tenants = useTenants(filters);
  if (tenants.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(tenants.data?.items ?? []).map((t) => (
        <div
          key={t.tenantId}
          className="rounded-lg border p-4 text-sm space-y-1"
        >
          <p className="font-medium">{t.name}</p>
          <p className="text-xs capitalize">{t.status}</p>
          <p className="text-xs text-muted-foreground">
            {t.organizationCount} orgs · {t.userCount.toLocaleString()} users
          </p>
        </div>
      ))}
    </div>
  );
}

export function SessionsSection({ filters }: SectionProps) {
  const sessions = useSessions(filters);
  if (sessions.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <SessionTimeline sessions={sessions.data?.items ?? []} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(sessions.data?.items ?? []).slice(0, 9).map((s) => (
          <SessionCard key={s.sessionId} session={s} />
        ))}
      </div>
    </div>
  );
}

export function OauthClientsSection({ filters }: SectionProps) {
  const clients = useOauthClients(filters);
  if (clients.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(clients.data?.items ?? []).slice(0, 12).map((c) => (
        <OAuthClientCard key={c.clientId} client={c} />
      ))}
    </div>
  );
}

export function ApiKeysSection({ filters }: SectionProps) {
  const keys = useApiKeys(filters);
  if (keys.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(keys.data?.items ?? []).slice(0, 12).map((k) => (
        <ApiKeyCard key={k.keyId} apiKey={k} />
      ))}
    </div>
  );
}

export function SsoSection({ filters }: SectionProps) {
  const saml = useSamlProviders(filters);
  const oidc = useOidcProviders(filters);
  if (saml.isLoading || oidc.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(saml.data?.items ?? []).map((p) => (
        <SsoProviderCard key={p.providerId} provider={p} />
      ))}
      {(oidc.data?.items ?? []).map((p) => (
        <SsoProviderCard key={p.providerId} provider={p} />
      ))}
    </div>
  );
}

export function SamlSection({ filters }: SectionProps) {
  const saml = useSamlProviders(filters);
  if (saml.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(saml.data?.items ?? []).map((p) => (
        <SsoProviderCard key={p.providerId} provider={p} />
      ))}
    </div>
  );
}

export function OpenIdSection({ filters }: SectionProps) {
  const oidc = useOidcProviders(filters);
  if (oidc.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(oidc.data?.items ?? []).map((p) => (
        <SsoProviderCard key={p.providerId} provider={p} />
      ))}
    </div>
  );
}

export function MfaSection({ filters }: SectionProps) {
  const mfa = useMfa(filters);
  if (mfa.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(mfa.data?.items ?? []).slice(0, 12).map((d) => (
        <MFASetupCard key={d.deviceId} device={d} />
      ))}
    </div>
  );
}

export function DeviceTrustSection({ filters }: SectionProps) {
  const devices = useTrustedDevices(filters);
  if (devices.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(devices.data?.items ?? []).slice(0, 12).map((d) => (
        <TrustedDeviceCard key={d.deviceId} device={d} />
      ))}
    </div>
  );
}

export function ConsentSection({ filters }: SectionProps) {
  const consents = useConsent(filters);
  const proxy = useProxyAccess(filters);
  if (consents.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(consents.data?.items ?? []).slice(0, 9).map((c) => (
          <IamConsentCard key={c.consentId} consent={c} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(proxy.data?.items ?? []).slice(0, 6).map((p) => (
          <ProxyAccessCard key={p.proxyId} proxy={p} />
        ))}
      </div>
    </div>
  );
}

export function DelegationSection({ filters }: SectionProps) {
  const delegations = useDelegations(filters);
  if (delegations.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(delegations.data?.items ?? []).map((d) => (
        <DelegationCard key={d.delegationId} delegation={d} />
      ))}
    </div>
  );
}

export function BreakGlassSection({ filters }: SectionProps) {
  const events = useBreakGlass(filters);
  const { startBreakGlass, endBreakGlass } = useIamMutations();
  if (events.isLoading) return <LoadingView />;
  return (
    <div className="space-y-4">
      <BreakGlassPanel events={events.data?.items ?? []} />
      <button
        type="button"
        className="text-sm text-primary underline mr-4"
        onClick={() =>
          startBreakGlass.mutate({
            userId: 'user-00001',
            reason: 'Emergency clinical access',
            patientId: 'pat-001',
          })
        }
      >
        Start break-glass (demo)
      </button>
      {(events.data?.items ?? [])[0] && (
        <button
          type="button"
          className="text-sm text-primary underline"
          onClick={() =>
            endBreakGlass.mutate({ eventId: events.data!.items[0]!.eventId })
          }
        >
          End break-glass (demo)
        </button>
      )}
    </div>
  );
}

export function SecurityIncidentsSection({ filters }: SectionProps) {
  const incidents = useSecurityIncidents(filters);
  if (incidents.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(incidents.data?.items ?? []).map((i) => (
        <SecurityIncidentCard key={i.incidentId} incident={i} />
      ))}
    </div>
  );
}

export function SecurityAnalyticsSection({ filters }: SectionProps) {
  const analytics = useIamAnalytics(filters?.tenantId);
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return null;
  return <SecurityAnalyticsPanel analytics={analytics.data} />;
}

export function AuditSection({ filters }: SectionProps) {
  const audit = useAuditEvents(filters);
  const loginHistory = useLoginHistory(filters);
  if (audit.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <AuditTimeline events={audit.data?.items ?? []} />
      <LoginHistoryTable attempts={loginHistory.data?.items ?? []} />
    </div>
  );
}

export function AuditEventsSection({ filters }: SectionProps) {
  return <AuditSection filters={filters} />;
}

export function SecuritySectionContent({
  section,
  filters,
}: {
  section: IamSection;
  filters?: IamFilters;
  variant?: 'professional' | 'facility' | 'admin';
}) {
  switch (section) {
    case 'my-access':
      return <MyAccessSection filters={filters} />;
    case 'my-devices':
      return <MyDevicesSection filters={filters} />;
    case 'my-sessions':
      return <MySessionsSection filters={filters} />;
    case 'users':
      return <UsersSection filters={filters} />;
    case 'roles':
      return <RolesSection filters={filters} />;
    case 'permissions':
      return <PermissionsSection filters={filters} />;
    case 'policies':
      return <PoliciesSection filters={filters} />;
    case 'identity':
      return <IdentitySection filters={filters} />;
    case 'organizations':
      return <OrganizationsSection filters={filters} />;
    case 'tenants':
      return <TenantsSection filters={filters} />;
    case 'sessions':
      return <SessionsSection filters={filters} />;
    case 'oauth-clients':
      return <OauthClientsSection filters={filters} />;
    case 'api-keys':
      return <ApiKeysSection filters={filters} />;
    case 'sso':
      return <SsoSection filters={filters} />;
    case 'saml':
      return <SamlSection filters={filters} />;
    case 'openid':
      return <OpenIdSection filters={filters} />;
    case 'mfa':
      return <MfaSection filters={filters} />;
    case 'device-trust':
      return <DeviceTrustSection filters={filters} />;
    case 'consent':
      return <ConsentSection filters={filters} />;
    case 'delegation':
      return <DelegationSection filters={filters} />;
    case 'break-glass':
      return <BreakGlassSection filters={filters} />;
    case 'security-incidents':
      return <SecurityIncidentsSection filters={filters} />;
    case 'security-analytics':
      return <SecurityAnalyticsSection filters={filters} />;
    case 'audit':
    case 'audit-events':
      return <AuditSection filters={filters} />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
