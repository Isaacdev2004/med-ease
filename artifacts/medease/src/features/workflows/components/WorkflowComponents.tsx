import { format } from 'date-fns';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  GitBranch,
  Layers,
  ListTodo,
  Play,
  Settings,
  Workflow,
  Zap,
} from 'lucide-react';

import type {
  Approval,
  BackgroundJob,
  BusinessRule,
  Escalation,
  ProcessTemplate,
  SLA,
  WorkflowAnalytics,
  WorkflowDashboard,
  WorkflowDefinition,
  WorkflowEvent,
  WorkflowInstance,
  WorkflowSchedule,
  WorkflowTask,
} from '@/services/workflows/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const instanceVariant = { running: 'default', paused: 'secondary', completed: 'outline', cancelled: 'destructive', failed: 'destructive' } as const;
const slaVariant = { on_track: 'default', at_risk: 'secondary', breached: 'destructive' } as const;

export function WorkflowDashboardPanel({ dashboard }: { dashboard: WorkflowDashboard }) {
  const metrics = [
    { label: 'Workflow Definitions', value: dashboard.totalDefinitions.toLocaleString(), icon: GitBranch },
    { label: 'Active Instances', value: dashboard.activeInstances.toLocaleString(), icon: Play },
    { label: 'Pending Tasks', value: dashboard.pendingTasks.toLocaleString(), icon: ListTodo },
    { label: 'Pending Approvals', value: dashboard.pendingApprovals.toLocaleString(), icon: CheckCircle },
    { label: 'SLA Breaches', value: dashboard.slaBreaches.toLocaleString(), icon: AlertTriangle },
    { label: 'Background Jobs', value: dashboard.backgroundJobsRunning.toLocaleString(), icon: Zap },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4 flex items-center gap-3">
              <m.icon className="h-8 w-8 text-primary shrink-0" />
              <div><p className="text-2xl font-bold">{m.value}</p><p className="text-xs text-muted-foreground">{m.label}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel title="Instance Activity" data={dashboard.instanceTrend} />
      <BarChartPanel title="Workflows by Module" data={dashboard.moduleBreakdown} />
    </div>
  );
}

export function WorkflowDesigner({ definitions }: { definitions: WorkflowDefinition[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><Workflow className="h-5 w-5" /> Workflow Designer</CardTitle></CardHeader>
      <CardContent>
        <div className="rounded-md border bg-muted/30 h-48 flex items-center justify-center text-sm text-muted-foreground">
          BPMN canvas — {definitions.length} workflow(s) available for design
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {definitions.slice(0, 4).map((d) => (
            <div key={d.workflowId} className="text-sm border rounded p-2 flex justify-between">
              <span>{d.name}</span>
              <Badge variant="outline">v{d.version}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function BPMNCanvas({ workflowName }: { workflowName: string }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="rounded-md border bg-muted/20 h-40 flex items-center justify-center text-xs text-muted-foreground">
          BPMN diagram for {workflowName}
        </div>
      </CardContent>
    </Card>
  );
}

export function WorkflowCard({ workflow }: { workflow: WorkflowDefinition }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{workflow.name}</span>
          <Badge className="capitalize">{workflow.status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{workflow.description}</p>
        <div className="flex gap-1">
          <Badge variant="outline">{workflow.module}</Badge>
          <Badge variant="outline">{workflow.stageCount} stages</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProcessCard({ instance }: { instance: WorkflowInstance }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{instance.workflowName}</span>
          <Badge variant={instanceVariant[instance.status]} className="capitalize">{instance.status}</Badge>
        </div>
        <p className="text-xs">{instance.currentStage}</p>
        <Badge variant={slaVariant[instance.slaStatus]} className="capitalize">{instance.slaStatus.replace('_', ' ')}</Badge>
      </CardContent>
    </Card>
  );
}

export function TaskBoard({ tasks }: { tasks: WorkflowTask[] }) {
  const columns = ['pending', 'in_progress', 'completed'] as const;
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((col) => (
        <Card key={col}>
          <CardHeader><CardTitle className="text-sm capitalize">{col.replace('_', ' ')}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {tasks.filter((t) => t.status === col).slice(0, 5).map((t) => (
              <div key={t.taskId} className="text-sm border rounded p-2">
                <p className="font-medium line-clamp-1">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.workflowName}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function KanbanBoard({ tasks }: { tasks: WorkflowTask[] }) {
  return <TaskBoard tasks={tasks} />;
}

export function ApprovalCard({ approval }: { approval: Approval }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{approval.title}</span>
          <Badge className="capitalize">{approval.status}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{approval.workflowName}</p>
        <p className="text-xs">Step {approval.currentStep} of {approval.totalSteps}</p>
      </CardContent>
    </Card>
  );
}

export function ApprovalQueue({ approvals }: { approvals: Approval[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Approval Queue</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {approvals.slice(0, 8).map((a) => (
          <div key={a.approvalId} className="flex justify-between text-sm border-b pb-2 last:border-0">
            <span>{a.title}</span>
            <Badge className="capitalize">{a.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function RuleBuilder({ rules }: { rules: BusinessRule[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {rules.slice(0, 6).map((r) => (
        <Card key={r.ruleId}>
          <CardContent className="pt-4 text-sm space-y-2">
            <div className="flex justify-between gap-2">
              <span className="font-medium">{r.name}</span>
              <Badge variant={r.enabled ? 'default' : 'secondary'}>{r.enabled ? 'Enabled' : 'Disabled'}</Badge>
            </div>
            <p className="text-xs font-mono">{r.condition}</p>
            <Badge variant="outline">{r.action}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TriggerCard({ trigger }: { trigger: { triggerId: string; type: string; eventName?: string; enabled: boolean } }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm flex justify-between gap-2">
        <div>
          <Badge variant="outline" className="capitalize">{trigger.type}</Badge>
          {trigger.eventName && <p className="text-xs mt-1">{trigger.eventName}</p>}
        </div>
        <Badge variant={trigger.enabled ? 'default' : 'secondary'}>{trigger.enabled ? 'Active' : 'Inactive'}</Badge>
      </CardContent>
    </Card>
  );
}

export function EventTimeline({ events }: { events: WorkflowEvent[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Event Timeline</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {events.slice(0, 10).map((e) => (
          <div key={e.eventId} className="flex justify-between text-sm border-b pb-2 last:border-0">
            <div>
              <p className="font-medium">{e.type}</p>
              <p className="text-xs text-muted-foreground">{e.module} · {e.source}</p>
            </div>
            <span className="text-xs text-muted-foreground">{format(new Date(e.timestamp), 'MMM d, HH:mm')}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SchedulerCard({ schedule }: { schedule: WorkflowSchedule }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{schedule.name}</span>
          <Badge variant={schedule.enabled ? 'default' : 'secondary'}>{schedule.enabled ? 'Enabled' : 'Disabled'}</Badge>
        </div>
        <p className="text-xs font-mono">{schedule.cron}</p>
        <p className="text-xs text-muted-foreground">Next: {format(new Date(schedule.nextRunAt), 'MMM d, HH:mm')}</p>
      </CardContent>
    </Card>
  );
}

export function JobQueue({ jobs }: { jobs: BackgroundJob[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Background Jobs</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {jobs.slice(0, 8).map((j) => (
          <div key={j.jobId} className="flex justify-between text-sm border-b pb-2 last:border-0">
            <span>{j.name}</span>
            <Badge className="capitalize">{j.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function SLAWidget({ sla }: { sla: SLA }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1"><Clock className="h-4 w-4" /> {sla.name}</span>
          <Badge variant={slaVariant[sla.status]} className="capitalize">{sla.status.replace('_', ' ')}</Badge>
        </div>
        <p className="text-xs">Target: {sla.targetMinutes} min · Warning: {sla.warningMinutes} min</p>
      </CardContent>
    </Card>
  );
}

export function EscalationPanel({ escalations }: { escalations: Escalation[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Escalations</CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {escalations.length === 0 ? <p className="text-sm text-muted-foreground">No escalations.</p> : escalations.slice(0, 6).map((e) => (
          <div key={e.escalationId} className="text-sm border-b pb-2 last:border-0">
            <div className="flex justify-between gap-2">
              <span className="font-medium">{e.taskId}</span>
              <Badge variant={e.resolved ? 'outline' : 'destructive'}>{e.resolved ? 'Resolved' : 'Open'}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{e.reason}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AutomationCard({ job }: { job: BackgroundJob }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium flex items-center gap-1"><Zap className="h-4 w-4" /> {job.name}</span>
          <Badge className="capitalize">{job.status}</Badge>
        </div>
        <Badge variant="outline">{job.module}</Badge>
      </CardContent>
    </Card>
  );
}

export function WorkflowMonitor({ instances }: { instances: WorkflowInstance[] }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base flex items-center gap-2"><Settings className="h-5 w-5" /> Process Monitor</CardTitle></CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
        <div><p className="text-xs text-muted-foreground">Running</p><p className="text-lg font-semibold">{instances.filter((i) => i.status === 'running').length}</p></div>
        <div><p className="text-xs text-muted-foreground">Paused</p><p className="text-lg font-semibold">{instances.filter((i) => i.status === 'paused').length}</p></div>
        <div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-semibold">{instances.filter((i) => i.status === 'completed').length}</p></div>
        <div><p className="text-xs text-muted-foreground">Failed</p><p className="text-lg font-semibold">{instances.filter((i) => i.status === 'failed').length}</p></div>
      </CardContent>
    </Card>
  );
}

export function WorkflowAnalyticsPanel({ analytics }: { analytics: WorkflowAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Completion Rate', value: `${analytics.completionRate}%` },
          { label: 'Avg Cycle Time (hrs)', value: analytics.avgCycleTimeHours },
          { label: 'SLA Compliance', value: `${analytics.slaComplianceRate}%` },
          { label: 'Approval Turnaround (hrs)', value: analytics.approvalTurnaroundHours },
          { label: 'Automation Rate', value: `${analytics.automationRate}%` },
          { label: 'Tasks/Day', value: analytics.tasksCompletedDaily },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <BarChartPanel title="Module Throughput" data={analytics.moduleThroughput} />
    </div>
  );
}

export function ProcessHeatmap({ analytics }: { analytics: WorkflowAnalytics }) {
  return <BarChartPanel title="SLA Trend" data={analytics.slaTrend} />;
}

export function ProcessTemplateCard({ template }: { template: ProcessTemplate }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <span className="font-medium flex items-center gap-1"><Layers className="h-4 w-4" /> {template.name}</span>
        <div className="flex gap-1">
          <Badge variant="outline">{template.module}</Badge>
          <Badge variant="outline">{template.category}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{template.usageCount} uses</p>
      </CardContent>
    </Card>
  );
}

export function ExportToolbar({ onExport }: { onExport: (format: 'csv' | 'pdf' | 'xlsx') => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => onExport('csv')}><BarChart3 className="h-4 w-4 mr-1" /> Export CSV</Button>
      <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>Export PDF</Button>
      <Button variant="outline" size="sm" onClick={() => onExport('xlsx')}>Export XLSX</Button>
    </div>
  );
}
