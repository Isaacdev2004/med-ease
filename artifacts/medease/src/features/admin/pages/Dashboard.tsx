import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Activity, AlertTriangle, Server, Users } from 'lucide-react';

import { ROUTES } from '@/config/routes';
import { useBillingDashboard } from '@/features/billing/hooks/use-billing';
import { useFinanceDashboard } from '@/features/finance/hooks/use-finance';
import { useIamDashboard, useUsers } from '@/features/iam/hooks/use-iam';
import { useInventoryDashboard } from '@/features/inventory/hooks/use-inventory';
import { usePatients } from '@/features/patients';
import { useApiAuth } from '@/services/auth/auth-service';
import type { IamUser } from '@/services/iam/types';
import { LoadingView } from '@/shared/components';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Input } from '@/shared/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';

type HealthCheck = { name: string; status: string; latencyMs?: number };

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '—';
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return `${Math.max(seconds, 0)}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function statusLabel(status: string): string {
  if (status === 'active') return 'Active';
  if (status === 'locked') return 'Locked';
  if (status === 'invited' || status === 'pending') return 'Pending';
  if (status === 'disabled' || status === 'suspended') return 'Suspended';
  return status.replace(/_/g, ' ');
}

function roleLabel(user: IamUser): string {
  const role = user.roles[0];
  if (!role) return 'User';
  return role
    .replace(/^role[._-]?/i, '')
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function probeApiHealth(): Promise<{
  latencyMs: number;
  status: string;
  checks: HealthCheck[];
}> {
  const base = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/$/,
    '',
  );
  if (!base) {
    return { latencyMs: 0, status: 'unavailable', checks: [] };
  }
  const started = performance.now();
  const response = await fetch(`${base}/api/healthz/ready`);
  const latencyMs = Math.round(performance.now() - started);
  const body = (await response.json().catch(() => ({}))) as {
    status?: string;
    checks?: HealthCheck[];
  };
  return {
    latencyMs,
    status: body.status ?? (response.ok ? 'ok' : 'degraded'),
    checks: Array.isArray(body.checks) ? body.checks : [],
  };
}

function KpiCard({
  title,
  value,
  hint,
  hintClassName,
}: {
  title: string;
  value: string | number;
  hint: string;
  hintClassName?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${hintClassName ?? 'text-muted-foreground'}`}>
          {hint}
        </p>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [userSearch, setUserSearch] = useState('');
  const iam = useIamDashboard();
  const users = useUsers({ page: 1, pageSize: 12, q: userSearch || undefined });
  const patients = usePatients({ page: 1, pageSize: 1 });
  const billing = useBillingDashboard();
  const inventory = useInventoryDashboard();
  const finance = useFinanceDashboard();
  const health = useQuery({
    queryKey: ['admin', 'system-health'],
    queryFn: probeApiHealth,
    enabled: useApiAuth,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const recentUsers = useMemo(() => {
    const items = [...(users.data?.items ?? [])];
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return items.slice(0, 8);
  }, [users.data?.items]);

  const healthyChecks = health.data?.checks.filter((c) => c.status === 'ok')
    .length;
  const totalChecks = health.data?.checks.length ?? 0;
  const integrationsLabel =
    totalChecks > 0
      ? `${healthyChecks}/${totalChecks}`
      : useApiAuth
        ? '—'
        : 'demo';

  if (iam.isLoading && !iam.data) {
    return <LoadingView label="Loading system overview…" />;
  }

  const dash = iam.data;
  const latency = health.data?.latencyMs;
  const latencyHint =
    latency == null
      ? useApiAuth
        ? health.isLoading
          ? 'Checking…'
          : 'Unavailable'
        : 'Demo mode'
      : latency < 200
        ? 'Normal'
        : latency < 800
          ? 'Elevated'
          : 'Slow';

  return (
    <div className="space-y-6 motion-preset-entrance">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live platform health from IAM, billing, inventory, and finance APIs.
          </p>
        </div>
        <Badge variant={health.data?.status === 'ok' ? 'success' : 'secondary'}>
          {useApiAuth ? `API ${health.data?.status ?? '…'}` : 'Demo data'}
        </Badge>
      </div>

      {iam.isError && !dash ? (
        <EmptyState
          icon={AlertTriangle}
          title="IAM metrics unavailable"
          description="Other live modules below still load. Check API reachability and admin permissions."
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Users"
          value={dash?.totalUsers ?? '—'}
          hint={`${dash?.activeSessions ?? 0} active sessions · MFA ${dash?.mfaAdoptionRate ?? 0}%`}
        />
        <KpiCard
          title="API Latency"
          value={latency != null ? `${latency}ms` : '—'}
          hint={latencyHint}
          hintClassName={
            latency != null && latency < 200
              ? 'text-xs text-green-600 font-medium'
              : 'text-xs text-muted-foreground'
          }
        />
        <KpiCard
          title="Failed Logins (24h)"
          value={dash?.failedLogins24h ?? '—'}
          hint={`${dash?.openIncidents ?? 0} open security incidents`}
        />
        <KpiCard
          title="Infrastructure"
          value={integrationsLabel}
          hint={
            totalChecks > 0 && healthyChecks === totalChecks
              ? 'All dependencies healthy'
              : totalChecks > 0
                ? 'One or more checks degraded'
                : 'No readiness checks reported'
          }
          hintClassName={
            totalChecks > 0 && healthyChecks === totalChecks
              ? 'text-xs text-green-600 font-medium'
              : 'text-xs text-muted-foreground'
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Patients on record"
          value={patients.data?.total ?? '—'}
          hint="From patients API"
        />
        <KpiCard
          title="Billing outstanding"
          value={
            billing.data
              ? billing.data.outstandingBalances.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                })
              : '—'
          }
          hint={`${billing.data?.pendingClaims ?? 0} pending claims`}
        />
        <KpiCard
          title="Inventory alerts"
          value={
            inventory.data
              ? inventory.data.lowStockCount + inventory.data.outOfStockCount
              : '—'
          }
          hint={`${inventory.data?.pendingOrders ?? 0} open purchase orders`}
        />
        <KpiCard
          title="Finance net income"
          value={
            finance.data
              ? finance.data.netIncome.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                })
              : '—'
          }
          hint={`Cash ${
            finance.data
              ? finance.data.cashPosition.toLocaleString(undefined, {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                })
              : '—'
          }`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row justify-between items-center border-b pb-4 gap-3">
            <div>
              <CardTitle>Recent User Provisioning</CardTitle>
              <CardDescription>
                Latest accounts from the IAM directory.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search users…"
                className="w-48 h-9"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              <Button size="sm" asChild>
                <Link href={ROUTES.admin.users}>Manage users</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {users.isLoading ? (
              <LoadingView label="Loading users…" variant="skeleton-table" />
            ) : recentUsers.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={Users}
                  title="No users found"
                  description="Provision accounts from User Management."
                />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <div className="font-medium">{user.displayName}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>{roleLabel(user)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.facilityId
                          ? user.facilityId.slice(-6).toUpperCase()
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === 'active'
                              ? 'success'
                              : user.status === 'locked'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {statusLabel(user.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatRelativeTime(user.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Dependency checks
            </CardTitle>
            <CardDescription>Live readiness from `/api/healthz/ready`.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {!useApiAuth ? (
              <p className="text-sm text-muted-foreground">
                Demo mode — health probes run only against a live API base URL.
              </p>
            ) : health.isLoading ? (
              <LoadingView label="Probing…" variant="spinner" />
            ) : (health.data?.checks.length ?? 0) === 0 ? (
              <EmptyState
                icon={Activity}
                title="No checks returned"
                description="The readiness endpoint responded without dependency details."
              />
            ) : (
              health.data!.checks.map((check) => (
                <div
                  key={check.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="capitalize">{check.name}</span>
                  <Badge
                    variant={check.status === 'ok' ? 'success' : 'destructive'}
                  >
                    {check.status}
                    {typeof check.latencyMs === 'number'
                      ? ` · ${check.latencyMs}ms`
                      : ''}
                  </Badge>
                </div>
              ))
            )}
            {(dash?.recentAudit.length ?? 0) > 0 && (
              <div className="pt-4 border-t space-y-2">
                <p className="text-sm font-medium">Recent audit</p>
                {dash!.recentAudit.slice(0, 4).map((event) => (
                  <div key={event.auditId} className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {event.action}
                    </span>{' '}
                    · {formatRelativeTime(event.timestamp)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
