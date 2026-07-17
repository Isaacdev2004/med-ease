import { computeWorkflowAnalytics } from '@/services/workflows/analytics';
import { createEvent, workflowEventBus } from '@/services/workflows/event-bus';
import { nextApprovalStatus } from '@/services/workflows/approval-engine';
import { nextInstanceStatus } from '@/services/workflows/workflow-engine';
import { nextTaskStatus } from '@/services/workflows/task-engine';
import { parseCronNextRun } from '@/services/workflows/scheduler';
import {
  MOCK_APPROVALS,
  MOCK_BACKGROUND_JOBS,
  MOCK_BUSINESS_RULES,
  MOCK_ESCALATIONS,
  MOCK_EVENT_QUEUES,
  MOCK_PROCESS_TEMPLATES,
  MOCK_SCHEDULES,
  MOCK_SLAS,
  MOCK_WORKFLOW_AUDITS,
  MOCK_WORKFLOW_DEFINITIONS,
  MOCK_WORKFLOW_EVENTS,
  MOCK_WORKFLOW_INSTANCES,
  MOCK_WORKFLOW_TASKS,
  MOCK_WORKFLOW_TRIGGERS,
  buildWorkflowDashboard,
} from '@/services/workflows/mock-data';
import type {
  ApproveInput,
  AssignTaskInput,
  CompleteTaskInput,
  CreateRuleInput,
  CreateWorkflowInput,
  EscalateInput,
  RejectInput,
  ScheduleWorkflowInput,
  ShareWorkflowInput,
  StartWorkflowInput,
  WorkflowFavorite,
  WorkflowFilters,
} from '@/services/workflows/types';

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = ((page ?? 1) - 1) * (pageSize ?? 25);
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page: page ?? 1,
    pageSize: pageSize ?? 25,
  };
}

function matchQ(q: string | undefined, ...fields: (string | undefined)[]) {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(lower));
}

function audit(instanceId: string, action: string, actorId = 'system') {
  MOCK_WORKFLOW_AUDITS.unshift({
    auditId: `wfa-${Date.now()}`,
    instanceId,
    action,
    actorId,
    outcome: 'success',
    timestamp: new Date().toISOString(),
  });
}

class WorkflowRepository {
  private definitions = [...MOCK_WORKFLOW_DEFINITIONS];
  private instances = [...MOCK_WORKFLOW_INSTANCES];
  private tasks = [...MOCK_WORKFLOW_TASKS];
  private approvals = [...MOCK_APPROVALS];
  private rules = [...MOCK_BUSINESS_RULES];
  private schedules = [...MOCK_SCHEDULES];
  private escalations = [...MOCK_ESCALATIONS];
  private favorites: WorkflowFavorite[] = [];
  private nextId = 770000;

  dashboard(facilityId?: string) {
    return buildWorkflowDashboard(facilityId);
  }
  analytics(facilityId?: string) {
    return computeWorkflowAnalytics(facilityId);
  }

  getDefinitions(filters?: WorkflowFilters) {
    let items = this.definitions;
    if (filters?.module)
      items = items.filter((d) => d.module === filters.module);
    if (filters?.status)
      items = items.filter((d) => d.status === filters.status);
    if (filters?.q)
      items = items.filter((d) => matchQ(filters.q, d.name, d.description));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getDefinition(workflowId: string) {
    return this.definitions.find((d) => d.workflowId === workflowId) ?? null;
  }

  getInstances(filters?: WorkflowFilters) {
    let items = this.instances;
    if (filters?.facilityId)
      items = items.filter((i) => i.facilityId === filters.facilityId);
    if (filters?.module)
      items = items.filter((i) => i.module === filters.module);
    if (filters?.status)
      items = items.filter((i) => i.status === filters.status);
    if (filters?.q)
      items = items.filter((i) =>
        matchQ(filters.q, i.workflowName, i.instanceId),
      );
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getInstance(instanceId: string) {
    return this.instances.find((i) => i.instanceId === instanceId) ?? null;
  }

  getTasks(filters?: WorkflowFilters) {
    let items = this.tasks;
    if (filters?.module)
      items = items.filter((t) => t.module === filters.module);
    if (filters?.status)
      items = items.filter((t) => t.status === filters.status);
    if (filters?.assigneeId)
      items = items.filter((t) => t.assigneeId === filters.assigneeId);
    if (filters?.userId)
      items = items.filter((t) => t.assigneeId === filters.userId);
    if (filters?.q)
      items = items.filter((t) => matchQ(filters.q, t.title, t.workflowName));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getApprovals(filters?: WorkflowFilters) {
    let items = this.approvals;
    if (filters?.module)
      items = items.filter((a) => a.module === filters.module);
    if (filters?.status)
      items = items.filter((a) => a.status === filters.status);
    if (filters?.userId)
      items = items.filter((a) => a.requesterId === filters.userId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getRules(filters?: WorkflowFilters) {
    let items = this.rules;
    if (filters?.module)
      items = items.filter((r) => r.module === filters.module);
    if (filters?.q)
      items = items.filter((r) => matchQ(filters.q, r.name, r.condition));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getSchedules(filters?: WorkflowFilters) {
    let items = this.schedules;
    if (filters?.q) items = items.filter((s) => matchQ(filters.q, s.name));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getJobs(filters?: WorkflowFilters) {
    let items = MOCK_BACKGROUND_JOBS;
    if (filters?.module)
      items = items.filter((j) => j.module === filters.module);
    if (filters?.status)
      items = items.filter((j) => j.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getEvents(filters?: WorkflowFilters) {
    let items = MOCK_WORKFLOW_EVENTS;
    if (filters?.module)
      items = items.filter((e) => e.module === filters.module);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getEventQueues() {
    return MOCK_EVENT_QUEUES;
  }

  getSlas(filters?: WorkflowFilters) {
    let items = MOCK_SLAS;
    if (filters?.status)
      items = items.filter((s) => s.status === filters.status);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getEscalations(filters?: WorkflowFilters) {
    let items = this.escalations;
    if (filters?.q) items = items.filter((e) => matchQ(filters.q, e.reason));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getTemplates(filters?: WorkflowFilters) {
    let items = MOCK_PROCESS_TEMPLATES;
    if (filters?.module)
      items = items.filter((t) => t.module === filters.module);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getTriggers(filters?: WorkflowFilters) {
    let items = MOCK_WORKFLOW_TRIGGERS;
    if (filters?.q) items = items.filter((t) => matchQ(filters.q, t.eventName));
    return paginate(items, filters?.page, filters?.pageSize);
  }

  getAudits(filters?: WorkflowFilters) {
    let items = MOCK_WORKFLOW_AUDITS;
    if (filters?.userId)
      items = items.filter((a) => a.actorId === filters.userId);
    return paginate(items, filters?.page, filters?.pageSize);
  }

  createWorkflow(input: CreateWorkflowInput) {
    const workflow = {
      workflowId: `wf-${this.nextId++}`,
      name: input.name,
      description: input.description,
      module: input.module,
      version: 1,
      status: 'draft' as const,
      stageCount: 3,
      taskCount: 5,
      updatedAt: new Date().toISOString(),
    };
    this.definitions.unshift(workflow);
    return workflow;
  }

  publishWorkflow(workflowId: string) {
    const def = this.definitions.find((d) => d.workflowId === workflowId);
    if (!def) return null;
    def.status = 'published';
    def.publishedAt = new Date().toISOString();
    def.updatedAt = new Date().toISOString();
    return def;
  }

  startWorkflow(input: StartWorkflowInput) {
    const def = this.definitions.find((d) => d.workflowId === input.workflowId);
    if (!def || def.status !== 'published') return null;
    const instance = {
      instanceId: `wfi-${this.nextId++}`,
      workflowId: def.workflowId,
      workflowName: def.name,
      module: def.module,
      status: 'running' as const,
      currentStage: 'Stage 1',
      startedBy: input.startedBy,
      startedAt: new Date().toISOString(),
      facilityId: input.facilityId,
      slaStatus: 'on_track' as const,
    };
    this.instances.unshift(instance);
    const event = createEvent(
      'workflow.started',
      instance.instanceId,
      def.module,
      def.name,
    );
    workflowEventBus.publish(event);
    audit(instance.instanceId, 'start', input.startedBy);
    return instance;
  }

  pauseWorkflow(instanceId: string) {
    const inst = this.instances.find((i) => i.instanceId === instanceId);
    if (!inst || inst.status !== 'running') return null;
    inst.status = nextInstanceStatus(inst.status, 'pause');
    audit(instanceId, 'pause');
    return inst;
  }

  resumeWorkflow(instanceId: string) {
    const inst = this.instances.find((i) => i.instanceId === instanceId);
    if (!inst || inst.status !== 'paused') return null;
    inst.status = nextInstanceStatus(inst.status, 'resume');
    audit(instanceId, 'resume');
    return inst;
  }

  cancelWorkflow(instanceId: string) {
    const inst = this.instances.find((i) => i.instanceId === instanceId);
    if (!inst) return null;
    inst.status = nextInstanceStatus(inst.status, 'cancel');
    audit(instanceId, 'cancel');
    return inst;
  }

  completeTask(input: CompleteTaskInput) {
    const task = this.tasks.find((t) => t.taskId === input.taskId);
    if (!task) return null;
    task.status = nextTaskStatus('complete');
    audit(task.instanceId, 'complete_task', input.completedBy);
    return task;
  }

  assignTask(input: AssignTaskInput) {
    const task = this.tasks.find((t) => t.taskId === input.taskId);
    if (!task) return null;
    task.assigneeId = input.assigneeId;
    task.status = 'in_progress';
    audit(task.instanceId, 'assign_task', input.assigneeId);
    return task;
  }

  approve(input: ApproveInput) {
    const approval = this.approvals.find(
      (a) => a.approvalId === input.approvalId,
    );
    if (!approval) return null;
    approval.status = nextApprovalStatus('approve');
    audit(approval.instanceId, 'approve', input.approverId);
    return approval;
  }

  reject(input: RejectInput) {
    const approval = this.approvals.find(
      (a) => a.approvalId === input.approvalId,
    );
    if (!approval) return null;
    approval.status = nextApprovalStatus('reject');
    audit(approval.instanceId, 'reject', input.approverId);
    return approval;
  }

  escalate(input: EscalateInput) {
    const task = this.tasks.find((t) => t.taskId === input.taskId);
    if (!task) return null;
    task.status = nextTaskStatus('escalate');
    const escalation = {
      escalationId: `esc-${this.nextId++}`,
      taskId: input.taskId,
      reason: input.reason,
      escalatedTo: input.escalatedTo,
      escalatedAt: new Date().toISOString(),
      resolved: false,
    };
    this.escalations.unshift(escalation);
    audit(task.instanceId, 'escalate', input.escalatedTo);
    return escalation;
  }

  createRule(input: CreateRuleInput) {
    const rule = {
      ruleId: `rule-${this.nextId++}`,
      name: input.name,
      module: input.module,
      condition: input.condition,
      action: input.action,
      enabled: true,
      priority: 5,
    };
    this.rules.unshift(rule);
    return rule;
  }

  scheduleWorkflow(input: ScheduleWorkflowInput) {
    const schedule = {
      scheduleId: `sched-${this.nextId++}`,
      workflowId: input.workflowId,
      name: input.name,
      cron: input.cron,
      enabled: true,
      nextRunAt: parseCronNextRun(input.cron),
    };
    this.schedules.unshift(schedule);
    return schedule;
  }

  exportData(format: 'csv' | 'pdf' | 'xlsx') {
    return {
      format,
      exportedAt: new Date().toISOString(),
      recordCount: this.instances.length,
    };
  }

  favorite(
    userId: string,
    entityType: 'workflow' | 'instance' | 'template',
    entityId: string,
  ) {
    if (
      !this.favorites.some(
        (f) => f.userId === userId && f.entityId === entityId,
      )
    ) {
      this.favorites.push({
        userId,
        entityType,
        entityId,
        createdAt: new Date().toISOString(),
      });
    }
    return { userId, entityType, entityId };
  }

  getFavorites(userId: string) {
    return this.favorites.filter((f) => f.userId === userId);
  }

  share(input: ShareWorkflowInput) {
    audit(input.workflowId, 'share');
    return {
      workflowId: input.workflowId,
      sharedWith: input.sharedWith,
      sharedAt: new Date().toISOString(),
    };
  }

  search(query: string, filters?: WorkflowFilters) {
    const defs = this.definitions.filter((d) =>
      matchQ(query, d.name, d.description),
    );
    const inst = this.instances.filter((i) =>
      matchQ(query, i.workflowName, i.instanceId),
    );
    return {
      definitions: paginate(defs, filters?.page, filters?.pageSize),
      instances: paginate(inst, filters?.page, filters?.pageSize),
    };
  }
}

export const workflowRepository = new WorkflowRepository();
