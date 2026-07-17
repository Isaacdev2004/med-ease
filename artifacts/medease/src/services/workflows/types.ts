export type WorkflowStatus = 'draft' | 'published' | 'archived';
export type InstanceStatus =
  'running' | 'paused' | 'completed' | 'cancelled' | 'failed';
export type TaskStatus =
  'pending' | 'in_progress' | 'completed' | 'cancelled' | 'escalated';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated';
export type JobStatus = 'queued' | 'running' | 'completed' | 'failed';
export type SlaStatus = 'on_track' | 'at_risk' | 'breached';

export interface WorkflowFilters {
  q?: string;
  tenantId?: string;
  facilityId?: string;
  module?: string;
  status?: string;
  assigneeId?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface WorkflowDefinition {
  workflowId: string;
  name: string;
  description: string;
  module: string;
  version: number;
  status: WorkflowStatus;
  stageCount: number;
  taskCount: number;
  publishedAt?: string;
  updatedAt: string;
}

export interface WorkflowVersion {
  versionId: string;
  workflowId: string;
  versionNumber: number;
  publishedBy: string;
  publishedAt: string;
  changeNotes?: string;
}

export interface WorkflowInstance {
  instanceId: string;
  workflowId: string;
  workflowName: string;
  module: string;
  status: InstanceStatus;
  currentStage: string;
  startedBy: string;
  startedAt: string;
  completedAt?: string;
  facilityId?: string;
  slaStatus: SlaStatus;
}

export interface ProcessTemplate {
  templateId: string;
  name: string;
  module: string;
  category: string;
  usageCount: number;
}

export interface Stage {
  stageId: string;
  workflowId: string;
  name: string;
  order: number;
  taskCount: number;
}

export interface WorkflowTask {
  taskId: string;
  instanceId: string;
  workflowName: string;
  title: string;
  type: 'human' | 'automated';
  status: TaskStatus;
  assigneeId?: string;
  module: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueAt?: string;
  createdAt: string;
}

export interface HumanTask extends WorkflowTask {
  type: 'human';
  assigneeId: string;
}

export interface AutomatedTask extends WorkflowTask {
  type: 'automated';
  automationId: string;
}

export interface Approval {
  approvalId: string;
  instanceId: string;
  workflowName: string;
  title: string;
  status: ApprovalStatus;
  requesterId: string;
  currentStep: number;
  totalSteps: number;
  module: string;
  createdAt: string;
}

export interface ApprovalStep {
  stepId: string;
  approvalId: string;
  stepNumber: number;
  approverId: string;
  status: ApprovalStatus;
  decidedAt?: string;
  comments?: string;
}

export interface BusinessRule {
  ruleId: string;
  name: string;
  module: string;
  condition: string;
  action: string;
  enabled: boolean;
  priority: number;
}

export interface RuleCondition {
  conditionId: string;
  ruleId: string;
  field: string;
  operator: string;
  value: string;
}

export interface WorkflowTrigger {
  triggerId: string;
  workflowId: string;
  type: 'event' | 'schedule' | 'manual';
  eventName?: string;
  enabled: boolean;
}

export interface WorkflowAction {
  actionId: string;
  ruleId: string;
  type: string;
  target: string;
}

export interface SLA {
  slaId: string;
  workflowId: string;
  name: string;
  targetMinutes: number;
  warningMinutes: number;
  status: SlaStatus;
}

export interface Escalation {
  escalationId: string;
  taskId: string;
  reason: string;
  escalatedTo: string;
  escalatedAt: string;
  resolved: boolean;
}

export interface WorkflowTimer {
  timerId: string;
  instanceId: string;
  name: string;
  firesAt: string;
  status: 'pending' | 'fired' | 'cancelled';
}

export interface WorkflowEvent {
  eventId: string;
  type: string;
  source: string;
  module: string;
  payload: string;
  timestamp: string;
}

export interface EventQueue {
  queueId: string;
  name: string;
  pendingCount: number;
  processedCount: number;
}

export interface BackgroundJob {
  jobId: string;
  name: string;
  workflowId?: string;
  status: JobStatus;
  module: string;
  startedAt: string;
  completedAt?: string;
}

export interface WorkflowSchedule {
  scheduleId: string;
  workflowId: string;
  name: string;
  cron: string;
  enabled: boolean;
  lastRunAt?: string;
  nextRunAt: string;
}

export interface WorkflowAudit {
  auditId: string;
  instanceId: string;
  action: string;
  actorId: string;
  outcome: 'success' | 'failure';
  timestamp: string;
}

export interface WorkflowDashboard {
  totalDefinitions: number;
  activeInstances: number;
  pendingTasks: number;
  pendingApprovals: number;
  slaBreaches: number;
  backgroundJobsRunning: number;
  eventsToday: number;
  instanceTrend: { label: string; value: number }[];
  moduleBreakdown: { label: string; value: number }[];
  recentEvents: WorkflowEvent[];
}

export interface WorkflowAnalytics {
  completionRate: number;
  avgCycleTimeHours: number;
  slaComplianceRate: number;
  approvalTurnaroundHours: number;
  automationRate: number;
  escalationRate: number;
  tasksCompletedDaily: number;
  instanceTrend: { label: string; value: number }[];
  moduleThroughput: { label: string; value: number }[];
  slaTrend: { label: string; value: number }[];
}

export interface WorkflowPermissions {
  canView: boolean;
  canWrite: boolean;
  canExecute: boolean;
  canApprovals: boolean;
  canRules: boolean;
  canScheduler: boolean;
  canAnalytics: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface WorkflowFavorite {
  userId: string;
  entityType: 'workflow' | 'instance' | 'template';
  entityId: string;
  createdAt: string;
}

export interface CreateWorkflowInput {
  name: string;
  description: string;
  module: string;
  tenantId: string;
  facilityId?: string;
}

export interface StartWorkflowInput {
  workflowId: string;
  startedBy: string;
  facilityId?: string;
}

export interface CompleteTaskInput {
  taskId: string;
  completedBy: string;
  notes?: string;
}

export interface AssignTaskInput {
  taskId: string;
  assigneeId: string;
}

export interface ApproveInput {
  approvalId: string;
  approverId: string;
  comments?: string;
}

export interface RejectInput {
  approvalId: string;
  approverId: string;
  reason: string;
}

export interface EscalateInput {
  taskId: string;
  escalatedTo: string;
  reason: string;
}

export interface CreateRuleInput {
  name: string;
  module: string;
  condition: string;
  action: string;
}

export interface ScheduleWorkflowInput {
  workflowId: string;
  name: string;
  cron: string;
}

export interface ShareWorkflowInput {
  workflowId: string;
  sharedWith: string[];
  message?: string;
}
