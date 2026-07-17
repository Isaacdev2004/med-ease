import { format } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  Database,
  Flag,
  Globe,
  HardDrive,
  Key,
  Palette,
  Server,
  Settings,
  Shield,
  Wrench,
} from 'lucide-react';

import type {
  BackupJob,
  BrandingConfig,
  Department,
  FacilityConfig,
  FeatureFlagConfig,
  Hospital,
  License,
  Localization,
  MaintenanceMode,
  PlatformAnalytics,
  PlatformAudit,
  PlatformDashboard,
  StorageConfig,
  SystemHealth,
  SystemJob,
  Tenant,
} from '@/services/platform-admin/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const tenantVariant = {
  active: 'default',
  trial: 'secondary',
  suspended: 'destructive',
  archived: 'outline',
} as const;
const healthVariant = {
  healthy: 'default',
  degraded: 'secondary',
  critical: 'destructive',
} as const;
const jobVariant = {
  queued: 'secondary',
  running: 'default',
  completed: 'outline',
  failed: 'destructive',
} as const;
const backupVariant = {
  pending: 'secondary',
  running: 'default',
  completed: 'outline',
  failed: 'destructive',
} as const;
const maintenanceVariant = {
  scheduled: 'secondary',
  active: 'destructive',
  completed: 'outline',
} as const;

export function PlatformDashboardPanel({
  dashboard,
}: {
  dashboard: PlatformDashboard;
}) {
  const metrics = [
    {
      label: 'Total Tenants',
      value: dashboard.totalTenants.toLocaleString(),
      icon: Building2,
    },
    {
      label: 'Active Tenants',
      value: dashboard.activeTenants.toLocaleString(),
      icon: Activity,
    },
    {
      label: 'Total Facilities',
      value: dashboard.totalFacilities.toLocaleString(),
      icon: Server,
    },
    {
      label: 'Total Users',
      value: dashboard.totalUsers.toLocaleString(),
      icon: Shield,
    },
    {
      label: 'Health Score',
      value: `${dashboard.systemHealthScore}%`,
      icon: Activity,
    },
    {
      label: 'Pending Jobs',
      value: dashboard.pendingJobs.toLocaleString(),
      icon: Settings,
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
      <BarChartPanel title="Tenant Growth" data={dashboard.tenantTrend} />
      <BarChartPanel
        title="Tenants by Region"
        data={dashboard.regionBreakdown}
      />
    </div>
  );
}

export function PlatformAnalyticsPanel({
  analytics,
}: {
  analytics: PlatformAnalytics;
}) {
  const metrics = [
    { label: 'Tenant Growth Rate', value: `${analytics.tenantGrowthRate}%` },
    { label: 'Avg Facilities/Tenant', value: analytics.avgFacilitiesPerTenant },
    {
      label: 'License Utilization',
      value: `${analytics.licenseUtilizationRate}%`,
    },
    {
      label: 'Storage Utilization',
      value: `${analytics.storageUtilizationRate}%`,
    },
    { label: 'Job Success Rate', value: `${analytics.jobSuccessRate}%` },
    { label: 'System Uptime', value: `${analytics.systemUptimePercent}%` },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel title="Health Trend" data={analytics.healthTrend} />
    </div>
  );
}

export function TenantCard({ tenant }: { tenant: Tenant }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{tenant.name}</span>
          <Badge variant={tenantVariant[tenant.status]} className="capitalize">
            {tenant.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {tenant.slug} · {tenant.region}
        </p>
        <div className="flex gap-1 flex-wrap">
          <Badge variant="outline">{tenant.facilityCount} facilities</Badge>
          <Badge variant="outline">{tenant.userCount} users</Badge>
          <Badge variant="outline" className="capitalize">
            {tenant.subscriptionTier}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function HospitalSetupPanel({ hospitals }: { hospitals: Hospital[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="h-5 w-5" /> Hospital Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {hospitals.slice(0, 8).map((h) => (
          <div
            key={h.hospitalId}
            className="text-sm border rounded p-3 space-y-1"
          >
            <div className="flex justify-between gap-2">
              <span className="font-medium">{h.name}</span>
              <Badge
                variant={h.status === 'active' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {h.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {h.code} · {h.city}, {h.country}
            </p>
            <p className="text-xs">
              {h.bedCapacity} beds · {h.accreditation ?? 'No accreditation'}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function FacilitySetupPanel({
  facilities,
}: {
  facilities: FacilityConfig[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Server className="h-5 w-5" /> Facility Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {facilities.slice(0, 8).map((f) => (
          <div
            key={f.facilityId}
            className="text-sm border rounded p-3 space-y-1"
          >
            <div className="flex justify-between gap-2">
              <span className="font-medium">{f.name}</span>
              <Badge variant="outline" className="capitalize">
                {f.type}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {f.timezone} · {f.locale}
            </p>
            <div className="flex gap-1 flex-wrap">
              {f.enabledModules.slice(0, 4).map((m) => (
                <Badge key={m} variant="outline">
                  {m}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DepartmentCard({ department }: { department: Department }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{department.name}</span>
          <Badge
            variant={department.status === 'active' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {department.status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {department.code}
          {department.specialty ? ` · ${department.specialty}` : ''}
        </p>
        <p className="text-xs">
          {department.staffCount} staff
          {department.headOfDepartment
            ? ` · Head: ${department.headOfDepartment}`
            : ''}
        </p>
      </CardContent>
    </Card>
  );
}

export function LocalizationPanel({
  localization,
  readOnly = false,
}: {
  localization: Localization;
  readOnly?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Globe className="h-5 w-5" /> Localization
          {readOnly ? ' (Read-only)' : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Language</p>
            <p className="font-medium">{localization.defaultLanguage}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Currency</p>
            <p className="font-medium">{localization.defaultCurrency}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Timezone</p>
            <p className="font-medium">{localization.defaultTimezone}</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium mb-2">Languages</p>
            {localization.languages
              .filter((l) => l.enabled)
              .map((l) => (
                <Badge key={l.code} variant="outline" className="mr-1 mb-1">
                  {l.name}
                </Badge>
              ))}
          </div>
          <div>
            <p className="text-xs font-medium mb-2">Currencies</p>
            {localization.currencies
              .filter((c) => c.enabled)
              .map((c) => (
                <Badge key={c.code} variant="outline" className="mr-1 mb-1">
                  {c.symbol} {c.code}
                </Badge>
              ))}
          </div>
          <div>
            <p className="text-xs font-medium mb-2">Timezones</p>
            {localization.timezones
              .filter((t) => t.enabled)
              .map((t) => (
                <Badge key={t.id} variant="outline" className="mr-1 mb-1">
                  {t.label}
                </Badge>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BrandingPanel({
  branding,
  readOnly = false,
}: {
  branding: BrandingConfig;
  readOnly?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Palette className="h-5 w-5" /> Branding
          {readOnly ? ' (Read-only)' : ''}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="font-medium">{branding.portalName}</p>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <span
              className="h-6 w-6 rounded"
              style={{ backgroundColor: branding.primaryColor }}
            />
            <span className="text-xs">{branding.primaryColor}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-6 w-6 rounded"
              style={{ backgroundColor: branding.secondaryColor }}
            />
            <span className="text-xs">{branding.secondaryColor}</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="h-6 w-6 rounded"
              style={{ backgroundColor: branding.accentColor }}
            />
            <span className="text-xs">{branding.accentColor}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {branding.fontFamily} · {branding.supportEmail}
        </p>
      </CardContent>
    </Card>
  );
}

export function LicenseCard({ license }: { license: License }) {
  const utilization =
    license.seats > 0
      ? Math.round((license.usedSeats / license.seats) * 100)
      : 0;
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1">
            <Key className="h-4 w-4" /> {license.productName}
          </span>
          <Badge className="capitalize">{license.status}</Badge>
        </div>
        <p className="text-xs">
          {license.usedSeats} / {license.seats} seats ({utilization}%)
        </p>
        <p className="text-xs text-muted-foreground">
          Expires {format(new Date(license.expiresAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function StoragePanel({ storage }: { storage: StorageConfig[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <HardDrive className="h-5 w-5" /> Storage Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {storage.slice(0, 6).map((s) => {
          const pct =
            s.maxStorageGb > 0
              ? Math.round((s.usedStorageGb / s.maxStorageGb) * 100)
              : 0;
          return (
            <div
              key={s.configId}
              className="text-sm border-b pb-2 last:border-0"
            >
              <div className="flex justify-between gap-2">
                <span className="font-medium">{s.provider}</span>
                <Badge variant="outline">{pct}% used</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {s.bucket} · {s.region}
              </p>
              <p className="text-xs">
                {s.usedStorageGb} / {s.maxStorageGb} GB · {s.retentionDays}d
                retention{s.encryptionEnabled ? ' · Encrypted' : ''}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function FeatureFlagPanel({ flags }: { flags: FeatureFlagConfig[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Flag className="h-5 w-5" /> Feature Flags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {flags.map((f) => (
          <div
            key={f.flagId}
            className="flex justify-between text-sm border-b pb-2 last:border-0 gap-2"
          >
            <div>
              <p className="font-medium">{f.label}</p>
              <p className="text-xs text-muted-foreground">
                {f.key} · {f.scope}
              </p>
            </div>
            <Badge variant={f.enabled ? 'default' : 'secondary'}>
              {f.enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SystemJobQueue({ jobs }: { jobs: SystemJob[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Settings className="h-5 w-5" /> System Job Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {jobs.slice(0, 10).map((j) => (
          <div
            key={j.jobId}
            className="flex justify-between text-sm border-b pb-2 last:border-0 gap-2"
          >
            <div>
              <p className="font-medium">{j.name}</p>
              <p className="text-xs text-muted-foreground">
                {j.type} · {j.queue} · priority {j.priority}
              </p>
            </div>
            <Badge variant={jobVariant[j.status]} className="capitalize">
              {j.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function HealthDashboard({ services }: { services: SystemHealth[] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => (
          <Card key={s.healthId}>
            <CardContent className="pt-4 text-sm space-y-2">
              <div className="flex justify-between gap-2">
                <span className="font-medium flex items-center gap-1">
                  <Database className="h-4 w-4" /> {s.service}
                </span>
                <Badge variant={healthVariant[s.status]} className="capitalize">
                  {s.status}
                </Badge>
              </div>
              <p className="text-xs">
                {s.latencyMs}ms latency · {s.uptimePercent}% uptime
              </p>
              {s.message && (
                <p className="text-xs text-muted-foreground">{s.message}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function BackupPanel({ backups }: { backups: BackupJob[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <HardDrive className="h-5 w-5" /> Backup Jobs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {backups.slice(0, 8).map((b) => (
          <div
            key={b.backupId}
            className="flex justify-between text-sm border-b pb-2 last:border-0 gap-2"
          >
            <div>
              <p className="font-medium">{b.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {b.type} · {b.sizeGb} GB · {b.retentionDays}d retention
              </p>
            </div>
            <Badge variant={backupVariant[b.status]} className="capitalize">
              {b.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function MaintenancePanel({
  maintenance,
}: {
  maintenance: MaintenanceMode[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Wrench className="h-5 w-5" /> Maintenance Windows
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {maintenance.slice(0, 6).map((m) => (
          <div
            key={m.maintenanceId}
            className="text-sm border rounded p-3 space-y-1"
          >
            <div className="flex justify-between gap-2">
              <span className="font-medium">{m.title}</span>
              <Badge
                variant={maintenanceVariant[m.status]}
                className="capitalize"
              >
                {m.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{m.message}</p>
            <p className="text-xs">
              {format(new Date(m.scheduledStart), 'MMM d HH:mm')} –{' '}
              {format(new Date(m.scheduledEnd), 'MMM d HH:mm')}
            </p>
            <div className="flex gap-1 flex-wrap">
              {m.affectedServices.map((s) => (
                <Badge key={s} variant="outline">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AuditTimeline({ audits }: { audits: PlatformAudit[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" /> Platform Audit Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {audits.slice(0, 12).map((a) => (
          <div
            key={a.auditId}
            className="flex justify-between text-sm border-b pb-2 last:border-0 gap-2"
          >
            <div>
              <p className="font-medium">{a.action}</p>
              <p className="text-xs text-muted-foreground">
                {a.resource} · {a.actorId}
                {a.tenantId ? ` · ${a.tenantId}` : ''}
              </p>
            </div>
            <div className="text-right shrink-0">
              <Badge
                variant={a.outcome === 'success' ? 'outline' : 'destructive'}
              >
                {a.outcome}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(a.timestamp), 'MMM d, HH:mm')}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
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

export function ConfigurationsPanel({
  configurations,
}: {
  configurations: {
    email: unknown[];
    sms: unknown[];
    localization: Localization | null;
    branding: BrandingConfig | null;
  };
}) {
  return (
    <div className="space-y-6">
      {configurations.localization && (
        <LocalizationPanel localization={configurations.localization} />
      )}
      {configurations.branding && (
        <BrandingPanel branding={configurations.branding} />
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Communication Servers</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <p className="font-medium mb-1">Email Servers</p>
            <p className="text-xs text-muted-foreground">
              {configurations.email.length} configured
            </p>
          </div>
          <div>
            <p className="font-medium mb-1">SMS Servers</p>
            <p className="text-xs text-muted-foreground">
              {configurations.sms.length} configured
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
