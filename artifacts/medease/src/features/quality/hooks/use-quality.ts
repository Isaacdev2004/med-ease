import { useQuery } from '@tanstack/react-query';

import { qualityQueries } from '@/features/quality/queries/quality.queries';
import type { QualityFilters } from '@/services/quality/types';

export function useQualityDashboard(facilityId?: string) {
  return useQuery(qualityQueries.dashboard(facilityId));
}

export function useIncidents(filters?: QualityFilters) {
  return useQuery(qualityQueries.incidents(filters));
}

export function useIncident(incidentId: string) {
  return useQuery(qualityQueries.incident(incidentId));
}

export function useRisks(filters?: QualityFilters) {
  return useQuery(qualityQueries.risks(filters));
}

export function useRiskRegister(filters?: QualityFilters) {
  return useQuery(qualityQueries.riskRegister(filters));
}

export function useCapa(filters?: QualityFilters) {
  return useQuery(qualityQueries.capa(filters));
}

export function useAudits(filters?: QualityFilters) {
  return useQuery(qualityQueries.audits(filters));
}

export function useInspections(filters?: QualityFilters) {
  return useQuery(qualityQueries.inspections(filters));
}

export function usePolicies(filters?: QualityFilters) {
  return useQuery(qualityQueries.policies(filters));
}

export function useDocuments(filters?: QualityFilters) {
  return useQuery(qualityQueries.documents(filters));
}

export function useAccreditation(framework?: string) {
  return useQuery(qualityQueries.accreditation(framework));
}

export function useCompliance(filters?: QualityFilters) {
  return useQuery(qualityQueries.compliance(filters));
}

export function useInfectionControl(filters?: QualityFilters) {
  return useQuery(qualityQueries.infection(filters));
}

export function useQualityIndicators(filters?: QualityFilters) {
  return useQuery(qualityQueries.qualityIndicators(filters));
}

export function useQualityAnalytics(facilityId?: string) {
  return useQuery(qualityQueries.analytics(facilityId));
}

export function useQualitySearch(query: string, facilityId?: string) {
  return useQuery(qualityQueries.search(query, facilityId));
}

export function useQualityFavorites(userId?: string) {
  return useQuery(qualityQueries.favorites(userId));
}
