import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { executiveService } from '@/services/executive/executive.service';
import type { ExecutiveFilters } from '@/services/executive/types';

export const executiveQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.executive.dashboard(facilityId),
    queryFn: () => executiveService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.executive.analytics(facilityId),
    queryFn: () => executiveService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  enterpriseKpis: (filters?: ExecutiveFilters) => ({
    queryKey: queryKeys.executive.enterpriseKpis(filters as Record<string, unknown> | undefined),
    queryFn: () => executiveService.getEnterpriseKpis(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  operationalMetrics: (filters?: ExecutiveFilters) => ({
    queryKey: queryKeys.executive.operationalMetrics(filters as Record<string, unknown> | undefined),
    queryFn: () => executiveService.getOperationalMetrics(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  departmentScorecards: (filters?: ExecutiveFilters) => ({
    queryKey: queryKeys.executive.departmentScorecards(filters as Record<string, unknown> | undefined),
    queryFn: () => executiveService.getDepartmentScorecards(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  hospitalOperations: (facilityId?: string) => ({
    queryKey: queryKeys.executive.hospitalOperations(facilityId),
    queryFn: () => executiveService.getHospitalOperations(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  capacityAnalytics: (filters?: ExecutiveFilters) => ({
    queryKey: queryKeys.executive.capacityAnalytics(filters as Record<string, unknown> | undefined),
    queryFn: () => executiveService.getCapacityAnalytics(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  patientFlow: (facilityId?: string) => ({
    queryKey: queryKeys.executive.patientFlow(facilityId),
    queryFn: () => executiveService.getPatientFlow(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  revenueDashboard: (facilityId?: string) => ({
    queryKey: queryKeys.executive.revenueDashboard(facilityId),
    queryFn: () => executiveService.getRevenueDashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  qualityDashboard: (facilityId?: string) => ({
    queryKey: queryKeys.executive.qualityDashboard(facilityId),
    queryFn: () => executiveService.getQualityDashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  workforceDashboard: (facilityId?: string) => ({
    queryKey: queryKeys.executive.workforceDashboard(facilityId),
    queryFn: () => executiveService.getWorkforceDashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  populationDashboard: (facilityId?: string) => ({
    queryKey: queryKeys.executive.populationDashboard(facilityId),
    queryFn: () => executiveService.getPopulationDashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  executiveForecasts: (filters?: ExecutiveFilters) => ({
    queryKey: queryKeys.executive.forecasts(filters as Record<string, unknown> | undefined),
    queryFn: () => executiveService.getExecutiveForecasts(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  strategicInitiatives: (filters?: ExecutiveFilters) => ({
    queryKey: queryKeys.executive.strategicInitiatives(filters as Record<string, unknown> | undefined),
    queryFn: () => executiveService.getStrategicInitiatives(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  executiveAlerts: (filters?: ExecutiveFilters) => ({
    queryKey: queryKeys.executive.alerts(filters as Record<string, unknown> | undefined),
    queryFn: () => executiveService.getExecutiveAlerts(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  benchmarkReports: (filters?: ExecutiveFilters) => ({
    queryKey: queryKeys.executive.benchmarks(filters as Record<string, unknown> | undefined),
    queryFn: () => executiveService.getBenchmarkReports(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  search: (query: string, facilityId?: string) => ({
    queryKey: queryKeys.executive.search(query, facilityId),
    queryFn: () => executiveService.search(query, facilityId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.executive.favorites(userId),
    queryFn: () => executiveService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
};
