import { useQuery } from '@tanstack/react-query';

import { phmQueries } from '@/features/population-health/queries/phm.queries';
import type { PhmFilters } from '@/services/population-health/types';

export function usePhmDashboard(facilityId?: string) {
  return useQuery(phmQueries.dashboard(facilityId));
}

export function usePopulationAnalytics(facilityId?: string) {
  return useQuery(phmQueries.analytics(facilityId));
}

export function usePopulation(filters?: PhmFilters) {
  return useQuery(phmQueries.population(filters));
}

export function useHighRiskPatients(filters?: PhmFilters) {
  return useQuery(phmQueries.highRiskPatients(filters));
}

export function useRegistries(filters?: PhmFilters) {
  return useQuery(phmQueries.registries(filters));
}

export function useCareGaps(filters?: PhmFilters) {
  return useQuery(phmQueries.careGaps(filters));
}

export function useRiskScores(filters?: PhmFilters) {
  return useQuery(phmQueries.riskScores(filters));
}

export function useCohorts(filters?: PhmFilters) {
  return useQuery(phmQueries.cohorts(filters));
}

export function useChronicPrograms(filters?: PhmFilters) {
  return useQuery(phmQueries.chronicPrograms(filters));
}

export function usePreventiveCare(filters?: PhmFilters) {
  return useQuery(phmQueries.preventiveCare(filters));
}

export function useOutreach(filters?: PhmFilters) {
  return useQuery(phmQueries.outreach(filters));
}

export function useCommunityHealth(filters?: PhmFilters) {
  return useQuery(phmQueries.communityHealth(filters));
}

export function usePhmSearch(query: string, facilityId?: string) {
  return useQuery(phmQueries.search(query, facilityId));
}

export function usePhmFavorites(userId?: string) {
  return useQuery(phmQueries.favorites(userId));
}
