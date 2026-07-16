export type TenantStatus = 'active' | 'suspended' | 'trial' | 'archived';
export type JobStatus = 'queued' | 'running' | 'completed' | 'failed';
export type HealthStatus = 'healthy' | 'degraded' | 'critical';
export type BackupStatus = 'pending' | 'running' | 'completed' | 'failed';
export type MaintenanceStatus = 'scheduled' | 'active' | 'completed';
export type LicenseStatus = 'active' | 'expired' | 'trial' | 'suspended';
export type SubscriptionTier = 'starter' | 'professional' | 'enterprise';

export interface PlatformFilters {
  q?: string;
  tenantId?: string;
  facilityId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Tenant {
  tenantId: string;
  name: string;
  slug: string;
  status: TenantStatus;
  region: string;
  facilityCount: number;
  userCount: number;
  subscriptionTier: SubscriptionTier;
  createdAt: string;
  updatedAt: string;
}

export interface Hospital {
  hospitalId: string;
  tenantId: string;
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  bedCapacity: number;
  accreditation?: string;
  status: 'active' | 'inactive';
  updatedAt: string;
}

export interface FacilityConfig {
  facilityId: string;
  tenantId: string;
  hospitalId: string;
  name: string;
  type: string;
  timezone: string;
  locale: string;
  operatingHours: string;
  enabledModules: string[];
  status: 'active' | 'inactive';
  updatedAt: string;
}

export interface Department {
  departmentId: string;
  facilityId: string;
  name: string;
  code: string;
  specialty?: string;
  headOfDepartment?: string;
  staffCount: number;
  status: 'active' | 'inactive';
  updatedAt: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  enabled: boolean;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  enabled: boolean;
}

export interface Timezone {
  id: string;
  label: string;
  offset: string;
  enabled: boolean;
}

export interface Localization {
  localizationId: string;
  tenantId: string;
  defaultLanguage: string;
  defaultCurrency: string;
  defaultTimezone: string;
  dateFormat: string;
  timeFormat: string;
  languages: Language[];
  currencies: Currency[];
  timezones: Timezone[];
  updatedAt: string;
}

export interface EmailServerConfig {
  serverId: string;
  tenantId: string;
  host: string;
  port: number;
  fromAddress: string;
  useTls: boolean;
  enabled: boolean;
}

export interface SmsServerConfig {
  serverId: string;
  tenantId: string;
  provider: string;
  senderId: string;
  enabled: boolean;
}

export interface BrandingConfig {
  brandingId: string;
  tenantId: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  portalName: string;
  supportEmail: string;
  updatedAt: string;
}

export interface License {
  licenseId: string;
  tenantId: string;
  productName: string;
  status: LicenseStatus;
  seats: number;
  usedSeats: number;
  expiresAt: string;
  issuedAt: string;
}

export interface Subscription {
  subscriptionId: string;
  tenantId: string;
  tier: SubscriptionTier;
  billingCycle: 'monthly' | 'annual';
  amount: number;
  currency: string;
  renewsAt: string;
  status: 'active' | 'past_due' | 'cancelled';
}

export interface StorageConfig {
  configId: string;
  tenantId: string;
  provider: string;
  bucket: string;
  region: string;
  maxStorageGb: number;
  usedStorageGb: number;
  retentionDays: number;
  encryptionEnabled: boolean;
}

export interface FeatureFlagConfig {
  flagId: string;
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  scope: 'global' | 'tenant' | 'facility';
  updatedAt: string;
}

export interface SystemJob {
  jobId: string;
  name: string;
  type: string;
  status: JobStatus;
  queue: string;
  priority: number;
  startedAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface BackgroundWorker {
  workerId: string;
  name: string;
  queue: string;
  status: 'idle' | 'busy' | 'offline';
  processedCount: number;
  lastHeartbeat: string;
}

export interface QueueConfig {
  queueId: string;
  name: string;
  pendingCount: number;
  processingCount: number;
  failedCount: number;
  maxRetries: number;
  enabled: boolean;
}

export interface SystemHealth {
  healthId: string;
  service: string;
  status: HealthStatus;
  latencyMs: number;
  uptimePercent: number;
  lastChecked: string;
  message?: string;
}

export interface BackupJob {
  backupId: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: BackupStatus;
  sizeGb: number;
  startedAt: string;
  completedAt?: string;
  retentionDays: number;
}

export interface MaintenanceMode {
  maintenanceId: string;
  title: string;
  message: string;
  status: MaintenanceStatus;
  scheduledStart: string;
  scheduledEnd: string;
  affectedServices: string[];
  createdBy: string;
}

export interface PlatformAudit {
  auditId: string;
  tenantId?: string;
  action: string;
  resource: string;
  actorId: string;
  outcome: 'success' | 'failure';
  ipAddress?: string;
  timestamp: string;
}

export interface PlatformDashboard {
  totalTenants: number;
  activeTenants: number;
  totalFacilities: number;
  totalUsers: number;
  systemHealthScore: number;
  pendingJobs: number;
  failedJobs: number;
  storageUsedGb: number;
  storageCapacityGb: number;
  tenantTrend: { label: string; value: number }[];
  regionBreakdown: { label: string; value: number }[];
  recentAudits: PlatformAudit[];
}

export interface PlatformAnalytics {
  tenantGrowthRate: number;
  avgFacilitiesPerTenant: number;
  licenseUtilizationRate: number;
  storageUtilizationRate: number;
  jobSuccessRate: number;
  systemUptimePercent: number;
  tenantTrend: { label: string; value: number }[];
  regionBreakdown: { label: string; value: number }[];
  healthTrend: { label: string; value: number }[];
}

export interface PlatformPermissions {
  canView: boolean;
  canWrite: boolean;
  canTenants: boolean;
  canFacilities: boolean;
  canLocalization: boolean;
  canBranding: boolean;
  canJobs: boolean;
  canHealth: boolean;
  canAudit: boolean;
  canAdmin: boolean;
}

export interface CreateTenantInput {
  name: string;
  slug: string;
  region: string;
  subscriptionTier: SubscriptionTier;
}

export interface UpdateHospitalInput {
  hospitalId: string;
  name?: string;
  bedCapacity?: number;
  status?: 'active' | 'inactive';
}

export interface UpdateFacilityInput {
  facilityId: string;
  name?: string;
  timezone?: string;
  locale?: string;
  enabledModules?: string[];
}

export interface UpdateLocalizationInput {
  tenantId: string;
  defaultLanguage?: string;
  defaultCurrency?: string;
  defaultTimezone?: string;
}

export interface UpdateBrandingInput {
  tenantId: string;
  primaryColor?: string;
  secondaryColor?: string;
  portalName?: string;
}

export interface ToggleFeatureFlagInput {
  flagId: string;
  enabled: boolean;
}

export interface ScheduleMaintenanceInput {
  title: string;
  message: string;
  scheduledStart: string;
  scheduledEnd: string;
  affectedServices: string[];
}

export interface TriggerBackupInput {
  name: string;
  type: 'full' | 'incremental' | 'differential';
}
