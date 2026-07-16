import { Workflow } from 'lucide-react';

import {
  ApprovalCard,
  ApprovalQueue,
  AutomationCard,
  EscalationPanel,
  EventTimeline,
  ExportToolbar,
  JobQueue,
  KanbanBoard,
  ProcessCard,
  ProcessHeatmap,
  ProcessTemplateCard,
  RuleBuilder,
  SchedulerCard,
  SLAWidget,
  TriggerCard,
  WorkflowAnalyticsPanel,
  WorkflowCard,
  WorkflowDashboardPanel,
  WorkflowDesigner,
  WorkflowMonitor,
} from '@/features/workflows/components/WorkflowComponents';
import {
  useApprovals,
  useEscalations,
  useEvents,
  useEventQueues,
  useJobs,
  useProcessTemplates,
  useRules,
  useSchedules,
  useSLAs,
  useTasks,
  useWorkflowAnalytics,
  useWorkflowDashboard,
  useWorkflowDefinitions,
  useWorkflowInstances,
  useWorkflowTriggers,
} from '@/features/workflows/hooks/use-workflows';
import { useWorkflowMutations } from '@/features/workflows/mutations/workflow.mutations';
import type { WorkflowFilters } from '@/services/workflows/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

export type WorkflowSection =
  | 'dashboard'
  | 'my-tasks'
  | 'approvals'
  | 'processes'
  | 'work-queues'
  | 'sla-monitor'
  | 'automation'
  | 'workflow-designer'
  | 'process-library'
  | 'workflow-instances'
  | 'business-rules'
  | 'event-bus'
  | 'background-jobs'
  | 'schedulers'
  | 'workflow-analytics'
  | 'process-monitor';

interface SectionProps {
  filters?: WorkflowFilters;
  variant?: 'professional' | 'facility' | 'admin';
}

export function DashboardSection({ filters }: SectionProps) {
  const dashboard = useWorkflowDashboard(filters?.facilityId);
  const defs = useWorkflowDefinitions(filters);
  const instances = useWorkflowInstances(filters);
  const { exportData } = useWorkflowMutations();
  if (dashboard.isLoading) return <LoadingView label="Loading workflow dashboard…" />;
  if (!dashboard.data) return <EmptyState icon={Workflow} title="No workflow data" />;
  return (
    <div className="space-y-6">
      <WorkflowDashboardPanel dashboard={dashboard.data} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(defs.data?.items ?? []).slice(0, 6).map((w) => <WorkflowCard key={w.workflowId} workflow={w} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(instances.data?.items ?? []).slice(0, 6).map((i) => <ProcessCard key={i.instanceId} instance={i} />)}
      </div>
      <EventTimeline events={dashboard.data.recentEvents} />
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function MyTasksSection({ filters }: SectionProps) {
  const tasks = useTasks({ ...filters, userId: filters?.userId });
  const { completeTask } = useWorkflowMutations();
  if (tasks.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <KanbanBoard tasks={tasks.data?.items ?? []} />
      {(tasks.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => completeTask.mutate({ taskId: tasks.data!.items[0]!.taskId, completedBy: filters?.userId ?? 'current-user' })}>
          Complete first task (demo)
        </button>
      )}
    </div>
  );
}

export function ApprovalsSection({ filters }: SectionProps) {
  const approvals = useApprovals(filters);
  const { approve, reject } = useWorkflowMutations();
  if (approvals.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <ApprovalQueue approvals={approvals.data?.items ?? []} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(approvals.data?.items ?? []).slice(0, 6).map((a) => <ApprovalCard key={a.approvalId} approval={a} />)}
      </div>
      {(approvals.data?.items ?? [])[0] && (
        <div className="flex gap-4">
          <button type="button" className="text-sm text-primary underline" onClick={() => approve.mutate({ approvalId: approvals.data!.items[0]!.approvalId, approverId: 'current-user' })}>Approve (demo)</button>
          <button type="button" className="text-sm text-primary underline" onClick={() => reject.mutate({ approvalId: approvals.data!.items[0]!.approvalId, approverId: 'current-user', reason: 'Insufficient info' })}>Reject (demo)</button>
        </div>
      )}
    </div>
  );
}

export function ProcessesSection({ filters }: SectionProps) {
  const instances = useWorkflowInstances(filters);
  const { startWorkflow } = useWorkflowMutations();
  const defs = useWorkflowDefinitions({ ...filters, status: 'published' });
  if (instances.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(instances.data?.items ?? []).slice(0, 9).map((i) => <ProcessCard key={i.instanceId} instance={i} />)}
      </div>
      {(defs.data?.items ?? [])[0] && (
        <button type="button" className="text-sm text-primary underline" onClick={() => startWorkflow.mutate({ workflowId: defs.data!.items[0]!.workflowId, startedBy: 'current-user', facilityId: filters?.facilityId })}>
          Start workflow (demo)
        </button>
      )}
    </div>
  );
}

export function WorkQueuesSection({ filters }: SectionProps) {
  const tasks = useTasks(filters);
  if (tasks.isLoading) return <LoadingView />;
  return <KanbanBoard tasks={tasks.data?.items ?? []} />;
}

export function SlaMonitorSection({ filters }: SectionProps) {
  const slas = useSLAs(filters);
  const instances = useWorkflowInstances(filters);
  if (slas.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(slas.data?.items ?? []).map((s) => <SLAWidget key={s.slaId} sla={s} />)}
      </div>
      <WorkflowMonitor instances={instances.data?.items ?? []} />
    </div>
  );
}

export function AutomationSection({ filters }: SectionProps) {
  const jobs = useJobs(filters);
  if (jobs.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <JobQueue jobs={jobs.data?.items ?? []} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(jobs.data?.items ?? []).slice(0, 6).map((j) => <AutomationCard key={j.jobId} job={j} />)}
      </div>
    </div>
  );
}

export function DesignerSection({ filters }: SectionProps) {
  const defs = useWorkflowDefinitions(filters);
  if (defs.isLoading) return <LoadingView />;
  return <WorkflowDesigner definitions={defs.data?.items ?? []} />;
}

export function ProcessLibrarySection({ filters }: SectionProps) {
  const templates = useProcessTemplates(filters);
  const defs = useWorkflowDefinitions(filters);
  if (templates.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(templates.data?.items ?? []).map((t) => <ProcessTemplateCard key={t.templateId} template={t} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(defs.data?.items ?? []).slice(0, 6).map((w) => <WorkflowCard key={w.workflowId} workflow={w} />)}
      </div>
    </div>
  );
}

export function InstancesSection({ filters }: SectionProps) {
  const instances = useWorkflowInstances(filters);
  const escalations = useEscalations(filters);
  if (instances.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(instances.data?.items ?? []).slice(0, 12).map((i) => <ProcessCard key={i.instanceId} instance={i} />)}
      </div>
      <EscalationPanel escalations={escalations.data?.items ?? []} />
    </div>
  );
}

export function RulesSection({ filters }: SectionProps) {
  const rules = useRules(filters);
  if (rules.isLoading) return <LoadingView />;
  return <RuleBuilder rules={rules.data?.items ?? []} />;
}

export function EventBusSection({ filters }: SectionProps) {
  const events = useEvents(filters);
  const queues = useEventQueues();
  const triggers = useWorkflowTriggers(filters);
  if (events.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {(queues.data ?? []).map((q) => (
          <div key={q.queueId} className="rounded-lg border p-4 text-sm">
            <p className="font-medium">{q.name}</p>
            <p className="text-xs text-muted-foreground">{q.pendingCount} pending · {q.processedCount.toLocaleString()} processed</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(triggers.data?.items ?? []).slice(0, 6).map((t) => <TriggerCard key={t.triggerId} trigger={t} />)}
      </div>
      <EventTimeline events={events.data?.items ?? []} />
    </div>
  );
}

export function JobsSection({ filters }: SectionProps) {
  return <AutomationSection filters={filters} />;
}

export function SchedulersSection({ filters }: SectionProps) {
  const schedules = useSchedules(filters);
  if (schedules.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(schedules.data?.items ?? []).map((s) => <SchedulerCard key={s.scheduleId} schedule={s} />)}
    </div>
  );
}

export function AnalyticsSection({ filters }: SectionProps) {
  const analytics = useWorkflowAnalytics(filters?.facilityId);
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return null;
  return (
    <div className="space-y-6">
      <WorkflowAnalyticsPanel analytics={analytics.data} />
      <ProcessHeatmap analytics={analytics.data} />
    </div>
  );
}

export function MonitorSection({ filters }: SectionProps) {
  const instances = useWorkflowInstances(filters);
  const escalations = useEscalations(filters);
  if (instances.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <WorkflowMonitor instances={instances.data?.items ?? []} />
      <EscalationPanel escalations={escalations.data?.items ?? []} />
    </div>
  );
}

export function WorkflowSectionContent({ section, filters }: { section: WorkflowSection; filters?: WorkflowFilters; variant?: 'professional' | 'facility' | 'admin' }) {
  switch (section) {
    case 'my-tasks': return <MyTasksSection filters={filters} />;
    case 'approvals': return <ApprovalsSection filters={filters} />;
    case 'processes': return <ProcessesSection filters={filters} />;
    case 'work-queues': return <WorkQueuesSection filters={filters} />;
    case 'sla-monitor': return <SlaMonitorSection filters={filters} />;
    case 'automation': return <AutomationSection filters={filters} />;
    case 'workflow-designer': return <DesignerSection filters={filters} />;
    case 'process-library': return <ProcessLibrarySection filters={filters} />;
    case 'workflow-instances': return <InstancesSection filters={filters} />;
    case 'business-rules': return <RulesSection filters={filters} />;
    case 'event-bus': return <EventBusSection filters={filters} />;
    case 'background-jobs': return <JobsSection filters={filters} />;
    case 'schedulers': return <SchedulersSection filters={filters} />;
    case 'workflow-analytics': return <AnalyticsSection filters={filters} />;
    case 'process-monitor': return <MonitorSection filters={filters} />;
    default: return <DashboardSection filters={filters} />;
  }
}
