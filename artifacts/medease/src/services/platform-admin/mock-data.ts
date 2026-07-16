import { isBrandingAccessible } from '@/services/platform-admin/branding-engine';
import { computeHealthScore, systemUptimePercent } from '@/services/platform-admin/health-engine';
import { jobSuccessRate, queueDepth, runningJobCount } from '@/services/platform-admin/job-engine';
import { activeTenantCount, tenantGrowthRate } from '@/services/platform-admin/tenant-engine';
import type {
  BackupJob,
  BackgroundWorker,
  BrandingConfig,
  Department,
  EmailServerConfig,
  FacilityConfig,
  FeatureFlagConfig,
  Hospital,
  License,
  Localization,
  MaintenanceMode,
  PlatformAnalytics,
  PlatformAudit,
  PlatformDashboard,
  QueueConfig,
  SmsServerConfig,
  StorageConfig,
  Subscription,
  SystemHealth,
  SystemJob,
  Tenant,
} from '@/services/platform-admin/types';

const SCALE = { tenants: 40, hospitals: 80, facilities: 120, departments: 200, jobs: 100, audits: 500 };
const ENTERPRISE = { tenants: 250, facilities: 1200, users: 85_000, storageGb: 48_000 };

const REGIONS = ['us-east', 'us-west', 'eu-west', 'ap-south', 'me-central'];
const TIERS = ['starter', 'professional', 'enterprise'] as const;
const MODULES = ['clinical', 'billing', 'workforce', 'inventory', 'quality', 'iam', 'documents', 'workflows'];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_TENANTS: Tenant[] = Array.from({ length: SCALE.tenants }, (_, i) => ({
  tenantId: `ten-${String(i + 1).padStart(4, '0')}`,
  name: `Health System ${i + 1}`,
  slug: `health-system-${i + 1}`,
  status: (['active', 'active', 'trial', 'suspended', 'archived'] as const)[i % 5]!,
  region: REGIONS[i % REGIONS.length]!,
  facilityCount: 2 + (i % 12),
  userCount: 50 + i * 120,
  subscriptionTier: TIERS[i % TIERS.length]!,
  createdAt: daysAgo(365 - i * 10),
  updatedAt: daysAgo(i % 30),
}));

export const MOCK_HOSPITALS: Hospital[] = Array.from({ length: SCALE.hospitals }, (_, i) => ({
  hospitalId: `hosp-${String(i + 1).padStart(4, '0')}`,
  tenantId: MOCK_TENANTS[i % MOCK_TENANTS.length]!.tenantId,
  name: `General Hospital ${i + 1}`,
  code: `GH-${String(i + 1).padStart(3, '0')}`,
  address: `${100 + i} Medical Center Dr`,
  city: ['Boston', 'Chicago', 'London', 'Dubai', 'Mumbai'][i % 5]!,
  country: ['US', 'US', 'UK', 'AE', 'IN'][i % 5]!,
  bedCapacity: 100 + (i % 20) * 25,
  accreditation: i % 3 === 0 ? 'JCI' : 'ISO 9001',
  status: i % 8 === 0 ? 'inactive' as const : 'active' as const,
  updatedAt: daysAgo(i % 20),
}));

export const MOCK_FACILITIES: FacilityConfig[] = Array.from({ length: SCALE.facilities }, (_, i) => ({
  facilityId: `fac-${String(i + 1).padStart(4, '0')}`,
  tenantId: MOCK_TENANTS[i % MOCK_TENANTS.length]!.tenantId,
  hospitalId: MOCK_HOSPITALS[i % MOCK_HOSPITALS.length]!.hospitalId,
  name: `Facility ${i + 1}`,
  type: ['outpatient', 'inpatient', 'emergency', 'specialty'][i % 4]!,
  timezone: ['America/New_York', 'Europe/London', 'Asia/Dubai'][i % 3]!,
  locale: ['en-US', 'en-GB', 'ar-AE'][i % 3]!,
  operatingHours: 'Mon–Fri 08:00–18:00',
  enabledModules: MODULES.slice(0, 4 + (i % 4)),
  status: i % 10 === 0 ? 'inactive' as const : 'active' as const,
  updatedAt: daysAgo(i % 15),
}));

export const MOCK_DEPARTMENTS: Department[] = Array.from({ length: SCALE.departments }, (_, i) => ({
  departmentId: `dept-${String(i + 1).padStart(4, '0')}`,
  facilityId: MOCK_FACILITIES[i % MOCK_FACILITIES.length]!.facilityId,
  name: ['Emergency', 'Cardiology', 'Radiology', 'Pharmacy', 'Laboratory'][i % 5]!,
  code: `D-${String(i + 1).padStart(3, '0')}`,
  specialty: ['Emergency Medicine', 'Cardiology', 'Diagnostic Imaging'][i % 3],
  headOfDepartment: `Dr. Smith ${(i % 10) + 1}`,
  staffCount: 10 + (i % 50),
  status: i % 12 === 0 ? 'inactive' as const : 'active' as const,
  updatedAt: daysAgo(i % 10),
}));

export const MOCK_LOCALIZATION: Localization[] = MOCK_TENANTS.slice(0, 15).map((t, i) => ({
  localizationId: `loc-${String(i + 1).padStart(3, '0')}`,
  tenantId: t.tenantId,
  defaultLanguage: 'en-US',
  defaultCurrency: 'USD',
  defaultTimezone: 'America/New_York',
  dateFormat: 'MM/dd/yyyy',
  timeFormat: 'HH:mm',
  languages: [
    { code: 'en-US', name: 'English (US)', nativeName: 'English', enabled: true },
    { code: 'es-ES', name: 'Spanish', nativeName: 'Español', enabled: i % 2 === 0 },
    { code: 'fr-FR', name: 'French', nativeName: 'Français', enabled: i % 3 === 0 },
  ],
  currencies: [
    { code: 'USD', name: 'US Dollar', symbol: '$', enabled: true },
    { code: 'EUR', name: 'Euro', symbol: '€', enabled: i % 2 === 0 },
    { code: 'GBP', name: 'British Pound', symbol: '£', enabled: i % 4 === 0 },
  ],
  timezones: [
    { id: 'America/New_York', label: 'Eastern Time', offset: 'UTC-5', enabled: true },
    { id: 'Europe/London', label: 'GMT', offset: 'UTC+0', enabled: true },
    { id: 'Asia/Dubai', label: 'Gulf Standard Time', offset: 'UTC+4', enabled: i % 2 === 0 },
  ],
  updatedAt: daysAgo(i % 20),
}));

export const MOCK_EMAIL_SERVERS: EmailServerConfig[] = MOCK_TENANTS.slice(0, 10).map((t, i) => ({
  serverId: `email-${String(i + 1).padStart(3, '0')}`,
  tenantId: t.tenantId,
  host: `smtp.tenant${i + 1}.medease.io`,
  port: 587,
  fromAddress: `noreply@tenant${i + 1}.medease.io`,
  useTls: true,
  enabled: i % 5 !== 0,
}));

export const MOCK_SMS_SERVERS: SmsServerConfig[] = MOCK_TENANTS.slice(0, 10).map((t, i) => ({
  serverId: `sms-${String(i + 1).padStart(3, '0')}`,
  tenantId: t.tenantId,
  provider: ['Twilio', 'AWS SNS', 'MessageBird'][i % 3]!,
  senderId: `MedEase${i + 1}`,
  enabled: i % 4 !== 0,
}));

export const MOCK_BRANDING: BrandingConfig[] = MOCK_TENANTS.slice(0, 15).map((t, i) => ({
  brandingId: `brand-${String(i + 1).padStart(3, '0')}`,
  tenantId: t.tenantId,
  logoUrl: `/assets/tenants/${t.slug}/logo.svg`,
  primaryColor: ['#2563eb', '#059669', '#7c3aed', '#dc2626'][i % 4]!,
  secondaryColor: '#64748b',
  accentColor: '#f59e0b',
  fontFamily: 'Inter, sans-serif',
  portalName: `${t.name} Portal`,
  supportEmail: `support@${t.slug}.medease.io`,
  updatedAt: daysAgo(i % 25),
}));

export const MOCK_LICENSES: License[] = MOCK_TENANTS.map((t, i) => ({
  licenseId: `lic-${String(i + 1).padStart(4, '0')}`,
  tenantId: t.tenantId,
  productName: 'Med-Ease Enterprise',
  status: (['active', 'active', 'trial', 'expired'] as const)[i % 4]!,
  seats: 100 + (i % 10) * 50,
  usedSeats: 40 + (i % 10) * 30,
  expiresAt: daysAgo(-(90 + i * 10)),
  issuedAt: daysAgo(365),
}));

export const MOCK_SUBSCRIPTIONS: Subscription[] = MOCK_TENANTS.map((t, i) => ({
  subscriptionId: `sub-${String(i + 1).padStart(4, '0')}`,
  tenantId: t.tenantId,
  tier: t.subscriptionTier,
  billingCycle: i % 2 === 0 ? 'annual' as const : 'monthly' as const,
  amount: t.subscriptionTier === 'enterprise' ? 12000 : t.subscriptionTier === 'professional' ? 4500 : 1200,
  currency: 'USD',
  renewsAt: daysAgo(-(30 + i * 5)),
  status: (['active', 'active', 'past_due', 'cancelled'] as const)[i % 4]!,
}));

export const MOCK_STORAGE: StorageConfig[] = MOCK_TENANTS.slice(0, 20).map((t, i) => ({
  configId: `stor-${String(i + 1).padStart(3, '0')}`,
  tenantId: t.tenantId,
  provider: ['AWS S3', 'Azure Blob', 'GCP Storage'][i % 3]!,
  bucket: `medease-${t.slug}`,
  region: REGIONS[i % REGIONS.length]!,
  maxStorageGb: 500 + i * 100,
  usedStorageGb: 120 + i * 45,
  retentionDays: 365,
  encryptionEnabled: true,
}));

export const MOCK_FEATURE_FLAGS: FeatureFlagConfig[] = [
  { flagId: 'ff-001', key: 'platformAdmin', label: 'Platform Admin', description: 'Multi-tenant platform administration', enabled: true, scope: 'global', updatedAt: daysAgo(1) },
  { flagId: 'ff-002', key: 'telemedicine', label: 'Telemedicine', description: 'Virtual visit capabilities', enabled: true, scope: 'tenant', updatedAt: daysAgo(2) },
  { flagId: 'ff-003', key: 'aiAssistant', label: 'AI Assistant', description: 'Clinical AI copilot', enabled: false, scope: 'tenant', updatedAt: daysAgo(3) },
  { flagId: 'ff-004', key: 'offlineMode', label: 'Offline Mode', description: 'Offline-first sync', enabled: false, scope: 'global', updatedAt: daysAgo(5) },
  { flagId: 'ff-005', key: 'whiteLabel', label: 'White Label', description: 'Custom branding per tenant', enabled: true, scope: 'tenant', updatedAt: daysAgo(7) },
  { flagId: 'ff-006', key: 'workflows', label: 'Workflows', description: 'BPMN workflow engine', enabled: true, scope: 'global', updatedAt: daysAgo(1) },
  { flagId: 'ff-007', key: 'research', label: 'Research Module', description: 'Clinical research tools', enabled: true, scope: 'facility', updatedAt: daysAgo(10) },
  { flagId: 'ff-008', key: 'cdss', label: 'CDSS', description: 'Clinical decision support', enabled: true, scope: 'facility', updatedAt: daysAgo(4) },
];

export const MOCK_SYSTEM_JOBS: SystemJob[] = Array.from({ length: SCALE.jobs }, (_, i) => ({
  jobId: `sjob-${String(i + 1).padStart(4, '0')}`,
  name: ['Tenant Sync', 'Backup', 'Index Rebuild', 'Email Dispatch', 'Report Generation'][i % 5]!,
  type: ['sync', 'backup', 'index', 'notification', 'report'][i % 5]!,
  status: (['queued', 'running', 'completed', 'failed'] as const)[i % 4]!,
  queue: ['default', 'high-priority', 'low-priority'][i % 3]!,
  priority: 1 + (i % 5),
  startedAt: daysAgo(i % 3),
  completedAt: i % 4 >= 2 ? daysAgo(i % 2) : undefined,
  errorMessage: i % 4 === 3 ? 'Connection timeout' : undefined,
}));

export const MOCK_WORKERS: BackgroundWorker[] = Array.from({ length: 12 }, (_, i) => ({
  workerId: `wrk-${String(i + 1).padStart(3, '0')}`,
  name: `Worker ${i + 1}`,
  queue: ['default', 'high-priority', 'low-priority'][i % 3]!,
  status: (['idle', 'busy', 'offline'] as const)[i % 3]!,
  processedCount: 1000 + i * 500,
  lastHeartbeat: daysAgo(-(i % 2)),
}));

export const MOCK_QUEUES: QueueConfig[] = [
  { queueId: 'q-001', name: 'default', pendingCount: 24, processingCount: 4, failedCount: 2, maxRetries: 3, enabled: true },
  { queueId: 'q-002', name: 'high-priority', pendingCount: 8, processingCount: 2, failedCount: 0, maxRetries: 5, enabled: true },
  { queueId: 'q-003', name: 'low-priority', pendingCount: 56, processingCount: 1, failedCount: 5, maxRetries: 2, enabled: true },
  { queueId: 'q-004', name: 'notifications', pendingCount: 120, processingCount: 8, failedCount: 3, maxRetries: 3, enabled: true },
];

export const MOCK_SYSTEM_HEALTH: SystemHealth[] = [
  { healthId: 'h-001', service: 'API Gateway', status: 'healthy', latencyMs: 45, uptimePercent: 99.99, lastChecked: daysAgo(0) },
  { healthId: 'h-002', service: 'Database', status: 'healthy', latencyMs: 12, uptimePercent: 99.95, lastChecked: daysAgo(0) },
  { healthId: 'h-003', service: 'Search Index', status: 'degraded', latencyMs: 180, uptimePercent: 98.5, lastChecked: daysAgo(0), message: 'Elevated latency' },
  { healthId: 'h-004', service: 'Job Processor', status: 'healthy', latencyMs: 85, uptimePercent: 99.8, lastChecked: daysAgo(0) },
  { healthId: 'h-005', service: 'Storage', status: 'healthy', latencyMs: 95, uptimePercent: 99.99, lastChecked: daysAgo(0) },
  { healthId: 'h-006', service: 'Email Service', status: 'degraded', latencyMs: 320, uptimePercent: 97.2, lastChecked: daysAgo(0), message: 'SMTP queue backlog' },
  { healthId: 'h-007', service: 'Auth Service', status: 'healthy', latencyMs: 38, uptimePercent: 99.99, lastChecked: daysAgo(0) },
  { healthId: 'h-008', service: 'CDN', status: 'healthy', latencyMs: 22, uptimePercent: 99.99, lastChecked: daysAgo(0) },
];

export const MOCK_BACKUPS: BackupJob[] = Array.from({ length: 30 }, (_, i) => ({
  backupId: `bkp-${String(i + 1).padStart(3, '0')}`,
  name: `Backup ${i + 1}`,
  type: (['full', 'incremental', 'differential'] as const)[i % 3]!,
  status: (['completed', 'completed', 'running', 'failed', 'pending'] as const)[i % 5]!,
  sizeGb: 50 + i * 10,
  startedAt: daysAgo(i % 7),
  completedAt: i % 5 !== 2 ? daysAgo(i % 6) : undefined,
  retentionDays: 30 + (i % 3) * 30,
}));

export const MOCK_MAINTENANCE: MaintenanceMode[] = Array.from({ length: 8 }, (_, i) => ({
  maintenanceId: `mnt-${String(i + 1).padStart(3, '0')}`,
  title: `Maintenance Window ${i + 1}`,
  message: 'Scheduled platform upgrade and database migration.',
  status: (['scheduled', 'active', 'completed'] as const)[i % 3]!,
  scheduledStart: daysAgo(-(i % 3)),
  scheduledEnd: daysAgo(-(i % 3) + 1),
  affectedServices: ['API Gateway', 'Database'].slice(0, 1 + (i % 2)),
  createdBy: 'admin-001',
}));

export const MOCK_PLATFORM_AUDITS: PlatformAudit[] = Array.from({ length: SCALE.audits }, (_, i) => ({
  auditId: `pa-${String(i + 1).padStart(5, '0')}`,
  tenantId: i % 3 === 0 ? MOCK_TENANTS[i % MOCK_TENANTS.length]!.tenantId : undefined,
  action: ['tenant.create', 'tenant.suspend', 'branding.update', 'flag.toggle', 'backup.trigger', 'maintenance.schedule'][i % 6]!,
  resource: ['tenant', 'branding', 'feature-flag', 'backup', 'maintenance'][i % 5]!,
  actorId: `admin-${String((i % 5) + 1).padStart(3, '0')}`,
  outcome: i % 15 === 0 ? 'failure' as const : 'success' as const,
  ipAddress: `10.0.${(i % 255)}.${(i % 200) + 1}`,
  timestamp: daysAgo(i % 30),
}));

export function buildPlatformDashboard(tenantId?: string): PlatformDashboard {
  let tenants = MOCK_TENANTS;
  if (tenantId) tenants = tenants.filter((t) => t.tenantId === tenantId);

  const storage = MOCK_STORAGE;
  const usedGb = storage.reduce((s, c) => s + c.usedStorageGb, 0);
  const capacityGb = storage.reduce((s, c) => s + c.maxStorageGb, 0);

  return {
    totalTenants: ENTERPRISE.tenants,
    activeTenants: activeTenantCount(tenants) * 6,
    totalFacilities: ENTERPRISE.facilities,
    totalUsers: ENTERPRISE.users,
    systemHealthScore: computeHealthScore(MOCK_SYSTEM_HEALTH),
    pendingJobs: queueDepth(MOCK_QUEUES),
    failedJobs: MOCK_SYSTEM_JOBS.filter((j) => j.status === 'failed').length * 3,
    storageUsedGb: usedGb * 40,
    storageCapacityGb: capacityGb * 40,
    tenantTrend: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((label, i) => ({
      label,
      value: 15 + i * 8,
    })),
    regionBreakdown: REGIONS.map((label) => ({
      label,
      value: tenants.filter((t) => t.region === label).length * 50,
    })),
    recentAudits: MOCK_PLATFORM_AUDITS.slice(0, 8),
  };
}

export function computePlatformAnalytics(tenantId?: string): PlatformAnalytics {
  let tenants = MOCK_TENANTS;
  if (tenantId) tenants = tenants.filter((t) => t.tenantId === tenantId);
  const dashboard = buildPlatformDashboard(tenantId);
  const storage = MOCK_STORAGE;
  const usedGb = storage.reduce((s, c) => s + c.usedStorageGb, 0);
  const capacityGb = storage.reduce((s, c) => s + c.maxStorageGb, 0);
  const licenses = MOCK_LICENSES;
  const totalSeats = licenses.reduce((s, l) => s + l.seats, 0);
  const usedSeats = licenses.reduce((s, l) => s + l.usedSeats, 0);

  return {
    tenantGrowthRate: tenantGrowthRate(tenants),
    avgFacilitiesPerTenant: Math.round(MOCK_FACILITIES.length / tenants.length * 10) / 10,
    licenseUtilizationRate: totalSeats > 0 ? Math.round((usedSeats / totalSeats) * 100) : 0,
    storageUtilizationRate: capacityGb > 0 ? Math.round((usedGb / capacityGb) * 100) : 0,
    jobSuccessRate: jobSuccessRate(MOCK_SYSTEM_JOBS),
    systemUptimePercent: systemUptimePercent(MOCK_SYSTEM_HEALTH),
    tenantTrend: dashboard.tenantTrend,
    regionBreakdown: dashboard.regionBreakdown,
    healthTrend: ['W1', 'W2', 'W3', 'W4'].map((label, i) => ({
      label,
      value: 95 + i,
    })),
  };
}

export { isBrandingAccessible, runningJobCount };
