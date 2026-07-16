import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { publicHealthService } from '@/services/public-health/public-health.service';
import type { PublicHealthFilters } from '@/services/public-health/types';

export const publicHealthQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.publicHealth.dashboard(facilityId),
    queryFn: () => publicHealthService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.publicHealth.analytics(facilityId),
    queryFn: () => publicHealthService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  cases: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.cases(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getCases(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  case: (caseId: string) => ({
    queryKey: queryKeys.publicHealth.case(caseId),
    queryFn: () => publicHealthService.getCase(caseId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(caseId),
  }),
  outbreaks: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.outbreaks(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getOutbreaks(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  contactTracing: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.contactTracing(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getContactTracing(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  immunizations: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.immunizations(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getImmunizations(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  registries: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.registries(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getRegistries(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  communityPrograms: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.communityPrograms(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getCommunityPrograms(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  maternalHealth: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.maternalHealth(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getMaternalHealth(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  childHealth: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.childHealth(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getChildHealth(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  schoolHealth: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.schoolHealth(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getSchoolHealth(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  occupationalHealth: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.occupationalHealth(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getOccupationalHealth(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  environmentalHealth: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.environmentalHealth(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getEnvironmentalHealth(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  sdoh: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.sdoh(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getSdohAssessments(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  audit: (filters?: PublicHealthFilters) => ({
    queryKey: queryKeys.publicHealth.audit(filters as Record<string, unknown> | undefined),
    queryFn: () => publicHealthService.getAudit(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  search: (query: string, facilityId?: string) => ({
    queryKey: queryKeys.publicHealth.search(query, facilityId),
    queryFn: () => publicHealthService.search(query, facilityId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.publicHealth.favorites(userId),
    queryFn: () => publicHealthService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
};
