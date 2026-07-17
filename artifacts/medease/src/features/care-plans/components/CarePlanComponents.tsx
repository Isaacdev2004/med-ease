import { format } from 'date-fns';
import { AlertTriangle, CheckCircle2, Target, Users } from 'lucide-react';

import type {
  CareActivityItem,
  CareAnalytics,
  CareGoal,
  CarePlan,
  CarePlanDashboard,
  CareProgressTracking,
  CareTask,
  CareTeamMember,
  ClinicalPathway,
  RiskAssessment,
} from '@/services/care-plans/types';
import { getRiskSeverityColor } from '@/services/care-plans/risk-engine';
import { MetricCard, StatCard } from '@/shared/components';
import { BarChartPanel, ChartPanel, SparklineChart } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export function CarePlanStatusBadge({
  status,
}: {
  status: CarePlan['status'];
}) {
  const variant =
    status === 'active'
      ? 'success'
      : status === 'on_hold' || status === 'suspended'
        ? 'warning'
        : 'secondary';
  return (
    <Badge variant={variant} className="capitalize">
      {status.replace('_', ' ')}
    </Badge>
  );
}

export function CarePlanCard({ plan }: { plan: CarePlan }) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">{plan.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {plan.primaryDiagnosis}
          </p>
        </div>
        <CarePlanStatusBadge status={plan.status} />
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p>
          {plan.assignedPhysician} · {plan.facilityName}
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline">{plan.progressPercent}% progress</Badge>
          <Badge variant="outline">
            Review {format(new Date(plan.reviewDate), 'PP')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function GoalCard({
  goal,
  onUpdate,
}: {
  goal: CareGoal;
  onUpdate?: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="text-base">{goal.title}</CardTitle>
        <Badge variant={goal.status === 'achieved' ? 'success' : 'info'}>
          {goal.status.replace('_', ' ')}
        </Badge>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground">Target: {goal.target}</p>
        <div
          className="h-2 rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuenow={goal.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${goal.progressPercent}%` }}
          />
        </div>
        <p>
          {goal.progressPercent}% · {goal.owner}
        </p>
        {onUpdate && goal.status !== 'achieved' ? (
          <button
            type="button"
            className="text-primary underline text-sm"
            onClick={onUpdate}
          >
            Update progress
          </button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function TaskCard({
  task,
  onComplete,
}: {
  task: CareTask;
  onComplete?: () => void;
}) {
  return (
    <Card className={cn(task.status === 'overdue' && 'border-destructive/50')}>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="text-base">{task.title}</CardTitle>
        <Badge
          variant={
            task.status === 'completed'
              ? 'success'
              : task.status === 'overdue'
                ? 'destructive'
                : 'warning'
          }
        >
          {task.status}
        </Badge>
      </CardHeader>
      <CardContent className="text-sm">
        <p>
          {format(new Date(task.dueDate), 'PPp')} ·{' '}
          {task.type.replace('_', ' ')}
        </p>
        <p className="text-muted-foreground">{task.owner}</p>
        {onComplete && task.status === 'pending' ? (
          <button
            type="button"
            className="mt-2 text-primary underline"
            onClick={onComplete}
          >
            Mark complete
          </button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function CareTeamCard({ member }: { member: CareTeamMember }) {
  return (
    <Card>
      <CardContent className="pt-4 flex gap-3">
        <Users className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
        <div className="text-sm">
          <p className="font-medium">
            {member.name}
            {member.isPrimary ? ' (Primary)' : ''}
          </p>
          <p className="text-muted-foreground capitalize">
            {member.role.replace('_', ' ')}
          </p>
          <p>{member.responsibilities.join(' · ')}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskIndicator({ risk }: { risk: RiskAssessment }) {
  return (
    <Card
      className="border-l-4"
      style={{ borderLeftColor: getRiskSeverityColor(risk.severity) }}
    >
      <CardContent className="pt-4 flex gap-3">
        <AlertTriangle
          className="h-5 w-5 shrink-0 text-destructive"
          aria-hidden="true"
        />
        <div className="text-sm">
          <p className="font-medium">{risk.title}</p>
          <p className="capitalize text-muted-foreground">
            {risk.category} · {risk.severity} · Score {risk.score}
          </p>
          <p>{risk.recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function CarePlanKpiCards({
  dashboard,
}: {
  dashboard: CarePlanDashboard;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        label="Health Score"
        value={dashboard.healthScore}
        icon={Target}
      />
      <MetricCard
        title="Progress"
        value={`${dashboard.progressPercent}%`}
        status="info"
      />
      <MetricCard
        title="Pending Tasks"
        value={dashboard.pendingTasks}
        status="warning"
      />
      <MetricCard
        title="Overdue"
        value={dashboard.overdueTasks}
        status={dashboard.overdueTasks > 0 ? 'warning' : 'success'}
      />
      <MetricCard
        title="Risk"
        value={dashboard.riskLevel}
        status={dashboard.riskLevel === 'critical' ? 'critical' : 'neutral'}
      />
    </div>
  );
}

export function CompletionRing({ percent }: { percent: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-full border-8 border-primary/20 h-32 w-32"
      aria-label={`Completion ${percent}%`}
    >
      <span className="text-2xl font-bold">{percent}%</span>
      <span className="text-xs text-muted-foreground">Complete</span>
    </div>
  );
}

export function ProgressChart({
  progress,
}: {
  progress: CareProgressTracking;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartPanel title="Health score trend">
        <SparklineChart data={progress.healthScoreTrend} />
      </ChartPanel>
      <BarChartPanel
        title="Progress metrics"
        data={[
          { label: 'Goals', value: progress.goalCompletion },
          { label: 'Meds', value: progress.medicationCompliance },
          { label: 'Appts', value: progress.appointmentAttendance },
        ]}
      />
    </div>
  );
}

export function ClinicalPathwayCard({ pathway }: { pathway: ClinicalPathway }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{pathway.name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground">{pathway.description}</p>
        <p>
          {pathway.milestones.filter((m) => m.completed).length}/
          {pathway.milestones.length} milestones
        </p>
        <p className="text-xs">{pathway.completionCriteria}</p>
      </CardContent>
    </Card>
  );
}

export function ActivityFeed({ items }: { items: CareActivityItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex gap-3 text-sm border-b pb-3 last:border-0"
        >
          <CheckCircle2
            className="h-4 w-4 text-primary shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-muted-foreground">
              {item.actor} · {format(new Date(item.timestamp), 'PPp')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CareAnalyticsPanel({
  analytics,
}: {
  analytics: CareAnalytics;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{analytics.totalPlans}</p>
            <p className="text-xs text-muted-foreground">Total plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{analytics.activePlans}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{analytics.completionRate}%</p>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-2xl font-bold">{analytics.qualityScore}</p>
            <p className="text-xs text-muted-foreground">Quality score</p>
          </CardContent>
        </Card>
      </div>
      <BarChartPanel title="Plans by type" data={analytics.plansByType} />
      <BarChartPanel
        title="Completion by month"
        data={analytics.completionByMonth}
      />
    </div>
  );
}
