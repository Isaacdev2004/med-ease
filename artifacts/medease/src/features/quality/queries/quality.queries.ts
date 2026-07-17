import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { qualityService } from '@/services/quality/quality.service';
import type { QualityFilters } from '@/services/quality/types';

export const qualityQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.quality.dashboard(facilityId),
    queryFn: () => qualityService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  incidents: (filters?: QualityFilters) => ({
    queryKey: queryKeys.quality.incidents(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => qualityService.getIncidents(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  incident: (incidentId: string) => ({
    queryKey: queryKeys.quality.incident(incidentId),
    queryFn: () => qualityService.getIncident(incidentId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(incidentId),
  }),
  risks: (filters?: QualityFilters) => ({
    queryKey: queryKeys.quality.risks(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => qualityService.getRisks(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  riskRegister: (filters?: QualityFilters) => ({
    queryKey: queryKeys.quality.riskRegister(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => qualityService.getRiskRegister(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  capa: (filters?: QualityFilters) => ({
    queryKey: queryKeys.quality.capa(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => qualityService.getCapa(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  audits: (filters?: QualityFilters) => ({
    queryKey: queryKeys.quality.audits(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => qualityService.getAudits(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  inspections: (filters?: QualityFilters) => ({
    queryKey: queryKeys.quality.inspections(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => qualityService.getInspections(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  policies: (filters?: QualityFilters) => ({
    queryKey: queryKeys.quality.policies(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => qualityService.getPolicies(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  documents: (filters?: QualityFilters) => ({
    queryKey: queryKeys.quality.documents(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => qualityService.getDocuments(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  accreditation: (framework?: string) => ({
    queryKey: queryKeys.quality.accreditation(framework),
    queryFn: () => qualityService.getAccreditation(framework),
    staleTime: CACHE_TIMES.dashboard,
  }),
  compliance: (filters?: QualityFilters) => ({
    queryKey: queryKeys.quality.compliance(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => qualityService.getCompliance(filters),
    staleTime: CACHE_TIMES.dashboard,
  }),
  infection: (filters?: QualityFilters) => ({
    queryKey: queryKeys.quality.infection(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => qualityService.getInfectionControl(filters),
    staleTime: CACHE_TIMES.dashboard,
  }),
  qualityIndicators: (filters?: QualityFilters) => ({
    queryKey: queryKeys.quality.qualityIndicators(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => qualityService.getQualityIndicators(filters),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.quality.analytics(facilityId),
    queryFn: () => qualityService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.quality.favorites(userId),
    queryFn: () => qualityService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
  search: (query: string, facilityId?: string) => ({
    queryKey: queryKeys.quality.search(query, facilityId),
    queryFn: () => qualityService.search(query, facilityId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
