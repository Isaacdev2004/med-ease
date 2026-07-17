import { format } from 'date-fns';
import {
  AlertTriangle,
  BarChart3,
  Lock,
  Shield,
  ShieldAlert,
  Smartphone,
  User,
  Users,
} from 'lucide-react';

import type {
  ApiKey,
  BreakGlassEvent,
  ConsentRecord,
  DelegationRecord,
  IamAnalytics,
  IamAuditEvent,
  IamDashboard,
  IamPermission,
  IamPolicy,
  IamRole,
  IamSession,
  IamUser,
  LoginAttempt,
  MfaDevice,
  OAuthClient,
  ProxyAccess,
  RiskScore,
  SecurityIncident,
  TrustedDevice,
} from '@/services/iam/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const statusVariant = {
  active: 'default',
  inactive: 'secondary',
  locked: 'destructive',
  pending: 'outline',
  expired: 'secondary',
  revoked: 'destructive',
} as const;
const severityVariant = {
  low: 'outline',
  medium: 'secondary',
  high: 'destructive',
  critical: 'destructive',
} as const;

export function SecurityDashboard({ dashboard }: { dashboard: IamDashboard }) {
  const metrics = [
    {
      label: 'Total Users',
      value: dashboard.totalUsers.toLocaleString(),
      icon: Users,
    },
    {
      label: 'Active Sessions',
      value: dashboard.activeSessions.toLocaleString(),
      icon: Shield,
    },
    {
      label: 'MFA Adoption',
      value: `${dashboard.mfaAdoptionRate}%`,
      icon: Smartphone,
    },
    {
      label: 'Failed Logins (24h)',
      value: dashboard.failedLogins24h.toLocaleString(),
      icon: AlertTriangle,
    },
    {
      label: 'Active Policies',
      value: dashboard.activePolicies.toLocaleString(),
      icon: Lock,
    },
    {
      label: 'Open Incidents',
      value: dashboard.openIncidents.toLocaleString(),
      icon: ShieldAlert,
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
      <BarChartPanel title="Session Activity" data={dashboard.sessionTrend} />
    </div>
  );
}

export function UserCard({ user }: { user: IamUser }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1">
            <User className="h-4 w-4" /> {user.displayName}
          </span>
          <Badge variant={statusVariant[user.status]} className="capitalize">
            {user.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{user.email}</p>
        <div className="flex flex-wrap gap-1">
          {user.roles.map((r) => (
            <Badge key={r} variant="outline" className="text-xs">
              {r}
            </Badge>
          ))}
          {user.mfaEnabled && (
            <Badge variant="secondary" className="text-xs">
              MFA
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function RoleCard({ role }: { role: IamRole }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{role.name.replace('_', ' ')}</span>
          {role.isSystem && <Badge variant="outline">System</Badge>}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {role.description}
        </p>
        <p className="text-xs">{role.permissionCount} permissions</p>
      </CardContent>
    </Card>
  );
}

export function PermissionMatrix({
  permissions,
}: {
  permissions: IamPermission[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Permission Matrix</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {permissions.slice(0, 12).map((p) => (
          <div
            key={p.permissionId}
            className="flex justify-between gap-2 text-sm border-b pb-2 last:border-0"
          >
            <span className="font-mono text-xs">{p.name}</span>
            <Badge variant="outline">{p.module}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PolicyBuilder({ policies }: { policies: IamPolicy[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {policies.slice(0, 6).map((p) => (
        <Card key={p.policyId}>
          <CardContent className="pt-4 text-sm space-y-2">
            <div className="flex justify-between gap-2">
              <span className="font-medium">{p.name}</span>
              <Badge variant={p.effect === 'allow' ? 'default' : 'destructive'}>
                {p.effect}
              </Badge>
            </div>
            <p className="text-xs">
              {p.resource} · {p.action}
            </p>
            <Badge variant={p.enabled ? 'outline' : 'secondary'}>
              {p.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function SessionCard({ session }: { session: IamSession }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-1">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{session.userId}</span>
          <Badge className="capitalize">{session.status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {session.ipAddress} · {session.userAgent}
        </p>
        <p className="text-xs">
          Last active {format(new Date(session.lastActivityAt), 'MMM d, HH:mm')}
        </p>
      </CardContent>
    </Card>
  );
}

export function SessionTimeline({ sessions }: { sessions: IamSession[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Session Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sessions.slice(0, 8).map((s) => (
          <div
            key={s.sessionId}
            className="flex justify-between text-sm border-b pb-2 last:border-0"
          >
            <span>{s.sessionId}</span>
            <Badge variant={s.status === 'active' ? 'default' : 'secondary'}>
              {s.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function LoginHistoryTable({ attempts }: { attempts: LoginAttempt[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Login History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {attempts.slice(0, 10).map((a) => (
          <div
            key={a.attemptId}
            className="flex justify-between gap-2 text-sm border-b pb-2 last:border-0"
          >
            <div>
              <p className="font-medium">{a.email}</p>
              <p className="text-xs text-muted-foreground">
                {a.ipAddress} ·{' '}
                {format(new Date(a.attemptedAt), 'MMM d, HH:mm')}
              </p>
            </div>
            <Badge variant={a.success ? 'default' : 'destructive'}>
              {a.success ? 'Success' : 'Failed'}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function MFASetupCard({ device }: { device: MfaDevice }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{device.label}</span>
          <Badge className="capitalize">
            {device.method.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{device.userId}</p>
        <Badge variant={device.verified ? 'default' : 'outline'}>
          {device.verified ? 'Verified' : 'Pending'}
        </Badge>
      </CardContent>
    </Card>
  );
}

export function TrustedDeviceCard({ device }: { device: TrustedDevice }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <span className="font-medium">{device.name}</span>
        <p className="text-xs text-muted-foreground">
          {device.platform} · Trust {device.trustScore}%
        </p>
        <p className="text-xs">
          Last seen {format(new Date(device.lastSeenAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function ApiKeyCard({ apiKey }: { apiKey: ApiKey }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{apiKey.name}</span>
          <Badge className="capitalize">{apiKey.status}</Badge>
        </div>
        <p className="text-xs font-mono">{apiKey.prefix}••••</p>
        <p className="text-xs text-muted-foreground">
          Scopes: {apiKey.scopes.join(', ')}
        </p>
      </CardContent>
    </Card>
  );
}

export function OAuthClientCard({ client }: { client: OAuthClient }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{client.name}</span>
          <Badge className="capitalize">{client.status}</Badge>
        </div>
        <p className="text-xs font-mono">{client.clientId}</p>
        <p className="text-xs text-muted-foreground">
          {client.scopes.join(', ')}
        </p>
      </CardContent>
    </Card>
  );
}

export function IamConsentCard({ consent }: { consent: ConsentRecord }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{consent.purpose}</span>
          <Badge className="capitalize">{consent.status}</Badge>
        </div>
        <p className="text-xs">Patient: {consent.patientId}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(consent.grantedAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function DelegationCard({
  delegation,
}: {
  delegation: DelegationRecord;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <Badge variant="outline">{delegation.scope}</Badge>
        <p className="text-xs">
          {delegation.delegatorId} → {delegation.delegateId}
        </p>
        <Badge className="capitalize">{delegation.status}</Badge>
      </CardContent>
    </Card>
  );
}

export function ProxyAccessCard({ proxy }: { proxy: ProxyAccess }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <p className="font-medium capitalize">{proxy.relationship}</p>
        <p className="text-xs">Patient: {proxy.patientId}</p>
        <p className="text-xs">Proxy: {proxy.proxyUserId}</p>
        <Badge className="capitalize">{proxy.status}</Badge>
      </CardContent>
    </Card>
  );
}

export function BreakGlassPanel({ events }: { events: BreakGlassEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" /> Break-Glass Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No break-glass events.
          </p>
        ) : (
          events.slice(0, 6).map((e) => (
            <div
              key={e.eventId}
              className="text-sm border-b pb-2 last:border-0"
            >
              <div className="flex justify-between gap-2">
                <span className="font-medium">{e.userId}</span>
                <Badge className="capitalize">{e.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {e.reason}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function SecurityIncidentCard({
  incident,
}: {
  incident: SecurityIncident;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium line-clamp-1">{incident.title}</span>
          <Badge variant={severityVariant[incident.severity]}>
            {incident.severity}
          </Badge>
        </div>
        <Badge variant="outline" className="capitalize">
          {incident.status}
        </Badge>
        <p className="text-xs">
          {format(new Date(incident.detectedAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function AuditTimeline({ events }: { events: IamAuditEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Audit Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.slice(0, 10).map((e) => (
          <div
            key={e.auditId}
            className="flex justify-between gap-2 text-sm border-b pb-2 last:border-0"
          >
            <div>
              <p className="font-medium">{e.action}</p>
              <p className="text-xs text-muted-foreground">
                {e.resourceType}/{e.resourceId}
              </p>
            </div>
            <Badge
              variant={e.outcome === 'success' ? 'default' : 'destructive'}
            >
              {e.outcome}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function RiskScoreCard({ risk }: { risk: RiskScore }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{risk.userId}</span>
          <Badge
            variant={
              severityVariant[
                risk.level === 'critical'
                  ? 'critical'
                  : risk.level === 'high'
                    ? 'high'
                    : 'low'
              ]
            }
          >
            {risk.level}
          </Badge>
        </div>
        <p className="text-2xl font-bold">{(risk.score * 100).toFixed(0)}</p>
        <div className="flex flex-wrap gap-1">
          {risk.factors.map((f) => (
            <Badge key={f} variant="outline" className="text-xs">
              {f}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ZeroTrustDashboard({ dashboard }: { dashboard: IamDashboard }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-5 w-5" /> Zero Trust Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">MFA Adoption</p>
          <p className="text-lg font-semibold">{dashboard.mfaAdoptionRate}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Active Break-Glass</p>
          <p className="text-lg font-semibold">{dashboard.breakGlassActive}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Failed Logins</p>
          <p className="text-lg font-semibold">{dashboard.failedLogins24h}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Open Incidents</p>
          <p className="text-lg font-semibold">{dashboard.openIncidents}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function SecurityAnalyticsPanel({
  analytics,
}: {
  analytics: IamAnalytics;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: 'Auth Success Rate',
            value: `${analytics.authenticationSuccessRate}%`,
          },
          { label: 'MFA Enrollment', value: `${analytics.mfaEnrollmentRate}%` },
          {
            label: 'Avg Session (min)',
            value: analytics.averageSessionDuration,
          },
          { label: 'Policy Denials', value: `${analytics.policyDenialRate}%` },
          {
            label: 'Consent Compliance',
            value: `${analytics.consentComplianceRate}%`,
          },
          { label: 'Avg Risk Score', value: analytics.riskScoreAverage },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel title="Access by Module" data={analytics.accessByModule} />
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
        Export PDF
      </Button>
      <Button variant="outline" size="sm" onClick={() => onExport('xlsx')}>
        Export XLSX
      </Button>
    </div>
  );
}

export function OrganizationTree({
  orgs,
}: {
  orgs: {
    organizationId: string;
    name: string;
    type: string;
    facilityCount: number;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Organizations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {orgs.slice(0, 8).map((o) => (
          <div
            key={o.organizationId}
            className="flex justify-between text-sm border-b pb-2 last:border-0"
          >
            <span>{o.name}</span>
            <Badge variant="outline">
              {o.type} · {o.facilityCount} facilities
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SsoProviderCard({
  provider,
}: {
  provider: { providerId: string; name: string; status: string };
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm flex justify-between gap-2">
        <span className="font-medium">{provider.name}</span>
        <Badge className="capitalize">{provider.status}</Badge>
      </CardContent>
    </Card>
  );
}
