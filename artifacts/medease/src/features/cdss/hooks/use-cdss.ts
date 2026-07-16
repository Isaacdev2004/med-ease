import { useQuery } from '@tanstack/react-query';

import { cdssQueries } from '@/features/cdss/queries/cdss.queries';
import type { CdssFilters } from '@/services/cdss/types';

export function useCdssDashboard(facilityId?: string) {
  return useQuery(cdssQueries.dashboard(facilityId));
}

export function useCdssAnalytics(facilityId?: string) {
  return useQuery(cdssQueries.analytics(facilityId));
}

export function useClinicalAlerts(filters?: CdssFilters) {
  return useQuery(cdssQueries.alerts(filters));
}

export function useRecommendations(filters?: CdssFilters) {
  return useQuery(cdssQueries.recommendations(filters));
}

export function useGuidelines(filters?: CdssFilters) {
  return useQuery(cdssQueries.guidelines(filters));
}

export function useOrderSets(filters?: CdssFilters) {
  return useQuery(cdssQueries.orderSets(filters));
}

export function useClinicalPathways(filters?: CdssFilters) {
  return useQuery(cdssQueries.pathways(filters));
}

export function useRiskCalculators() {
  return useQuery(cdssQueries.calculators());
}

export function useDiagnosticSupport(filters?: CdssFilters) {
  return useQuery(cdssQueries.diagnostics(filters));
}

export function useDrugSafety(filters?: CdssFilters) {
  return useQuery(cdssQueries.drugSafety(filters));
}

export function usePreventiveCare(filters?: CdssFilters) {
  return useQuery(cdssQueries.preventive(filters));
}

export function useRules(filters?: CdssFilters) {
  return useQuery(cdssQueries.rules(filters));
}

export function useProtocols(filters?: CdssFilters) {
  return useQuery(cdssQueries.protocols(filters));
}

export function useEvidenceArticles(filters?: CdssFilters) {
  return useQuery(cdssQueries.evidence(filters));
}

export function useDecisionTrees() {
  return useQuery(cdssQueries.decisionTrees());
}

export function useAudit(filters?: CdssFilters) {
  return useQuery(cdssQueries.audit(filters));
}

export function useCdssSearch(query: string, facilityId?: string) {
  return useQuery(cdssQueries.search(query, facilityId));
}

export function useCdssFavorites(userId?: string) {
  return useQuery(cdssQueries.favorites(userId));
}
