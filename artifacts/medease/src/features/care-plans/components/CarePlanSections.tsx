import { format } from 'date-fns';

import {
  ActivityFeed,
  CareAnalyticsPanel,
  CarePlanCard,
  CarePlanKpiCards,
  CareTeamCard,
  ClinicalPathwayCard,
  CompletionRing,
  GoalCard,
  ProgressChart,
  RiskIndicator,
  TaskCard,
} from '@/features/care-plans/components/CarePlanComponents';
import {
  useCareAnalytics,
  useCareDashboard,
  useCareGoals,
  useCarePlans,
  useCareTasks,
  useCareTeam,
  useCareTimeline,
  useClinicalPathways,
  useProgressTracking,
  useRiskAssessment,
} from '@/features/care-plans/hooks/use-care-plans';
import { useCarePlanMutations } from '@/features/care-plans/mutations/care-plans.mutations';
import type { CarePlanFilters } from '@/services/care-plans/types';
import { BarChartPanel } from '@/shared/charts';
import { DataTable, LoadingView } from '@/shared/components';
import { TimelineEvent } from '@/shared/medical';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Activity } from 'lucide-react';

export function DashboardSection({ filters }: { filters?: CarePlanFilters }) {
  const patientId = filters?.patientId;
  const dashboard = useCareDashboard(patientId);
  const risks = useRiskAssessment(patientId);
  if (!patientId || dashboard.isLoading)
    return <LoadingView label="Loading care plan…" />;
  if (!dashboard.data)
    return <EmptyState icon={Activity} title="No care plan data" />;
  return (
    <div className="space-y-6">
      <CarePlanKpiCards dashboard={dashboard.data} />
      <div className="flex flex-col items-center gap-6 sm:flex-row">
        <CompletionRing percent={dashboard.data.completionPercent} />
        <div className="flex-1 grid gap-2 sm:grid-cols-3 w-full">
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">
                {dashboard.data.upcomingAppointments}
              </p>
              <p className="text-xs text-muted-foreground">Appointments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">
                {dashboard.data.activeMedications}
              </p>
              <p className="text-xs text-muted-foreground">Medications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">
                {dashboard.data.outstandingLabs}
              </p>
              <p className="text-xs text-muted-foreground">Outstanding labs</p>
            </CardContent>
          </Card>
        </div>
      </div>
      {dashboard.data.activePlan ? (
        <CarePlanCard plan={dashboard.data.activePlan} />
      ) : null}
      {(risks.data?.risks ?? []).map((r) => (
        <RiskIndicator key={r.id} risk={r} />
      ))}
      <ActivityFeed
        items={dashboard.data.recentActivity.map((a) => ({
          id: a.id,
          type: 'task',
          title: a.title,
          actor: 'Care team',
          timestamp: a.date,
          carePlanId: dashboard.data!.activePlan?.id ?? '',
        }))}
      />
    </div>
  );
}

export function GoalsSection({ filters }: { filters?: CarePlanFilters }) {
  const patientId = filters?.patientId;
  const query = useCareGoals(patientId);
  const { updateGoal } = useCarePlanMutations();
  if (!patientId || query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(query.data ?? []).map((g) => (
        <GoalCard
          key={g.id}
          goal={g}
          onUpdate={() =>
            void updateGoal.mutateAsync({
              goalId: g.id,
              progressPercent: Math.min(g.progressPercent + 10, 100),
            })
          }
        />
      ))}
    </div>
  );
}

export function TasksSection({ filters }: { filters?: CarePlanFilters }) {
  const patientId = filters?.patientId;
  const query = useCareTasks(patientId);
  const { completeTask } = useCarePlanMutations();
  if (!patientId || query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(query.data ?? []).slice(0, 12).map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          onComplete={() => void completeTask.mutateAsync({ taskId: t.id })}
        />
      ))}
    </div>
  );
}

export function TimelineSection({ filters }: { filters?: CarePlanFilters }) {
  const patientId = filters?.patientId;
  const query = useCareTimeline(patientId);
  if (!patientId || query.isLoading) return <LoadingView />;
  return (
    <TimelineEvent
      items={(query.data ?? []).map((e, i) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: format(new Date(e.date), 'PP'),
        status: i === 0 ? 'current' : 'completed',
      }))}
      aria-label="Care timeline"
    />
  );
}

export function TeamSection({ filters }: { filters?: CarePlanFilters }) {
  const patientId = filters?.patientId;
  const dashboard = useCareDashboard(patientId);
  const planId = dashboard.data?.activePlan?.id;
  const query = useCareTeam(planId);
  if (!patientId || dashboard.isLoading || !planId || query.isLoading)
    return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(query.data ?? []).map((m) => (
        <CareTeamCard key={m.id} member={m} />
      ))}
    </div>
  );
}

export function ProgressSection({ filters }: { filters?: CarePlanFilters }) {
  const patientId = filters?.patientId;
  const query = useProgressTracking(patientId);
  if (!patientId || query.isLoading || !query.data) return <LoadingView />;
  return <ProgressChart progress={query.data} />;
}

export function EducationSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Education</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-2">
        <p>Educational resources linked to your care plan will appear here.</p>
        <p>
          Includes medication guides, lifestyle recommendations, and pathway
          milestones.
        </p>
      </CardContent>
    </Card>
  );
}

export function PathwaysSection() {
  const query = useClinicalPathways();
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(query.data ?? []).map((p) => (
        <ClinicalPathwayCard key={p.id} pathway={p} />
      ))}
    </div>
  );
}

export function PlansListSection({ filters }: { filters?: CarePlanFilters }) {
  const query = useCarePlans(filters);
  if (query.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(query.data?.items ?? []).map((p) => (
        <CarePlanCard key={p.id} plan={p} />
      ))}
    </div>
  );
}

export function CoordinationSection({
  filters,
}: {
  filters?: CarePlanFilters;
}) {
  const tasks = useCareTasks(filters?.patientId);
  if (tasks.isLoading) return <LoadingView />;
  const overdue = (tasks.data ?? []).filter((t) => t.status === 'overdue');
  return (
    <div className="space-y-4">
      <BarChartPanel
        title="Task distribution"
        data={[
          {
            label: 'Pending',
            value: (tasks.data ?? []).filter((t) => t.status === 'pending')
              .length,
          },
          { label: 'Overdue', value: overdue.length },
          {
            label: 'Done',
            value: (tasks.data ?? []).filter((t) => t.status === 'completed')
              .length,
          },
        ]}
      />
      <DataTable
        caption="Coordination tasks"
        data={(tasks.data ?? []).slice(0, 20)}
        getRowId={(r) => r.id}
        columns={[
          { id: 'title', header: 'Task', cell: (r) => r.title },
          { id: 'owner', header: 'Owner', cell: (r) => r.owner },
          { id: 'status', header: 'Status', cell: (r) => r.status },
        ]}
      />
    </div>
  );
}

export function AnalyticsSection({ filters }: { filters?: CarePlanFilters }) {
  const query = useCareAnalytics(filters);
  if (query.isLoading || !query.data) return <LoadingView />;
  return <CareAnalyticsPanel analytics={query.data} />;
}

export type CarePlanSection =
  | 'dashboard'
  | 'goals'
  | 'tasks'
  | 'timeline'
  | 'team'
  | 'progress'
  | 'education'
  | 'pathways'
  | 'plans'
  | 'coordination'
  | 'analytics'
  | 'quality'
  | 'population'
  | 'ward';

export function CarePlanSectionContent({
  section,
  filters,
}: {
  section: CarePlanSection;
  filters?: CarePlanFilters;
}) {
  switch (section) {
    case 'goals':
      return <GoalsSection filters={filters} />;
    case 'tasks':
      return <TasksSection filters={filters} />;
    case 'timeline':
      return <TimelineSection filters={filters} />;
    case 'team':
      return <TeamSection filters={filters} />;
    case 'progress':
      return <ProgressSection filters={filters} />;
    case 'education':
      return <EducationSection />;
    case 'pathways':
      return <PathwaysSection />;
    case 'plans':
      return <PlansListSection filters={filters} />;
    case 'coordination':
      return <CoordinationSection filters={filters} />;
    case 'analytics':
    case 'quality':
    case 'population':
      return <AnalyticsSection filters={filters} />;
    case 'ward':
      return <TasksSection filters={filters} />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
