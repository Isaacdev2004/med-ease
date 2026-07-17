import { format } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  HeartPulse,
  Megaphone,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

import type {
  CareGap,
  ChronicProgram,
  CommunityProgram,
  DiseaseRegistry,
  OutreachCampaign,
  PatientCohort,
  PhmDashboard,
  PopulationAnalytics,
  PopulationMember,
  PreventiveCareItem,
  RiskScore,
} from '@/services/population-health/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

const tierVariant = {
  high: 'destructive',
  rising: 'default',
  moderate: 'secondary',
  low: 'outline',
} as const;
const gapPriorityVariant = {
  high: 'destructive',
  medium: 'default',
  low: 'outline',
} as const;

export function PopulationDashboard({
  dashboard,
}: {
  dashboard: PhmDashboard;
}) {
  const metrics = [
    {
      label: 'Population',
      value: dashboard.totalPopulation.toLocaleString(),
      icon: Users,
    },
    {
      label: 'Open Care Gaps',
      value: dashboard.openCareGaps.toLocaleString(),
      icon: AlertTriangle,
    },
    {
      label: 'High Risk',
      value: dashboard.highRiskCount.toLocaleString(),
      icon: HeartPulse,
    },
    {
      label: 'Rising Risk',
      value: dashboard.risingRiskCount.toLocaleString(),
      icon: TrendingUp,
    },
    {
      label: 'Registry Enrollment',
      value: `${dashboard.registryEnrollment}%`,
      icon: Activity,
    },
    {
      label: 'Preventive Compliance',
      value: `${dashboard.preventiveCompliance}%`,
      icon: Target,
    },
    {
      label: 'Readmission Rate',
      value: `${dashboard.readmissionRate}%`,
      icon: Activity,
    },
    {
      label: 'Active Outreach',
      value: dashboard.outreachActive.toLocaleString(),
      icon: Megaphone,
    },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.label}>
          <CardContent className="pt-4 flex items-center gap-3">
            <m.icon className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CareGapCard({
  gap,
  onClose,
}: {
  gap: CareGap;
  onClose?: () => void;
}) {
  return (
    <Card className={cn(gap.daysOverdue > 0 && 'border-destructive/50')}>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{gap.title}</span>
          <Badge
            variant={gapPriorityVariant[gap.priority]}
            className="capitalize"
          >
            {gap.priority}
          </Badge>
        </div>
        <p className="text-muted-foreground">{gap.patientName}</p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="capitalize">
            {gap.type.replace(/_/g, ' ')}
          </Badge>
          <Badge className="capitalize">{gap.status}</Badge>
          {gap.daysOverdue > 0 ? (
            <Badge variant="destructive">{gap.daysOverdue}d overdue</Badge>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          Due {format(new Date(gap.dueDate), 'MMM d, yyyy')}
        </p>
        {onClose && gap.status !== 'closed' ? (
          <Button size="sm" variant="outline" onClick={onClose}>
            Close gap
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function RegistryCard({ registry }: { registry: DiseaseRegistry }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{registry.name}</span>
          <Badge variant="outline" className="capitalize">
            {registry.type.replace(/_/g, ' ')}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {registry.memberCount.toLocaleString()} members · {registry.openGaps}{' '}
          gaps
        </p>
        <p className="text-xs">
          Avg risk {registry.avgRiskScore} · Compliance{' '}
          {registry.complianceRate}%
        </p>
      </CardContent>
    </Card>
  );
}

export function PhmRiskCard({ score }: { score: RiskScore }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{score.patientName}</span>
          <Badge variant={tierVariant[score.tier]} className="capitalize">
            {score.tier}
          </Badge>
        </div>
        <p className="text-muted-foreground capitalize">
          {score.scoreType.replace(/_/g, ' ')} · Score {score.score}
        </p>
        <p className="text-xs text-muted-foreground">
          {score.factors.slice(0, 3).join(' · ')}
        </p>
        <p className="text-xs">
          {format(new Date(score.calculatedAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function HighRiskPatientCard({ member }: { member: PopulationMember }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{member.patientName}</span>
          <Badge variant={tierVariant[member.riskTier]} className="capitalize">
            {member.riskTier}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {member.primaryCondition ?? 'Multiple conditions'} · Age {member.age}
        </p>
        <p className="text-xs">
          {member.openGaps} open gaps
          {member.lastVisit
            ? ` · Last visit ${format(new Date(member.lastVisit), 'MMM d, yyyy')}`
            : ''}
        </p>
      </CardContent>
    </Card>
  );
}

export function CohortBuilder({
  cohort,
  onLaunch,
}: {
  cohort: PatientCohort;
  onLaunch?: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between gap-2">
          <CardTitle className="text-sm">{cohort.name}</CardTitle>
          {cohort.dynamic ? <Badge variant="outline">Dynamic</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground">{cohort.description}</p>
        <pre className="rounded-md bg-muted p-2 text-xs whitespace-pre-wrap">
          {cohort.criteria}
        </pre>
        <p className="text-xs">
          {cohort.memberCount.toLocaleString()} members · Created{' '}
          {format(new Date(cohort.createdAt), 'MMM d, yyyy')}
        </p>
        {onLaunch ? (
          <Button size="sm" onClick={onLaunch}>
            Launch outreach
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function OutreachCampaignCard({
  campaign,
}: {
  campaign: OutreachCampaign;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{campaign.name}</span>
          <Badge className="capitalize">{campaign.status}</Badge>
        </div>
        <p className="text-muted-foreground capitalize">
          {campaign.channel} · {campaign.sentCount}/{campaign.targetCount} sent
        </p>
        <p className="text-xs">
          Response {campaign.responseRate}% ·{' '}
          {format(new Date(campaign.scheduledDate), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function ChronicProgramCard({ program }: { program: ChronicProgram }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{program.name}</span>
          <Badge variant="outline" className="capitalize">
            {program.type.replace(/_/g, ' ')}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {program.enrolledCount} enrolled · {program.activeCount} active
        </p>
        <p className="text-xs">
          Completion {program.completionRate}% · Outcome score{' '}
          {program.avgOutcomeScore}
        </p>
      </CardContent>
    </Card>
  );
}

export function PreventiveCareCard({ item }: { item: PreventiveCareItem }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{item.title}</span>
          <Badge variant="outline" className="capitalize">
            {item.category}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {item.completedCount}/{item.eligibleCount} completed
        </p>
        <p className="text-xs">Compliance {item.complianceRate}%</p>
      </CardContent>
    </Card>
  );
}

export function CommunityHealthCard({
  program,
}: {
  program: CommunityProgram;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{program.name}</span>
          <Badge variant="outline">Equity {program.healthEquityScore}%</Badge>
        </div>
        <p className="text-muted-foreground">
          {program.attendees} attendees ·{' '}
          {program.sdohFocus ?? 'General outreach'}
        </p>
        <p className="text-xs">
          {format(new Date(program.eventDate), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function RiskDistributionPanel({
  distribution,
}: {
  distribution: PhmDashboard['riskDistribution'];
}) {
  return (
    <BarChartPanel
      title="Risk Distribution"
      data={distribution.map((d) => ({ label: d.tier, value: d.count }))}
    />
  );
}

export function PopulationAnalyticsPanel({
  analytics,
}: {
  analytics: PopulationAnalytics;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Care Gaps', value: analytics.careGaps.toLocaleString() },
          {
            label: 'Disease Prevalence',
            value: `${analytics.diseasePrevalence}%`,
          },
          {
            label: 'Readmissions',
            value: analytics.readmissions.toLocaleString(),
          },
          {
            label: 'Preventive Compliance',
            value: `${analytics.preventiveCompliance}%`,
          },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <BarChartPanel title="Care Gap Trend" data={analytics.gapTrend} />
        <BarChartPanel
          title="Prevalence by Condition"
          data={analytics.prevalenceByCondition}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <BarChartPanel
          title="Geographic Trends"
          data={analytics.geographicTrend}
        />
        <BarChartPanel
          title="Provider Performance"
          data={analytics.providerPerformance}
        />
      </div>
    </div>
  );
}

export function PhmExportToolbar({
  onExport,
}: {
  onExport?: (format: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {(['csv', 'pdf', 'xlsx'] as const).map((f) => (
        <Button
          key={f}
          size="sm"
          variant="outline"
          onClick={() => onExport?.(f)}
        >
          Export {f.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
