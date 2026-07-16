import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { workforceService } from '@/services/workforce/workforce.service';
import type { WorkforceFilters } from '@/services/workforce/types';

export const workforceQueries = {
  dashboard: (facilityId?: string, departmentId?: string) => ({
    queryKey: queryKeys.workforce.dashboard(facilityId, departmentId),
    queryFn: () => workforceService.dashboard(facilityId, departmentId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  employees: (filters?: WorkforceFilters) => ({
    queryKey: queryKeys.workforce.employees(filters as Record<string, unknown> | undefined),
    queryFn: () => workforceService.searchEmployees(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  employee: (employeeId: string) => ({
    queryKey: queryKeys.workforce.employee(employeeId),
    queryFn: () => workforceService.getEmployee(employeeId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(employeeId),
  }),
  departments: (filters?: WorkforceFilters) => ({
    queryKey: queryKeys.workforce.departments(filters as Record<string, unknown> | undefined),
    queryFn: () => workforceService.getDepartments(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  schedules: (filters?: WorkforceFilters) => ({
    queryKey: queryKeys.workforce.calendar(filters as Record<string, unknown> | undefined),
    queryFn: () => workforceService.getSchedules(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  attendance: (filters?: WorkforceFilters) => ({
    queryKey: queryKeys.workforce.attendance(filters as Record<string, unknown> | undefined),
    queryFn: () => workforceService.getAttendance(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  leave: (filters?: WorkforceFilters) => ({
    queryKey: queryKeys.workforce.leave(filters as Record<string, unknown> | undefined),
    queryFn: () => workforceService.getLeaveRequests(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  training: (filters?: WorkforceFilters) => ({
    queryKey: queryKeys.workforce.training(filters as Record<string, unknown> | undefined),
    queryFn: () => workforceService.getTraining(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  performance: (filters?: WorkforceFilters) => ({
    queryKey: queryKeys.workforce.performance(filters as Record<string, unknown> | undefined),
    queryFn: () => workforceService.getPerformance(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  payroll: (filters?: WorkforceFilters) => ({
    queryKey: queryKeys.workforce.payroll(filters as Record<string, unknown> | undefined),
    queryFn: () => workforceService.getPayroll(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  credentials: (employeeId: string) => ({
    queryKey: queryKeys.workforce.credentials(employeeId),
    queryFn: () => workforceService.getCredentials(employeeId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(employeeId),
  }),
  roster: (departmentId?: string) => ({
    queryKey: queryKeys.workforce.roster(departmentId),
    queryFn: () => workforceService.getRoster(departmentId),
    staleTime: CACHE_TIMES.patientList,
  }),
  organization: () => ({
    queryKey: queryKeys.workforce.organization(),
    queryFn: () => workforceService.getOrganization(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: () => ({
    queryKey: queryKeys.workforce.analytics(),
    queryFn: () => workforceService.analytics(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  coverage: (departmentId?: string) => ({
    queryKey: queryKeys.workforce.coverage(departmentId),
    queryFn: () => workforceService.coverage(departmentId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  onCall: (filters?: WorkforceFilters) => ({
    queryKey: queryKeys.workforce.onCall(filters as Record<string, unknown> | undefined),
    queryFn: () => workforceService.getOnCall(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.workforce.favorites(userId),
    queryFn: () => workforceService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
  search: (query: string, facilityId?: string) => ({
    queryKey: queryKeys.workforce.search(query, facilityId),
    queryFn: () => workforceService.search(query, facilityId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
