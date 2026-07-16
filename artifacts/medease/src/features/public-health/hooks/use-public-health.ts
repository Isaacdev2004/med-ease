import { useQuery } from '@tanstack/react-query';

import { publicHealthQueries } from '@/features/public-health/queries/public-health.queries';
import type { PublicHealthFilters } from '@/services/public-health/types';

export function usePublicHealthDashboard(facilityId?: string) {
  return useQuery(publicHealthQueries.dashboard(facilityId));
}

export function usePublicHealthAnalytics(facilityId?: string) {
  return useQuery(publicHealthQueries.analytics(facilityId));
}

export function useDiseaseCases(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.cases(filters));
}

export function useDiseaseCase(caseId: string) {
  return useQuery(publicHealthQueries.case(caseId));
}

export function useOutbreaks(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.outbreaks(filters));
}

export function useContactTracing(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.contactTracing(filters));
}

export function useImmunizations(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.immunizations(filters));
}

export function useRegistries(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.registries(filters));
}

export function useCommunityPrograms(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.communityPrograms(filters));
}

export function useMaternalHealth(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.maternalHealth(filters));
}

export function useChildHealth(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.childHealth(filters));
}

export function useSchoolHealth(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.schoolHealth(filters));
}

export function useOccupationalHealth(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.occupationalHealth(filters));
}

export function useEnvironmentalHealth(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.environmentalHealth(filters));
}

export function useSdohAssessments(filters?: PublicHealthFilters) {
  return useQuery(publicHealthQueries.sdoh(filters));
}

export function usePublicHealthSearch(query: string, facilityId?: string) {
  return useQuery(publicHealthQueries.search(query, facilityId));
}

export function usePublicHealthFavorites(userId?: string) {
  return useQuery(publicHealthQueries.favorites(userId));
}
