import { useQuery } from '@tanstack/react-query';

import { workflowQueries } from '@/features/workflows/queries/workflow.queries';
import type { WorkflowFilters } from '@/services/workflows/types';

export function useWorkflowDashboard(facilityId?: string) {
  return useQuery(workflowQueries.dashboard(facilityId));
}

export function useWorkflowAnalytics(facilityId?: string) {
  return useQuery(workflowQueries.analytics(facilityId));
}

export function useWorkflowDefinitions(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.definitions(filters));
}

export function useWorkflowInstances(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.instances(filters));
}

export function useTasks(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.tasks(filters));
}

export function useApprovals(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.approvals(filters));
}

export function useRules(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.rules(filters));
}

export function useSchedules(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.schedules(filters));
}

export function useJobs(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.jobs(filters));
}

export function useEvents(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.events(filters));
}

export function useEventQueues() {
  return useQuery(workflowQueries.eventQueues());
}

export function useSLAs(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.slas(filters));
}

export function useEscalations(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.escalations(filters));
}

export function useProcessTemplates(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.templates(filters));
}

export function useWorkflowTriggers(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.triggers(filters));
}

export function useWorkflowAudits(filters?: WorkflowFilters) {
  return useQuery(workflowQueries.audits(filters));
}

export function useWorkflowSearch(query: string, filters?: WorkflowFilters) {
  return useQuery(workflowQueries.search(query, filters));
}

export function useWorkflowFavorites(userId?: string) {
  return useQuery(workflowQueries.favorites(userId));
}
