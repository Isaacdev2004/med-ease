import { approvalTurnaroundHours } from '@/services/workflows/approval-engine';
import { runningJobCount } from '@/services/workflows/automation-engine';
import { slaBreaches, slaComplianceRate } from '@/services/workflows/sla-engine';
import { automationRate, pendingTaskCount } from '@/services/workflows/task-engine';
import { workflowCompletionRate } from '@/services/workflows/workflow-engine';
import { avgCycleTimeHours } from '@/services/workflows/process-monitor';
import { escalationRate } from '@/services/workflows/escalation-engine';
import type {
  Approval,
  BackgroundJob,
  BusinessRule,
  Escalation,
  EventQueue,
  ProcessTemplate,
  SLA,
  WorkflowAnalytics,
  WorkflowAudit,
  WorkflowDashboard,
  WorkflowDefinition,
  WorkflowEvent,
  WorkflowInstance,
  WorkflowSchedule,
  WorkflowTask,
  WorkflowTimer,
  WorkflowTrigger,
} from '@/services/workflows/types';

const SCALE = { definitions: 60, instances: 200, tasks: 400, approvals: 80, rules: 50, jobs: 100, events: 300, audits: 500 };
const ENTERPRISE = { definitions: 800, instances: 60_000, tasks: 250_000, approvals: 45_000, rules: 8_000, jobs: 40_000, events: 500_000, audits: 2_000_000 };

const MODULES = ['clinical', 'appointments', 'medications', 'billing', 'procurement', 'workforce', 'finance', 'quality', 'research', 'iam', 'documents'];
const WORKFLOW_NAMES = [
  'Prescription Approval', 'Leave Request', 'Purchase Requisition', 'Incident CAPA', 'Care Plan Review',
  'Claim Submission', 'Access Request', 'Document Review', 'IRB Approval', 'Maintenance Request',
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_WORKFLOW_DEFINITIONS: WorkflowDefinition[] = Array.from({ length: SCALE.definitions }, (_, i) => ({
  workflowId: `wf-${String(i + 1).padStart(4, '0')}`,
  name: WORKFLOW_NAMES[i % WORKFLOW_NAMES.length]!,
  description: `${WORKFLOW_NAMES[i % WORKFLOW_NAMES.length]} workflow for ${MODULES[i % MODULES.length]}`,
  module: MODULES[i % MODULES.length]!,
  version: 1 + (i % 5),
  status: (['published', 'published', 'draft', 'archived'] as const)[i % 4]!,
  stageCount: 3 + (i % 5),
  taskCount: 5 + (i % 10),
  publishedAt: i % 4 !== 2 ? daysAgo(i % 90) : undefined,
  updatedAt: daysAgo(i % 30),
}));

export const MOCK_WORKFLOW_INSTANCES: WorkflowInstance[] = Array.from({ length: SCALE.instances }, (_, i) => {
  const def = MOCK_WORKFLOW_DEFINITIONS[i % MOCK_WORKFLOW_DEFINITIONS.length]!;
  return {
    instanceId: `wfi-${String(i + 1).padStart(5, '0')}`,
    workflowId: def.workflowId,
    workflowName: def.name,
    module: def.module,
    status: (['running', 'running', 'completed', 'paused', 'cancelled', 'failed'] as const)[i % 6]!,
    currentStage: `Stage ${1 + (i % 4)}`,
    startedBy: `user-${String((i % 20) + 1).padStart(5, '0')}`,
    startedAt: daysAgo(i % 14),
    completedAt: i % 6 === 2 ? daysAgo(i % 7) : undefined,
    facilityId: i % 3 === 0 ? `fac-${String((i % 10) + 1).padStart(3, '0')}` : undefined,
    slaStatus: (['on_track', 'on_track', 'at_risk', 'breached'] as const)[i % 4]!,
  };
});

export const MOCK_WORKFLOW_TASKS: WorkflowTask[] = Array.from({ length: SCALE.tasks }, (_, i) => ({
  taskId: `task-${String(i + 1).padStart(5, '0')}`,
  instanceId: MOCK_WORKFLOW_INSTANCES[i % MOCK_WORKFLOW_INSTANCES.length]!.instanceId,
  workflowName: MOCK_WORKFLOW_INSTANCES[i % MOCK_WORKFLOW_INSTANCES.length]!.workflowName,
  title: `Task ${(i % 50) + 1}`,
  type: i % 4 === 0 ? 'automated' as const : 'human' as const,
  status: (['pending', 'in_progress', 'completed', 'escalated', 'cancelled'] as const)[i % 5]!,
  assigneeId: i % 4 !== 0 ? `user-${String((i % 25) + 1).padStart(5, '0')}` : undefined,
  module: MODULES[i % MODULES.length]!,
  priority: (['low', 'medium', 'high', 'critical'] as const)[i % 4]!,
  dueAt: daysAgo(-(i % 7)),
  createdAt: daysAgo(i % 21),
}));

export const MOCK_APPROVALS: Approval[] = Array.from({ length: SCALE.approvals }, (_, i) => ({
  approvalId: `appr-${String(i + 1).padStart(4, '0')}`,
  instanceId: MOCK_WORKFLOW_INSTANCES[i % MOCK_WORKFLOW_INSTANCES.length]!.instanceId,
  workflowName: MOCK_WORKFLOW_INSTANCES[i % MOCK_WORKFLOW_INSTANCES.length]!.workflowName,
  title: `Approval ${(i % 30) + 1}`,
  status: (['pending', 'approved', 'rejected', 'escalated'] as const)[i % 4]!,
  requesterId: `user-${String((i % 15) + 1).padStart(5, '0')}`,
  currentStep: 1 + (i % 3),
  totalSteps: 3,
  module: MODULES[i % MODULES.length]!,
  createdAt: daysAgo(i % 14),
}));

export const MOCK_BUSINESS_RULES: BusinessRule[] = Array.from({ length: SCALE.rules }, (_, i) => ({
  ruleId: `rule-${String(i + 1).padStart(4, '0')}`,
  name: `Rule ${(i % 20) + 1}`,
  module: MODULES[i % MODULES.length]!,
  condition: `amount gt ${1000 + i * 100}`,
  action: ['escalate', 'notify', 'auto_approve', 'assign'][i % 4]!,
  enabled: i % 7 !== 0,
  priority: 1 + (i % 10),
}));

export const MOCK_SLAS: SLA[] = Array.from({ length: 30 }, (_, i) => ({
  slaId: `sla-${String(i + 1).padStart(3, '0')}`,
  workflowId: MOCK_WORKFLOW_DEFINITIONS[i % MOCK_WORKFLOW_DEFINITIONS.length]!.workflowId,
  name: `SLA ${i + 1}`,
  targetMinutes: 60 * (4 + (i % 8)),
  warningMinutes: 60 * (2 + (i % 4)),
  status: (['on_track', 'at_risk', 'breached'] as const)[i % 3]!,
}));

export const MOCK_ESCALATIONS: Escalation[] = Array.from({ length: 40 }, (_, i) => ({
  escalationId: `esc-${String(i + 1).padStart(4, '0')}`,
  taskId: MOCK_WORKFLOW_TASKS[i % MOCK_WORKFLOW_TASKS.length]!.taskId,
  reason: ['SLA breach', 'Approver unavailable', 'Priority escalation'][i % 3]!,
  escalatedTo: `user-${String((i % 10) + 20).padStart(5, '0')}`,
  escalatedAt: daysAgo(i % 10),
  resolved: i % 3 === 0,
}));

export const MOCK_TIMERS: WorkflowTimer[] = Array.from({ length: 50 }, (_, i) => ({
  timerId: `timer-${String(i + 1).padStart(4, '0')}`,
  instanceId: MOCK_WORKFLOW_INSTANCES[i % MOCK_WORKFLOW_INSTANCES.length]!.instanceId,
  name: `Timer ${i + 1}`,
  firesAt: daysAgo(-(i % 5)),
  status: (['pending', 'fired', 'cancelled'] as const)[i % 3]!,
}));

export const MOCK_WORKFLOW_EVENTS: WorkflowEvent[] = Array.from({ length: SCALE.events }, (_, i) => ({
  eventId: `evt-${String(i + 1).padStart(5, '0')}`,
  type: ['task.created', 'task.completed', 'approval.requested', 'workflow.started', 'sla.warning'][i % 5]!,
  source: MOCK_WORKFLOW_INSTANCES[i % MOCK_WORKFLOW_INSTANCES.length]!.instanceId,
  module: MODULES[i % MODULES.length]!,
  payload: `Event payload ${i + 1}`,
  timestamp: daysAgo(i % 7),
}));

export const MOCK_EVENT_QUEUES: EventQueue[] = [
  { queueId: 'q-001', name: 'Clinical Events', pendingCount: 42, processedCount: 12500 },
  { queueId: 'q-002', name: 'Operations Events', pendingCount: 18, processedCount: 8900 },
  { queueId: 'q-003', name: 'Platform Events', pendingCount: 7, processedCount: 4200 },
];

export const MOCK_BACKGROUND_JOBS: BackgroundJob[] = Array.from({ length: SCALE.jobs }, (_, i) => ({
  jobId: `job-${String(i + 1).padStart(4, '0')}`,
  name: `Job ${(i % 20) + 1}`,
  workflowId: MOCK_WORKFLOW_DEFINITIONS[i % MOCK_WORKFLOW_DEFINITIONS.length]!.workflowId,
  status: (['queued', 'running', 'completed', 'failed'] as const)[i % 4]!,
  module: MODULES[i % MODULES.length]!,
  startedAt: daysAgo(i % 5),
  completedAt: i % 4 >= 2 ? daysAgo(i % 3) : undefined,
}));

export const MOCK_SCHEDULES: WorkflowSchedule[] = Array.from({ length: 25 }, (_, i) => ({
  scheduleId: `sched-${String(i + 1).padStart(3, '0')}`,
  workflowId: MOCK_WORKFLOW_DEFINITIONS[i % MOCK_WORKFLOW_DEFINITIONS.length]!.workflowId,
  name: `Schedule ${i + 1}`,
  cron: i % 2 === 0 ? '0 */6 * * *' : '0 0 * * *',
  enabled: i % 5 !== 0,
  lastRunAt: i % 3 === 0 ? daysAgo(1) : undefined,
  nextRunAt: daysAgo(-(i % 3)),
}));

export const MOCK_PROCESS_TEMPLATES: ProcessTemplate[] = WORKFLOW_NAMES.map((name, i) => ({
  templateId: `tpl-${String(i + 1).padStart(3, '0')}`,
  name,
  module: MODULES[i % MODULES.length]!,
  category: ['approval', 'review', 'automation', 'escalation'][i % 4]!,
  usageCount: 50 + i * 30,
}));

export const MOCK_WORKFLOW_TRIGGERS: WorkflowTrigger[] = Array.from({ length: 40 }, (_, i) => ({
  triggerId: `trg-${String(i + 1).padStart(4, '0')}`,
  workflowId: MOCK_WORKFLOW_DEFINITIONS[i % MOCK_WORKFLOW_DEFINITIONS.length]!.workflowId,
  type: (['event', 'schedule', 'manual'] as const)[i % 3]!,
  eventName: i % 3 === 0 ? 'record.created' : undefined,
  enabled: i % 6 !== 0,
}));

export const MOCK_WORKFLOW_AUDITS: WorkflowAudit[] = Array.from({ length: SCALE.audits }, (_, i) => ({
  auditId: `wfa-${String(i + 1).padStart(5, '0')}`,
  instanceId: MOCK_WORKFLOW_INSTANCES[i % MOCK_WORKFLOW_INSTANCES.length]!.instanceId,
  action: ['start', 'complete_task', 'approve', 'escalate', 'cancel'][i % 5]!,
  actorId: `user-${String((i % 20) + 1).padStart(5, '0')}`,
  outcome: i % 10 === 0 ? 'failure' as const : 'success' as const,
  timestamp: daysAgo(i % 30),
}));

export function buildWorkflowDashboard(facilityId?: string): WorkflowDashboard {
  let instances = MOCK_WORKFLOW_INSTANCES;
  if (facilityId) instances = instances.filter((i) => i.facilityId === facilityId);

  return {
    totalDefinitions: ENTERPRISE.definitions,
    activeInstances: instances.filter((i) => i.status === 'running').length * 120,
    pendingTasks: pendingTaskCount(MOCK_WORKFLOW_TASKS) * 200,
    pendingApprovals: MOCK_APPROVALS.filter((a) => a.status === 'pending').length * 80,
    slaBreaches: slaBreaches(MOCK_SLAS),
    backgroundJobsRunning: runningJobCount(MOCK_BACKGROUND_JOBS),
    eventsToday: MOCK_WORKFLOW_EVENTS.length * 50,
    instanceTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
      label,
      value: 80 + i * 15,
    })),
    moduleBreakdown: MODULES.slice(0, 6).map((label) => ({
      label,
      value: instances.filter((i) => i.module === label).length * 300,
    })),
    recentEvents: MOCK_WORKFLOW_EVENTS.slice(0, 8),
  };
}

export function computeWorkflowAnalytics(facilityId?: string): WorkflowAnalytics {
  let instances = MOCK_WORKFLOW_INSTANCES;
  if (facilityId) instances = instances.filter((i) => i.facilityId === facilityId);
  const dashboard = buildWorkflowDashboard(facilityId);

  return {
    completionRate: workflowCompletionRate(instances),
    avgCycleTimeHours: avgCycleTimeHours(instances),
    slaComplianceRate: slaComplianceRate(instances),
    approvalTurnaroundHours: approvalTurnaroundHours(MOCK_APPROVALS),
    automationRate: automationRate(MOCK_WORKFLOW_TASKS),
    escalationRate: escalationRate(MOCK_WORKFLOW_TASKS, MOCK_ESCALATIONS),
    tasksCompletedDaily: 420,
    instanceTrend: dashboard.instanceTrend,
    moduleThroughput: dashboard.moduleBreakdown,
    slaTrend: ['W1', 'W2', 'W3', 'W4'].map((label, i) => ({ label, value: 92 - i * 2 })),
  };
}
