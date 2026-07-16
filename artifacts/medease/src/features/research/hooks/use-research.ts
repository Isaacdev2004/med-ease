import { useQuery } from '@tanstack/react-query';

import { researchQueries } from '@/features/research/queries/research.queries';
import type { ResearchFilters } from '@/services/research/types';

export function useResearchDashboard(facilityId?: string) {
  return useQuery(researchQueries.dashboard(facilityId));
}

export function useResearchAnalytics(facilityId?: string) {
  return useQuery(researchQueries.analytics(facilityId));
}

export function useClinicalTrials(filters?: ResearchFilters) {
  return useQuery(researchQueries.trials(filters));
}

export function useTrial(trialId: string) {
  return useQuery(researchQueries.trial(trialId));
}

export function useParticipants(filters?: ResearchFilters) {
  return useQuery(researchQueries.participants(filters));
}

export function useStudyVisits(filters?: ResearchFilters) {
  return useQuery(researchQueries.visits(filters));
}

export function useInvestigators(filters?: ResearchFilters) {
  return useQuery(researchQueries.investigators(filters));
}

export function useStudySites(filters?: ResearchFilters) {
  return useQuery(researchQueries.sites(filters));
}

export function useRecruitment(filters?: ResearchFilters) {
  return useQuery(researchQueries.trials({ ...filters, status: 'recruiting' }));
}

export function useConsent(filters?: ResearchFilters) {
  return useQuery(researchQueries.consent(filters));
}

export function useProtocolCompliance(filters?: ResearchFilters) {
  return useQuery(researchQueries.protocol(filters));
}

export function useAdverseEvents(filters?: ResearchFilters) {
  return useQuery(researchQueries.adverseEvents(filters));
}

export function useSafetyBoard(filters?: ResearchFilters) {
  return useQuery(researchQueries.safetyBoard(filters));
}

export function useBiospecimens(filters?: ResearchFilters) {
  return useQuery(researchQueries.biospecimens(filters));
}

export function usePublications(filters?: ResearchFilters) {
  return useQuery(researchQueries.publications(filters));
}

export function useInnovationProjects(filters?: ResearchFilters) {
  return useQuery(researchQueries.innovation(filters));
}

export function useResearchAudit(filters?: ResearchFilters) {
  return useQuery(researchQueries.audit(filters));
}

export function useResearchSearch(query: string, facilityId?: string) {
  return useQuery(researchQueries.search(query, facilityId));
}

export function useResearchFavorites(userId?: string) {
  return useQuery(researchQueries.favorites(userId));
}
