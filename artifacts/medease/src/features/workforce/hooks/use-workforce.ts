import { useQuery } from '@tanstack/react-query';

import { workforceQueries } from '@/features/workforce/queries/workforce.queries';
import type { WorkforceFilters } from '@/services/workforce/types';

export function useWorkforceDashboard(facilityId?: string, departmentId?: string) {
  return useQuery(workforceQueries.dashboard(facilityId, departmentId));
}

export function useEmployees(filters?: WorkforceFilters) {
  return useQuery(workforceQueries.employees(filters));
}

export function useEmployee(employeeId: string) {
  return useQuery(workforceQueries.employee(employeeId));
}

export function useDepartments(filters?: WorkforceFilters) {
  return useQuery(workforceQueries.departments(filters));
}

export function useSchedules(filters?: WorkforceFilters) {
  return useQuery(workforceQueries.schedules(filters));
}

export function useAttendance(filters?: WorkforceFilters) {
  return useQuery(workforceQueries.attendance(filters));
}

export function useLeaveRequests(filters?: WorkforceFilters) {
  return useQuery(workforceQueries.leave(filters));
}

export function useTraining(filters?: WorkforceFilters) {
  return useQuery(workforceQueries.training(filters));
}

export function usePerformance(filters?: WorkforceFilters) {
  return useQuery(workforceQueries.performance(filters));
}

export function usePayroll(filters?: WorkforceFilters) {
  return useQuery(workforceQueries.payroll(filters));
}

export function useCredentials(employeeId: string) {
  return useQuery(workforceQueries.credentials(employeeId));
}

export function useRoster(departmentId?: string) {
  return useQuery(workforceQueries.roster(departmentId));
}

export function useOrganization() {
  return useQuery(workforceQueries.organization());
}

export function useWorkforceAnalytics() {
  return useQuery(workforceQueries.analytics());
}

export function useCoverage(departmentId?: string) {
  return useQuery(workforceQueries.coverage(departmentId));
}

export function useOnCall(filters?: WorkforceFilters) {
  return useQuery(workforceQueries.onCall(filters));
}

export function useFavorites(userId?: string) {
  return useQuery(workforceQueries.favorites(userId));
}

export function useWorkforceSearch(query: string, facilityId?: string) {
  return useQuery(workforceQueries.search(query, facilityId));
}
