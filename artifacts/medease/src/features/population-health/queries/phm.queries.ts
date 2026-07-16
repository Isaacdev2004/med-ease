import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { populationHealthService } from '@/services/population-health/population-health.service';
import type { PhmFilters } from '@/services/population-health/types';

export const phmQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.phm.dashboard(facilityId),
    queryFn: () => populationHealthService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.phm.analytics(facilityId),
    queryFn: () => populationHealthService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  population: (filters?: PhmFilters) => ({
    queryKey: queryKeys.phm.population(filters as Record<string, unknown> | undefined),
    queryFn: () => populationHealthService.getPopulation(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  highRiskPatients: (filters?: PhmFilters) => ({
    queryKey: queryKeys.phm.highRiskPatients(filters as Record<string, unknown> | undefined),
    queryFn: () => populationHealthService.getHighRiskPatients(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  registries: (filters?: PhmFilters) => ({
    queryKey: queryKeys.phm.registries(filters as Record<string, unknown> | undefined),
    queryFn: () => populationHealthService.getRegistries(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  careGaps: (filters?: PhmFilters) => ({
    queryKey: queryKeys.phm.careGaps(filters as Record<string, unknown> | undefined),
    queryFn: () => populationHealthService.getCareGaps(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  riskScores: (filters?: PhmFilters) => ({
    queryKey: queryKeys.phm.riskScores(filters as Record<string, unknown> | undefined),
    queryFn: () => populationHealthService.getRiskScores(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  cohorts: (filters?: PhmFilters) => ({
    queryKey: queryKeys.phm.cohorts(filters as Record<string, unknown> | undefined),
    queryFn: () => populationHealthService.getCohorts(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  chronicPrograms: (filters?: PhmFilters) => ({
    queryKey: queryKeys.phm.chronicPrograms(filters as Record<string, unknown> | undefined),
    queryFn: () => populationHealthService.getChronicPrograms(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  preventiveCare: (filters?: PhmFilters) => ({
    queryKey: queryKeys.phm.preventiveCare(filters as Record<string, unknown> | undefined),
    queryFn: () => populationHealthService.getPreventiveCare(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  outreach: (filters?: PhmFilters) => ({
    queryKey: queryKeys.phm.outreach(filters as Record<string, unknown> | undefined),
    queryFn: () => populationHealthService.getOutreach(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  communityHealth: (filters?: PhmFilters) => ({
    queryKey: queryKeys.phm.communityHealth(filters as Record<string, unknown> | undefined),
    queryFn: () => populationHealthService.getCommunityHealth(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  geographicRegions: () => ({
    queryKey: queryKeys.phm.geographicRegions(),
    queryFn: () => populationHealthService.getGeographicRegions(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.phm.favorites(userId),
    queryFn: () => populationHealthService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
  search: (query: string, facilityId?: string) => ({
    queryKey: queryKeys.phm.search(query, facilityId),
    queryFn: () => populationHealthService.search(query, facilityId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
