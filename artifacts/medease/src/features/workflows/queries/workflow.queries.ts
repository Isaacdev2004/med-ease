import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { workflowService } from '@/services/workflows/workflow.service';
import type { WorkflowFilters } from '@/services/workflows/types';

export const workflowQueries = {
  dashboard: (facilityId?: string) => ({
    queryKey: queryKeys.workflows.dashboard(facilityId),
    queryFn: () => workflowService.dashboard(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  analytics: (facilityId?: string) => ({
    queryKey: queryKeys.workflows.analytics(facilityId),
    queryFn: () => workflowService.analytics(facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  definitions: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.definitions(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getDefinitions(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  definition: (workflowId: string) => ({
    queryKey: queryKeys.workflows.definition(workflowId),
    queryFn: () => workflowService.getDefinition(workflowId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(workflowId),
  }),
  instances: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.instances(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getInstances(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  instance: (instanceId: string) => ({
    queryKey: queryKeys.workflows.instance(instanceId),
    queryFn: () => workflowService.getInstance(instanceId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(instanceId),
  }),
  tasks: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.tasks(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getTasks(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  approvals: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.approvals(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getApprovals(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  rules: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.rules(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getRules(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  schedules: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.schedules(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getSchedules(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  jobs: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.jobs(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getJobs(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  events: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.events(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getEvents(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  eventQueues: () => ({
    queryKey: queryKeys.workflows.eventQueues(),
    queryFn: () => workflowService.getEventQueues(),
    staleTime: CACHE_TIMES.patientList,
  }),
  slas: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.slas(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getSlas(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  escalations: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.escalations(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getEscalations(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  templates: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.templates(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getTemplates(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  triggers: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.triggers(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getTriggers(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  audits: (filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.audits(filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.getAudits(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  search: (query: string, filters?: WorkflowFilters) => ({
    queryKey: queryKeys.workflows.search(query, filters as Record<string, unknown> | undefined),
    queryFn: () => workflowService.search(query, filters),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
  favorites: (userId?: string) => ({
    queryKey: queryKeys.workflows.favorites(userId),
    queryFn: () => workflowService.getFavorites(userId ?? ''),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(userId),
  }),
};
