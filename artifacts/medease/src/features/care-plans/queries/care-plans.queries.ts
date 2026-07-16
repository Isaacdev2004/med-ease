import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import type { CarePlanFilters } from '@/services/care-plans/types';
import { carePlanService } from '@/services/care-plans/care-plan.service';

export const carePlanQueries = {
  list: (filters?: CarePlanFilters) => ({
    queryKey: queryKeys.carePlans.list(filters as Record<string, unknown>),
    queryFn: () => carePlanService.searchCarePlans(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  detail: (id: string) => ({
    queryKey: queryKeys.carePlans.detail(id),
    queryFn: () => carePlanService.getCarePlan(id),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(id),
  }),
  patientPlan: (patientId: string) => ({
    queryKey: queryKeys.carePlans.patientPlan(patientId),
    queryFn: () => carePlanService.getPatientCarePlan(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  goals: (patientId?: string, carePlanId?: string) => ({
    queryKey: queryKeys.carePlans.goals(patientId, carePlanId),
    queryFn: () => carePlanService.getGoals(patientId, carePlanId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  tasks: (patientId?: string, carePlanId?: string) => ({
    queryKey: queryKeys.carePlans.tasks(patientId, carePlanId),
    queryFn: () => carePlanService.getTasks(patientId, carePlanId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  todayTasks: (patientId: string) => ({
    queryKey: queryKeys.carePlans.todayTasks(patientId),
    queryFn: () => carePlanService.getTodayTasks(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  timeline: (patientId: string) => ({
    queryKey: queryKeys.carePlans.timeline(patientId),
    queryFn: () => carePlanService.getTimeline(patientId),
    staleTime: CACHE_TIMES.patientTimeline,
  }),
  team: (carePlanId: string) => ({
    queryKey: queryKeys.carePlans.team(carePlanId),
    queryFn: () => carePlanService.getCareTeam(carePlanId),
    staleTime: CACHE_TIMES.patientList,
    enabled: Boolean(carePlanId),
  }),
  risks: (patientId: string, carePlanId?: string) => ({
    queryKey: queryKeys.carePlans.risks(patientId, carePlanId),
    queryFn: () => carePlanService.getRiskAssessment(patientId, carePlanId),
    staleTime: CACHE_TIMES.reference,
  }),
  pathways: () => ({
    queryKey: queryKeys.carePlans.pathways(),
    queryFn: () => carePlanService.getClinicalPathways(),
    staleTime: CACHE_TIMES.reference,
  }),
  pathway: (id: string) => ({
    queryKey: queryKeys.carePlans.pathway(id),
    queryFn: () => carePlanService.getClinicalPathway(id),
    staleTime: CACHE_TIMES.reference,
    enabled: Boolean(id),
  }),
  dashboard: (patientId: string) => ({
    queryKey: queryKeys.carePlans.dashboard(patientId),
    queryFn: () => carePlanService.getDashboard(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  progress: (patientId: string) => ({
    queryKey: queryKeys.carePlans.progress(patientId),
    queryFn: () => carePlanService.getProgressTracking(patientId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (filters?: CarePlanFilters) => ({
    queryKey: queryKeys.carePlans.analytics(filters as Record<string, unknown>),
    queryFn: () => carePlanService.getAnalytics(filters),
    staleTime: CACHE_TIMES.dashboard,
  }),
  activity: (carePlanId?: string) => ({
    queryKey: queryKeys.carePlans.activity(carePlanId),
    queryFn: () => carePlanService.getActivity(carePlanId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  population: (filters?: CarePlanFilters) => ({
    queryKey: queryKeys.carePlans.population(filters as Record<string, unknown>),
    queryFn: () => carePlanService.getPopulationCare(filters),
    staleTime: CACHE_TIMES.dashboard,
  }),
};
