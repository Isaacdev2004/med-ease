import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { cdssService } from '@/services/cdss/cdss.service';
import type { CdssFilters } from '@/services/cdss/types';

export const cdssQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.cdss.dashboard(facilityId),
    queryFn: () => cdssService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.cdss.analytics(facilityId),
    queryFn: () => cdssService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  alerts: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.alerts(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getAlerts(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  recommendations: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.recommendations(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getRecommendations(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  guidelines: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.guidelines(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getGuidelines(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  orderSets: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.orderSets(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getOrderSets(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  pathways: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.pathways(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getPathways(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  calculators: () => ({
    queryKey: queryKeys.cdss.calculators(),
    queryFn: () => cdssService.getCalculators(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  diagnostics: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.diagnostics(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getDiagnostics(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  drugSafety: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.drugSafety(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getDrugSafety(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  preventive: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.preventive(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getPreventiveCare(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  rules: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.rules(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getRules(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  protocols: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.protocols(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getProtocols(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  evidence: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.evidence(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getEvidence(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  decisionTrees: () => ({
    queryKey: queryKeys.cdss.decisionTrees(),
    queryFn: () => cdssService.getDecisionTrees(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  audit: (filters?: CdssFilters) => ({
    queryKey: queryKeys.cdss.audit(
      filters as Record<string, unknown> | undefined,
    ),
    queryFn: () => cdssService.getAudit(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  timeline: (facilityId?: string) => ({
    queryKey: queryKeys.cdss.timeline(facilityId),
    queryFn: () => cdssService.getTimeline(facilityId),
    staleTime: CACHE_TIMES.default,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.cdss.favorites(userId),
    queryFn: () => cdssService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
  search: (query: string, facilityId?: string) => ({
    queryKey: queryKeys.cdss.search(query, facilityId),
    queryFn: () => cdssService.search(query, facilityId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
