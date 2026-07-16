import { Building2 } from 'lucide-react';

import {
  AuditTimeline,
  BackupPanel,
  BrandingPanel,
  ConfigurationsPanel,
  DepartmentCard,
  ExportToolbar,
  FacilitySetupPanel,
  FeatureFlagPanel,
  HealthDashboard,
  HospitalSetupPanel,
  LicenseCard,
  LocalizationPanel,
  MaintenancePanel,
  PlatformAnalyticsPanel,
  PlatformDashboardPanel,
  StoragePanel,
  SystemJobQueue,
  TenantCard,
} from '@/features/platform-admin/components/PlatformAdminComponents';
import {
  useBackups,
  useBranding,
  useConfigurations,
  useDepartments,
  useFacilities,
  useFeatureFlags,
  useHospitals,
  useLicenses,
  useLocalization,
  useMaintenance,
  usePlatformAnalytics,
  usePlatformAudits,
  usePlatformDashboard,
  useQueues,
  useStorage,
  useSystemHealth,
  useSystemJobs,
  useTenants,
  useWorkers,
} from '@/features/platform-admin/hooks/use-platform-admin';
import { usePlatformAdminMutations } from '@/features/platform-admin/mutations/platform-admin.mutations';
import type { PlatformFilters } from '@/services/platform-admin/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

export type PlatformAdminSection =
  | 'dashboard'
  | 'tenants'
  | 'hospital-setup'
  | 'facility-setup'
  | 'departments'
  | 'localization'
  | 'branding'
  | 'licenses'
  | 'storage'
  | 'feature-flags-admin'
  | 'system-jobs'
  | 'system-health'
  | 'backups'
  | 'maintenance'
  | 'platform-audit'
  | 'configurations'
  | 'platform-settings';

interface SectionProps {
  filters?: PlatformFilters;
  variant?: 'admin' | 'readonly';
}

export function DashboardSection({ filters }: SectionProps) {
  const dashboard = usePlatformDashboard(filters?.tenantId);
  const tenants = useTenants(filters);
  const { exportData } = usePlatformAdminMutations();
  if (dashboard.isLoading) return <LoadingView label="Loading platform dashboard…" />;
  if (!dashboard.data) return <EmptyState icon={Building2} title="No platform data" />;
  return (
    <div className="space-y-6">
      <PlatformDashboardPanel dashboard={dashboard.data} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(tenants.data?.items ?? []).slice(0, 6).map((t) => <TenantCard key={t.tenantId} tenant={t} />)}
      </div>
      <AuditTimeline audits={dashboard.data.recentAudits} />
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function TenantsSection({ filters }: SectionProps) {
  const tenants = useTenants(filters);
  const { activateTenant, suspendTenant } = usePlatformAdminMutations();
  if (tenants.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(tenants.data?.items ?? []).map((t) => <TenantCard key={t.tenantId} tenant={t} />)}
      </div>
      {(tenants.data?.items ?? [])[0] && (
        <div className="flex gap-4">
          <button type="button" className="text-sm text-primary underline" onClick={() => activateTenant.mutate(tenants.data!.items[0]!.tenantId)}>Activate first tenant (demo)</button>
          <button type="button" className="text-sm text-primary underline" onClick={() => suspendTenant.mutate(tenants.data!.items[0]!.tenantId)}>Suspend first tenant (demo)</button>
        </div>
      )}
    </div>
  );
}

export function HospitalSetupSection({ filters }: SectionProps) {
  const hospitals = useHospitals(filters);
  const { updateHospital } = usePlatformAdminMutations();
  if (hospitals.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <HospitalSetupPanel hospitals={hospitals.data?.items ?? []} />
      {(hospitals.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => updateHospital.mutate({ hospitalId: hospitals.data!.items[0]!.hospitalId, bedCapacity: 500 })}>
          Update bed capacity (demo)
        </button>
      )}
    </div>
  );
}

export function FacilitySetupSection({ filters }: SectionProps) {
  const facilities = useFacilities(filters);
  const { updateFacility } = usePlatformAdminMutations();
  if (facilities.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <FacilitySetupPanel facilities={facilities.data?.items ?? []} />
      {(facilities.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => updateFacility.mutate({ facilityId: facilities.data!.items[0]!.facilityId, timezone: 'Europe/London' })}>
          Update timezone (demo)
        </button>
      )}
    </div>
  );
}

export function DepartmentsSection({ filters }: SectionProps) {
  const departments = useDepartments(filters);
  if (departments.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(departments.data?.items ?? []).map((d) => <DepartmentCard key={d.departmentId} department={d} />)}
    </div>
  );
}

export function LocalizationSection({ filters, variant }: SectionProps) {
  const localization = useLocalization(filters?.tenantId);
  const { updateLocalization } = usePlatformAdminMutations();
  if (localization.isLoading) return <LoadingView />;
  if (!localization.data) return <EmptyState title="No localization config" />;
  return (
    <div className="space-y-6">
      <LocalizationPanel localization={localization.data} readOnly={variant === 'readonly'} />
      {variant !== 'readonly' && (
        <button type="button" className="text-sm text-primary underline" onClick={() => updateLocalization.mutate({ tenantId: localization.data!.tenantId, defaultLanguage: 'en-GB' })}>
          Switch to en-GB (demo)
        </button>
      )}
    </div>
  );
}

export function BrandingSection({ filters, variant }: SectionProps) {
  const branding = useBranding(filters?.tenantId);
  const { updateBranding } = usePlatformAdminMutations();
  if (branding.isLoading) return <LoadingView />;
  if (!branding.data) return <EmptyState title="No branding config" />;
  return (
    <div className="space-y-6">
      <BrandingPanel branding={branding.data} readOnly={variant === 'readonly'} />
      {variant !== 'readonly' && (
        <button type="button" className="text-sm text-primary underline" onClick={() => updateBranding.mutate({ tenantId: branding.data!.tenantId, primaryColor: '#059669' })}>
          Update primary color (demo)
        </button>
      )}
    </div>
  );
}

export function LicensesSection({ filters }: SectionProps) {
  const licenses = useLicenses(filters);
  if (licenses.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(licenses.data?.items ?? []).map((l) => <LicenseCard key={l.licenseId} license={l} />)}
    </div>
  );
}

export function StorageSection({ filters }: SectionProps) {
  const storage = useStorage(filters);
  if (storage.isLoading) return <LoadingView />;
  return <StoragePanel storage={storage.data?.items ?? []} />;
}

export function FeatureFlagsSection({ filters }: SectionProps) {
  const flags = useFeatureFlags(filters);
  const { toggleFeatureFlag } = usePlatformAdminMutations();
  if (flags.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <FeatureFlagPanel flags={flags.data?.items ?? []} />
      {(flags.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => toggleFeatureFlag.mutate({ flagId: flags.data!.items[0]!.flagId, enabled: !flags.data!.items[0]!.enabled })}>
          Toggle first flag (demo)
        </button>
      )}
    </div>
  );
}

export function SystemJobsSection({ filters }: SectionProps) {
  const jobs = useSystemJobs(filters);
  const workers = useWorkers();
  const queues = useQueues();
  const { retryJob } = usePlatformAdminMutations();
  if (jobs.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <SystemJobQueue jobs={jobs.data?.items ?? []} />
      <div className="grid gap-4 sm:grid-cols-3">
        {(queues.data ?? []).map((q) => (
          <div key={q.queueId} className="rounded-lg border p-4 text-sm">
            <p className="font-medium">{q.name}</p>
            <p className="text-xs text-muted-foreground">{q.pendingCount} pending · {q.processingCount} processing · {q.failedCount} failed</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {(workers.data ?? []).slice(0, 6).map((w) => (
          <div key={w.workerId} className="rounded-lg border p-4 text-sm">
            <p className="font-medium">{w.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{w.status} · {w.processedCount.toLocaleString()} processed</p>
          </div>
        ))}
      </div>
      {(jobs.data?.items ?? []).find((j) => j.status === 'failed') && (
        <button type="button" className="text-sm text-primary underline" onClick={() => retryJob.mutate(jobs.data!.items.find((j) => j.status === 'failed')!.jobId)}>
          Retry failed job (demo)
        </button>
      )}
    </div>
  );
}

export function SystemHealthSection() {
  const health = useSystemHealth();
  const analytics = usePlatformAnalytics();
  if (health.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <HealthDashboard services={health.data ?? []} />
      {analytics.data && <PlatformAnalyticsPanel analytics={analytics.data} />}
    </div>
  );
}

export function BackupsSection({ filters }: SectionProps) {
  const backups = useBackups(filters);
  const { triggerBackup } = usePlatformAdminMutations();
  if (backups.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <BackupPanel backups={backups.data?.items ?? []} />
      <button type="button" className="text-sm text-primary underline" onClick={() => triggerBackup.mutate({ name: 'Manual Backup', type: 'full' })}>
        Trigger full backup (demo)
      </button>
    </div>
  );
}

export function MaintenanceSection({ filters }: SectionProps) {
  const maintenance = useMaintenance(filters);
  const { scheduleMaintenance } = usePlatformAdminMutations();
  if (maintenance.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <MaintenancePanel maintenance={maintenance.data?.items ?? []} />
      <button type="button" className="text-sm text-primary underline" onClick={() => scheduleMaintenance.mutate({
        title: 'Scheduled Upgrade',
        message: 'Platform database migration.',
        scheduledStart: new Date(Date.now() + 86400000).toISOString(),
        scheduledEnd: new Date(Date.now() + 90000000).toISOString(),
        affectedServices: ['API Gateway', 'Database'],
      })}>
        Schedule maintenance (demo)
      </button>
    </div>
  );
}

export function PlatformAuditSection({ filters }: SectionProps) {
  const audits = usePlatformAudits(filters);
  if (audits.isLoading) return <LoadingView />;
  return <AuditTimeline audits={audits.data?.items ?? []} />;
}

export function ConfigurationsSection({ filters }: SectionProps) {
  const configurations = useConfigurations(filters?.tenantId);
  if (configurations.isLoading) return <LoadingView />;
  if (!configurations.data) return <EmptyState title="No configurations" />;
  return <ConfigurationsPanel configurations={configurations.data} />;
}

export function PlatformSettingsSection({ filters }: SectionProps) {
  const health = useSystemHealth();
  const localization = useLocalization(filters?.tenantId);
  const branding = useBranding(filters?.tenantId);
  if (health.isLoading || localization.isLoading || branding.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <HealthDashboard services={(health.data ?? []).slice(0, 4)} />
      {localization.data && <LocalizationPanel localization={localization.data} readOnly />}
      {branding.data && <BrandingPanel branding={branding.data} readOnly />}
    </div>
  );
}

export function PlatformAdminSectionContent({
  section,
  filters,
  variant = 'admin',
}: {
  section: PlatformAdminSection;
  filters?: PlatformFilters;
  variant?: 'admin' | 'readonly';
}) {
  switch (section) {
    case 'tenants': return <TenantsSection filters={filters} />;
    case 'hospital-setup': return <HospitalSetupSection filters={filters} />;
    case 'facility-setup': return <FacilitySetupSection filters={filters} />;
    case 'departments': return <DepartmentsSection filters={filters} />;
    case 'localization': return <LocalizationSection filters={filters} variant={variant} />;
    case 'branding': return <BrandingSection filters={filters} variant={variant} />;
    case 'licenses': return <LicensesSection filters={filters} />;
    case 'storage': return <StorageSection filters={filters} />;
    case 'feature-flags-admin': return <FeatureFlagsSection filters={filters} />;
    case 'system-jobs': return <SystemJobsSection filters={filters} />;
    case 'system-health': return <SystemHealthSection />;
    case 'backups': return <BackupsSection filters={filters} />;
    case 'maintenance': return <MaintenanceSection filters={filters} />;
    case 'platform-audit': return <PlatformAuditSection filters={filters} />;
    case 'configurations': return <ConfigurationsSection filters={filters} />;
    case 'platform-settings': return <PlatformSettingsSection filters={filters} />;
    default: return <DashboardSection filters={filters} />;
  }
}
