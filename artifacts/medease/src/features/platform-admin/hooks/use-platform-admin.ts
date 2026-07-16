import { useQuery } from '@tanstack/react-query';

import { platformAdminQueries } from '@/features/platform-admin/queries/platform-admin.queries';
import type { PlatformFilters } from '@/services/platform-admin/types';

export function usePlatformDashboard(tenantId?: string) {
  return useQuery(platformAdminQueries.dashboard(tenantId));
}

export function usePlatformAnalytics(tenantId?: string) {
  return useQuery(platformAdminQueries.analytics(tenantId));
}

export function useTenants(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.tenants(filters));
}

export function useHospitals(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.hospitals(filters));
}

export function useFacilities(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.facilities(filters));
}

export function useDepartments(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.departments(filters));
}

export function useLocalization(tenantId?: string) {
  return useQuery(platformAdminQueries.localization(tenantId));
}

export function useLocalizations(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.localizations(filters));
}

export function useBranding(tenantId?: string) {
  return useQuery(platformAdminQueries.branding(tenantId));
}

export function useLicenses(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.licenses(filters));
}

export function useStorage(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.storage(filters));
}

export function useFeatureFlags(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.featureFlags(filters));
}

export function useSystemJobs(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.jobs(filters));
}

export function useWorkers() {
  return useQuery(platformAdminQueries.workers());
}

export function useQueues() {
  return useQuery(platformAdminQueries.queues());
}

export function useSystemHealth() {
  return useQuery(platformAdminQueries.systemHealth());
}

export function useBackups(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.backups(filters));
}

export function useMaintenance(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.maintenance(filters));
}

export function usePlatformAudits(filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.audits(filters));
}

export function useConfigurations(tenantId?: string) {
  return useQuery(platformAdminQueries.configurations(tenantId));
}

export function usePlatformSearch(query: string, filters?: PlatformFilters) {
  return useQuery(platformAdminQueries.search(query, filters));
}
