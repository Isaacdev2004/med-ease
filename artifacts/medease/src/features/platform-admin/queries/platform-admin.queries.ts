import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { platformAdminService } from '@/services/platform-admin/platform-admin.service';
import type { PlatformFilters } from '@/services/platform-admin/types';

export const platformAdminQueries = {
  dashboard: (tenantId?: string) => ({
    queryKey: queryKeys.platformAdmin.dashboard(tenantId),
    queryFn: () => platformAdminService.dashboard(tenantId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (tenantId?: string) => ({
    queryKey: queryKeys.platformAdmin.analytics(tenantId),
    queryFn: () => platformAdminService.analytics(tenantId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  tenants: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.tenants(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getTenants(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  tenant: (tenantId: string) => ({
    queryKey: queryKeys.platformAdmin.tenant(tenantId),
    queryFn: () => platformAdminService.getTenant(tenantId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(tenantId),
  }),
  hospitals: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.hospitals(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getHospitals(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  facilities: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.facilities(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getFacilities(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  departments: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.departments(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getDepartments(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  localization: (tenantId?: string) => ({
    queryKey: queryKeys.platformAdmin.localization(tenantId),
    queryFn: () => platformAdminService.getLocalization(tenantId),
    staleTime: CACHE_TIMES.default,
  }),
  localizations: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.localizations(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getLocalizations(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  branding: (tenantId?: string) => ({
    queryKey: queryKeys.platformAdmin.branding(tenantId),
    queryFn: () => platformAdminService.getBranding(tenantId),
    staleTime: CACHE_TIMES.default,
  }),
  licenses: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.licenses(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getLicenses(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  storage: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.storage(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getStorage(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  featureFlags: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.featureFlags(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getFeatureFlags(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  jobs: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.jobs(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getJobs(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  workers: () => ({
    queryKey: queryKeys.platformAdmin.workers(),
    queryFn: () => platformAdminService.getWorkers(),
    staleTime: CACHE_TIMES.patientList,
  }),
  queues: () => ({
    queryKey: queryKeys.platformAdmin.queues(),
    queryFn: () => platformAdminService.getQueues(),
    staleTime: CACHE_TIMES.patientList,
  }),
  systemHealth: () => ({
    queryKey: queryKeys.platformAdmin.systemHealth(),
    queryFn: () => platformAdminService.getSystemHealth(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  backups: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.backups(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getBackups(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  maintenance: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.maintenance(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getMaintenance(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  audits: (filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.audits(filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.getAudits(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  configurations: (tenantId?: string) => ({
    queryKey: queryKeys.platformAdmin.configurations(tenantId),
    queryFn: () => platformAdminService.getConfigurations(tenantId),
    staleTime: CACHE_TIMES.default,
  }),
  search: (query: string, filters?: PlatformFilters) => ({
    queryKey: queryKeys.platformAdmin.search(query, filters as Record<string, unknown> | undefined),
    queryFn: () => platformAdminService.search(query, filters),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
