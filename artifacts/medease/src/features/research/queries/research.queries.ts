import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { researchService } from '@/services/research/research.service';
import type { ResearchFilters } from '@/services/research/types';

export const researchQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.research.dashboard(facilityId),
    queryFn: () => researchService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.research.analytics(facilityId),
    queryFn: () => researchService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  trials: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.trials(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getTrials(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  trial: (trialId: string) => ({
    queryKey: queryKeys.research.trial(trialId),
    queryFn: () => researchService.getTrial(trialId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(trialId),
  }),
  participants: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.participants(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getParticipants(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  visits: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.visits(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getVisits(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  investigators: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.investigators(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getInvestigators(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  sites: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.sites(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getSites(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  consent: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.consent(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getConsents(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  protocol: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.protocol(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: async () => ({
      deviations: await researchService.getDeviations(filters),
      regulatory: await researchService.getRegulatory(filters),
      grants: await researchService.getGrants(filters),
    }),
    staleTime: CACHE_TIMES.patientList,
  }),
  adverseEvents: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.adverseEvents(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getAdverseEvents(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  safetyBoard: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.safetyBoard(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getSafetyBoard(filters),
    staleTime: CACHE_TIMES.default,
  }),
  biospecimens: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.biospecimens(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getBiospecimens(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  publications: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.publications(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getPublications(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  innovation: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.innovation(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getInnovation(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  audit: (filters?: ResearchFilters) => ({
    queryKey: queryKeys.research.audit(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => researchService.getAudit(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  search: (query: string, facilityId?: string) => ({
    queryKey: queryKeys.research.search(query, facilityId),
    queryFn: () => researchService.search(query, facilityId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.research.favorites(userId),
    queryFn: () => researchService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
};
