import { useQuery } from '@tanstack/react-query';

import { executiveQueries } from '@/features/executive/queries/executive.queries';
import type { ExecutiveFilters } from '@/services/executive/types';

export function useExecutiveDashboard(facilityId?: string) {
  return useQuery(executiveQueries.dashboard(facilityId));
}

export function useExecutiveAnalytics(facilityId?: string) {
  return useQuery(executiveQueries.analytics(facilityId));
}

export function useEnterpriseKpis(filters?: ExecutiveFilters) {
  return useQuery(executiveQueries.enterpriseKpis(filters));
}

export function useOperationalMetrics(filters?: ExecutiveFilters) {
  return useQuery(executiveQueries.operationalMetrics(filters));
}

export function useDepartmentScorecards(filters?: ExecutiveFilters) {
  return useQuery(executiveQueries.departmentScorecards(filters));
}

export function useHospitalOperations(facilityId?: string) {
  return useQuery(executiveQueries.hospitalOperations(facilityId));
}

export function useCapacityAnalytics(filters?: ExecutiveFilters) {
  return useQuery(executiveQueries.capacityAnalytics(filters));
}

export function usePatientFlow(facilityId?: string) {
  return useQuery(executiveQueries.patientFlow(facilityId));
}

export function useRevenueDashboard(facilityId?: string) {
  return useQuery(executiveQueries.revenueDashboard(facilityId));
}

export function useQualityDashboard(facilityId?: string) {
  return useQuery(executiveQueries.qualityDashboard(facilityId));
}

export function useWorkforceDashboard(facilityId?: string) {
  return useQuery(executiveQueries.workforceDashboard(facilityId));
}

export function usePopulationDashboard(facilityId?: string) {
  return useQuery(executiveQueries.populationDashboard(facilityId));
}

export function useExecutiveForecasts(filters?: ExecutiveFilters) {
  return useQuery(executiveQueries.executiveForecasts(filters));
}

export function useStrategicInitiatives(filters?: ExecutiveFilters) {
  return useQuery(executiveQueries.strategicInitiatives(filters));
}

export function useExecutiveAlerts(filters?: ExecutiveFilters) {
  return useQuery(executiveQueries.executiveAlerts(filters));
}

export function useExecutiveSearch(query: string, facilityId?: string) {
  return useQuery(executiveQueries.search(query, facilityId));
}

export function useExecutiveFavorites(userId?: string) {
  return useQuery(executiveQueries.favorites(userId));
}
