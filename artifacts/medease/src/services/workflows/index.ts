export { workflowService } from '@/services/workflows/workflow.service';
export { workflowRepository } from '@/services/workflows/repository';
export { workflowOfflineQueue } from '@/services/workflows/offline-sync';
export {
  computeWorkflowAnalytics,
  buildWorkflowDashboard,
} from '@/services/workflows/analytics';
export {
  MOCK_WORKFLOW_DEFINITIONS,
  MOCK_WORKFLOW_INSTANCES,
  MOCK_WORKFLOW_TASKS,
  MOCK_APPROVALS,
  MOCK_BUSINESS_RULES,
  MOCK_BACKGROUND_JOBS,
  MOCK_WORKFLOW_EVENTS,
  MOCK_SCHEDULES,
  MOCK_SLAS,
  MOCK_ESCALATIONS,
  MOCK_PROCESS_TEMPLATES,
  MOCK_EVENT_QUEUES,
  MOCK_WORKFLOW_AUDITS,
} from '@/services/workflows/mock-data';
