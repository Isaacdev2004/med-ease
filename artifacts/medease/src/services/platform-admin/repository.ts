import { computePlatformAnalytics } from '@/services/platform-admin/analytics';
import { nextJobStatus } from '@/services/platform-admin/job-engine';
import { nextTenantStatus } from '@/services/platform-admin/tenant-engine';
import {
  MOCK_BACKUPS,
  MOCK_BRANDING,
  MOCK_DEPARTMENTS,
  MOCK_EMAIL_SERVERS,
  MOCK_FACILITIES,
  MOCK_FEATURE_FLAGS,
  MOCK_HOSPITALS,
  MOCK_LICENSES,
  MOCK_LOCALIZATION,
  MOCK_MAINTENANCE,
  MOCK_PLATFORM_AUDITS,
  MOCK_QUEUES,
  MOCK_SMS_SERVERS,
  MOCK_STORAGE,
  MOCK_SUBSCRIPTIONS,
  MOCK_SYSTEM_HEALTH,
  MOCK_SYSTEM_JOBS,
  MOCK_TENANTS,
  MOCK_WORKERS,
  buildPlatformDashboard,
} from '@/services/platform-admin/mock-data';
import type {
  CreateTenantInput,
  PlatformFilters,
  ScheduleMaintenanceInput,
  ToggleFeatureFlagInput,
  TriggerBackupInput,
  UpdateBrandingInput,
  UpdateFacilityInput,
  UpdateHospitalInput,
  UpdateLocalizationInput,
} from '@/services/platform-admin/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return { items: items.slice(start, start + pageSize), total: items.length, page: page ?? 1, pageSize: pageSize ?? 25 };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

function audit(action: string, resource: string, actorId = 'admin-001', tenantId?: string) {
  MOCK_PLATFORM_AUDITS.unshift({
    auditId: `pa-${Date.now()}`,
    tenantId,
    action,
    resource,
    actorId,
    outcome: 'success',
    ipAddress: '10.0.0.1',
    timestamp: new Date().toISOString(),
  });
}

class PlatformAdminRepository {
  private tenants = [...MOCK_TENANTS];
  private hospitals = [...MOCK_HOSPITALS];
  private facilities = [...MOCK_FACILITIES];
  private departments = [...MOCK_DEPARTMENTS];
  private localization = [...MOCK_LOCALIZATION];
  private branding = [...MOCK_BRANDING];
  private featureFlags = [...MOCK_FEATURE_FLAGS];
  private jobs = [...MOCK_SYSTEM_JOBS];
  private maintenance = [...MOCK_MAINTENANCE];
  private backups = [...MOCK_BACKUPS];
  private nextId = 880000;

  dashboard(tenantId?: string) { return buildPlatformDashboard(tenantId); }
  analytics(tenantId?: string) { return computePlatformAnalytics(tenantId); }

  getTenants(filters?: PlatformFilters) {
    let items = this.tenants;
    if (filters?.status) items = items.filter((t) => t.status === filters.status);
    if (filters?.q) items = items.filter((t) => matchQ(filters.q, t.name, t.slug, t.region));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getTenant(tenantId: string) { return this.tenants.find((t) => t.tenantId === tenantId) ?? null; }

  getHospitals(filters?: PlatformFilters) {
    let items = this.hospitals;
    if (filters?.tenantId) items = items.filter((h) => h.tenantId === filters.tenantId);
    if (filters?.q) items = items.filter((h) => matchQ(filters.q, h.name, h.code, h.city));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getHospital(hospitalId: string) { return this.hospitals.find((h) => h.hospitalId === hospitalId) ?? null; }

  getFacilities(filters?: PlatformFilters) {
    let items = this.facilities;
    if (filters?.tenantId) items = items.filter((f) => f.tenantId === filters.tenantId);
    if (filters?.facilityId) items = items.filter((f) => f.facilityId === filters.facilityId);
    if (filters?.q) items = items.filter((f) => matchQ(filters.q, f.name, f.type));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getFacility(facilityId: string) { return this.facilities.find((f) => f.facilityId === facilityId) ?? null; }

  getDepartments(filters?: PlatformFilters) {
    let items = this.departments;
    if (filters?.facilityId) items = items.filter((d) => d.facilityId === filters.facilityId);
    if (filters?.q) items = items.filter((d) => matchQ(filters.q, d.name, d.code, d.specialty));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getLocalization(tenantId?: string) {
    if (tenantId) return this.localization.find((l) => l.tenantId === tenantId) ?? null;
    return this.localization[0] ?? null;
  }

  getLocalizations(filters?: PlatformFilters) {
    let items = this.localization;
    if (filters?.tenantId) items = items.filter((l) => l.tenantId === filters.tenantId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getBranding(tenantId?: string) {
    if (tenantId) return this.branding.find((b) => b.tenantId === tenantId) ?? null;
    return this.branding[0] ?? null;
  }

  getBrandingList(filters?: PlatformFilters) {
    let items = this.branding;
    if (filters?.tenantId) items = items.filter((b) => b.tenantId === filters.tenantId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getLicenses(filters?: PlatformFilters) {
    let items = MOCK_LICENSES;
    if (filters?.tenantId) items = items.filter((l) => l.tenantId === filters.tenantId);
    if (filters?.status) items = items.filter((l) => l.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSubscriptions(filters?: PlatformFilters) {
    let items = MOCK_SUBSCRIPTIONS;
    if (filters?.tenantId) items = items.filter((s) => s.tenantId === filters.tenantId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getStorage(filters?: PlatformFilters) {
    let items = MOCK_STORAGE;
    if (filters?.tenantId) items = items.filter((s) => s.tenantId === filters.tenantId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getFeatureFlags(filters?: PlatformFilters) {
    let items = this.featureFlags;
    if (filters?.q) items = items.filter((f) => matchQ(filters.q, f.key, f.label, f.description));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getJobs(filters?: PlatformFilters) {
    let items = this.jobs;
    if (filters?.status) items = items.filter((j) => j.status === filters.status);
    if (filters?.q) items = items.filter((j) => matchQ(filters.q, j.name, j.type));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getWorkers() { return MOCK_WORKERS; }
  getQueues() { return MOCK_QUEUES; }

  getSystemHealth() { return MOCK_SYSTEM_HEALTH; }

  getBackups(filters?: PlatformFilters) {
    let items = this.backups;
    if (filters?.status) items = items.filter((b) => b.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getMaintenance(filters?: PlatformFilters) {
    let items = this.maintenance;
    if (filters?.status) items = items.filter((m) => m.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAudits(filters?: PlatformFilters) {
    let items = MOCK_PLATFORM_AUDITS;
    if (filters?.tenantId) items = items.filter((a) => a.tenantId === filters.tenantId);
    if (filters?.q) items = items.filter((a) => matchQ(filters.q, a.action, a.resource));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getEmailServers(tenantId?: string) {
    if (tenantId) return MOCK_EMAIL_SERVERS.filter((s) => s.tenantId === tenantId);
    return MOCK_EMAIL_SERVERS;
  }

  getSmsServers(tenantId?: string) {
    if (tenantId) return MOCK_SMS_SERVERS.filter((s) => s.tenantId === tenantId);
    return MOCK_SMS_SERVERS;
  }

  getConfigurations(tenantId?: string) {
    return {
      email: this.getEmailServers(tenantId),
      sms: this.getSmsServers(tenantId),
      localization: this.getLocalization(tenantId),
      branding: this.getBranding(tenantId),
    };
  }

  createTenant(input: CreateTenantInput) {
    const tenant = {
      tenantId: `ten-${this.nextId++}`,
      name: input.name,
      slug: input.slug,
      status: 'trial' as const,
      region: input.region,
      facilityCount: 0,
      userCount: 0,
      subscriptionTier: input.subscriptionTier,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tenants.unshift(tenant);
    audit('tenant.create', 'tenant', 'admin-001', tenant.tenantId);
    return tenant;
  }

  activateTenant(tenantId: string) {
    const tenant = this.tenants.find((t) => t.tenantId === tenantId);
    if (!tenant) return null;
    tenant.status = nextTenantStatus(tenant.status, 'activate');
    tenant.updatedAt = new Date().toISOString();
    audit('tenant.activate', 'tenant', 'admin-001', tenantId);
    return tenant;
  }

  suspendTenant(tenantId: string) {
    const tenant = this.tenants.find((t) => t.tenantId === tenantId);
    if (!tenant) return null;
    tenant.status = nextTenantStatus(tenant.status, 'suspend');
    tenant.updatedAt = new Date().toISOString();
    audit('tenant.suspend', 'tenant', 'admin-001', tenantId);
    return tenant;
  }

  updateHospital(input: UpdateHospitalInput) {
    const hospital = this.hospitals.find((h) => h.hospitalId === input.hospitalId);
    if (!hospital) return null;
    if (input.name) hospital.name = input.name;
    if (input.bedCapacity !== undefined) hospital.bedCapacity = input.bedCapacity;
    if (input.status) hospital.status = input.status;
    hospital.updatedAt = new Date().toISOString();
    audit('hospital.update', 'hospital', 'admin-001', hospital.tenantId);
    return hospital;
  }

  updateFacility(input: UpdateFacilityInput) {
    const facility = this.facilities.find((f) => f.facilityId === input.facilityId);
    if (!facility) return null;
    if (input.name) facility.name = input.name;
    if (input.timezone) facility.timezone = input.timezone;
    if (input.locale) facility.locale = input.locale;
    if (input.enabledModules) facility.enabledModules = input.enabledModules;
    facility.updatedAt = new Date().toISOString();
    audit('facility.update', 'facility', 'admin-001', facility.tenantId);
    return facility;
  }

  updateLocalization(input: UpdateLocalizationInput) {
    const loc = this.localization.find((l) => l.tenantId === input.tenantId);
    if (!loc) return null;
    if (input.defaultLanguage) loc.defaultLanguage = input.defaultLanguage;
    if (input.defaultCurrency) loc.defaultCurrency = input.defaultCurrency;
    if (input.defaultTimezone) loc.defaultTimezone = input.defaultTimezone;
    loc.updatedAt = new Date().toISOString();
    audit('localization.update', 'localization', 'admin-001', input.tenantId);
    return loc;
  }

  updateBranding(input: UpdateBrandingInput) {
    const brand = this.branding.find((b) => b.tenantId === input.tenantId);
    if (!brand) return null;
    if (input.primaryColor) brand.primaryColor = input.primaryColor;
    if (input.secondaryColor) brand.secondaryColor = input.secondaryColor;
    if (input.portalName) brand.portalName = input.portalName;
    brand.updatedAt = new Date().toISOString();
    audit('branding.update', 'branding', 'admin-001', input.tenantId);
    return brand;
  }

  toggleFeatureFlag(input: ToggleFeatureFlagInput) {
    const flag = this.featureFlags.find((f) => f.flagId === input.flagId);
    if (!flag) return null;
    flag.enabled = input.enabled;
    flag.updatedAt = new Date().toISOString();
    audit('flag.toggle', 'feature-flag');
    return flag;
  }

  retryJob(jobId: string) {
    const job = this.jobs.find((j) => j.jobId === jobId);
    if (!job || job.status !== 'failed') return null;
    job.status = nextJobStatus(job.status, 'start');
    job.errorMessage = undefined;
    audit('job.retry', 'system-job');
    return job;
  }

  scheduleMaintenance(input: ScheduleMaintenanceInput) {
    const entry = {
      maintenanceId: `mnt-${this.nextId++}`,
      title: input.title,
      message: input.message,
      status: 'scheduled' as const,
      scheduledStart: input.scheduledStart,
      scheduledEnd: input.scheduledEnd,
      affectedServices: input.affectedServices,
      createdBy: 'admin-001',
    };
    this.maintenance.unshift(entry);
    audit('maintenance.schedule', 'maintenance');
    return entry;
  }

  triggerBackup(input: TriggerBackupInput) {
    const backup = {
      backupId: `bkp-${this.nextId++}`,
      name: input.name,
      type: input.type,
      status: 'running' as const,
      sizeGb: 0,
      startedAt: new Date().toISOString(),
      retentionDays: 30,
    };
    this.backups.unshift(backup);
    audit('backup.trigger', 'backup');
    return backup;
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return { format, exportedAt: new Date().toISOString(), recordCount: this.tenants.length };
  }

  search(query: string, filters?: PlatformFilters) {
    const tenants = this.tenants.filter((t) => matchQ(query, t.name, t.slug));
    const facilities = this.facilities.filter((f) => matchQ(query, f.name));
    return {
      tenants: paginate(tenants, filters?.page, filters?.pageSize),
      facilities: paginate(facilities, filters?.page, filters?.pageSize),
    };
  }
}

export const platformAdminRepository = new PlatformAdminRepository();
