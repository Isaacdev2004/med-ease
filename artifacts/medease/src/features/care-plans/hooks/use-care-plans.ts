import { useQuery } from '@tanstack/react-query';

import { carePlanQueries } from '@/features/care-plans/queries/care-plans.queries';
import type { CarePlanFilters } from '@/services/care-plans/types';
import { carePlanService } from '@/services/care-plans/care-plan.service';
import { useAuth } from '@/services/auth/auth-context';

export function useCarePlans(filters?: CarePlanFilters) {
  return useQuery(carePlanQueries.list(filters));
}

export function useCarePlan(id: string | undefined) {
  return useQuery({ ...carePlanQueries.detail(id ?? ''), enabled: Boolean(id) });
}

export function usePatientCarePlan(patientId: string | undefined) {
  return useQuery({ ...carePlanQueries.patientPlan(patientId ?? ''), enabled: Boolean(patientId) });
}

export function useCareGoals(patientId?: string, carePlanId?: string) {
  return useQuery(carePlanQueries.goals(patientId, carePlanId));
}

export function useCareTasks(patientId?: string, carePlanId?: string) {
  return useQuery(carePlanQueries.tasks(patientId, carePlanId));
}

export function useCareTimeline(patientId: string | undefined) {
  return useQuery({ ...carePlanQueries.timeline(patientId ?? ''), enabled: Boolean(patientId) });
}

export function useCareTeam(carePlanId: string | undefined) {
  return useQuery({ ...carePlanQueries.team(carePlanId ?? ''), enabled: Boolean(carePlanId) });
}

export function useRiskAssessment(patientId: string | undefined, carePlanId?: string) {
  return useQuery({
    ...carePlanQueries.risks(patientId ?? '', carePlanId),
    enabled: Boolean(patientId),
  });
}

export function useClinicalPathway(id?: string) {
  return useQuery({ ...carePlanQueries.pathway(id ?? ''), enabled: Boolean(id) });
}

export function useClinicalPathways() {
  return useQuery(carePlanQueries.pathways());
}

export function useCareAnalytics(filters?: CarePlanFilters) {
  return useQuery(carePlanQueries.analytics(filters));
}

export function useCareDashboard(patientId: string | undefined) {
  return useQuery({ ...carePlanQueries.dashboard(patientId ?? ''), enabled: Boolean(patientId) });
}

export function useProgressTracking(patientId: string | undefined) {
  return useQuery({ ...carePlanQueries.progress(patientId ?? ''), enabled: Boolean(patientId) });
}

export function usePopulationCare(filters?: CarePlanFilters) {
  return useQuery(carePlanQueries.population(filters));
}

export function usePatientCarePlanContext() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['care-plans', 'resolve-patient', user?.id ?? ''],
    queryFn: () => carePlanService.resolvePatientId(user?.id ?? ''),
    enabled: Boolean(user?.id),
  });
}
