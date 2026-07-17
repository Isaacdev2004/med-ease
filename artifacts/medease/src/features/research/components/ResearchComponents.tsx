import { format } from 'date-fns';
import {
  AlertTriangle,
  Calendar,
  FileText,
  FlaskConical,
  Microscope,
  Shield,
  Users,
} from 'lucide-react';

import type {
  AdverseEvent,
  Biospecimen,
  ClinicalTrial,
  ConsentRecord,
  GrantApplication,
  InnovationProject,
  Investigator,
  ProtocolDeviation,
  Publication,
  RegulatorySubmission,
  ResearchAnalytics,
  ResearchDashboard,
  ResearchParticipant,
  StudyVisit,
} from '@/services/research/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const trialVariant = {
  planning: 'outline',
  recruiting: 'secondary',
  active: 'default',
  completed: 'default',
  suspended: 'destructive',
  terminated: 'destructive',
} as const;
const severityVariant = {
  mild: 'outline',
  moderate: 'secondary',
  severe: 'destructive',
  life_threatening: 'destructive',
  fatal: 'destructive',
} as const;

export function StudyDashboard({
  dashboard,
}: {
  dashboard: ResearchDashboard;
}) {
  const metrics = [
    {
      label: 'Active Trials',
      value: dashboard.activeTrials,
      icon: FlaskConical,
    },
    {
      label: 'Total Participants',
      value: dashboard.totalParticipants.toLocaleString(),
      icon: Users,
    },
    {
      label: 'Enrolled This Month',
      value: dashboard.enrolledThisMonth,
      icon: Calendar,
    },
    {
      label: 'Open Deviations',
      value: dashboard.openDeviations,
      icon: AlertTriangle,
    },
    {
      label: 'Pending Consents',
      value: dashboard.pendingConsents,
      icon: FileText,
    },
    {
      label: 'Serious AEs',
      value: dashboard.seriousAdverseEvents,
      icon: Shield,
    },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      <EnrollmentChart data={dashboard.enrollmentTrend} />
    </div>
  );
}

export function TrialCard({ trial }: { trial: ClinicalTrial }) {
  const rate =
    trial.targetEnrollment > 0
      ? Math.round((trial.currentEnrollment / trial.targetEnrollment) * 100)
      : 0;
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium line-clamp-2">{trial.title}</span>
          <Badge
            variant={trialVariant[trial.status]}
            className="capitalize shrink-0"
          >
            {trial.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">Phase {trial.phase}</Badge>
          {trial.nctId && <Badge variant="outline">{trial.nctId}</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">
          {trial.sponsor} · {trial.therapeuticArea}
        </p>
        <p className="text-xs">
          {trial.currentEnrollment}/{trial.targetEnrollment} enrolled ({rate}%)
        </p>
      </CardContent>
    </Card>
  );
}

export function ParticipantCard({
  participant,
}: {
  participant: ResearchParticipant;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{participant.participantId}</span>
          <Badge className="capitalize">
            {participant.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Patient: {participant.patientId}
        </p>
        <p className="text-xs">Trial: {participant.trialId}</p>
        <Badge
          variant={
            participant.consentStatus === 'signed' ? 'default' : 'outline'
          }
          className="capitalize"
        >
          {participant.consentStatus}
        </Badge>
      </CardContent>
    </Card>
  );
}

export function VisitTimeline({ visits }: { visits: StudyVisit[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Study Visits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {visits.slice(0, 8).map((v) => (
          <div
            key={v.visitId}
            className="flex items-center justify-between gap-2 text-sm border-b pb-2 last:border-0"
          >
            <div>
              <p className="font-medium">{v.visitName}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(v.scheduledAt), 'MMM d, yyyy')}
              </p>
            </div>
            <Badge className="capitalize">{v.status.replace('_', ' ')}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ConsentCard({ consent }: { consent: ConsentRecord }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{consent.consentId}</span>
          <Badge className="capitalize">{consent.status}</Badge>
        </div>
        <p className="text-xs">
          Version {consent.version} · {consent.method}
        </p>
        {consent.signedAt && (
          <p className="text-xs text-muted-foreground">
            Signed {format(new Date(consent.signedAt), 'MMM d, yyyy')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function InvestigatorCard({
  investigator,
}: {
  investigator: Investigator;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <p className="font-medium">{investigator.name}</p>
        <p className="text-xs text-muted-foreground">
          {investigator.specialty}
        </p>
        <p className="text-xs">{investigator.activeTrials} active trials</p>
      </CardContent>
    </Card>
  );
}

export function ProtocolCard({ deviation }: { deviation: ProtocolDeviation }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <Badge
            variant={
              deviation.severity === 'critical' ? 'destructive' : 'outline'
            }
            className="capitalize"
          >
            {deviation.severity}
          </Badge>
          <Badge className="capitalize">
            {deviation.status.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-xs">{deviation.description}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(deviation.reportedAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function AdverseEventCard({ event }: { event: AdverseEvent }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium line-clamp-1">{event.description}</span>
          {event.serious && <Badge variant="destructive">SAE</Badge>}
        </div>
        <Badge variant={severityVariant[event.severity]} className="capitalize">
          {event.severity.replace('_', ' ')}
        </Badge>
        <p className="text-xs text-muted-foreground">
          {format(new Date(event.reportedAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function SafetyBoard({ events }: { events: AdverseEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-5 w-5" /> DSMB Safety Review
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground col-span-full">
            No events pending DSMB review.
          </p>
        ) : (
          events.map((e) => <AdverseEventCard key={e.eventId} event={e} />)
        )}
      </CardContent>
    </Card>
  );
}

export function BiospecimenCard({ specimen }: { specimen: Biospecimen }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium capitalize">{specimen.type}</span>
          <Badge className="capitalize">{specimen.status}</Badge>
        </div>
        <p className="text-xs">{specimen.specimenId}</p>
        <p className="text-xs text-muted-foreground">
          {specimen.storageLocation}
        </p>
      </CardContent>
    </Card>
  );
}

export function PublicationCard({ publication }: { publication: Publication }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <p className="font-medium line-clamp-2">{publication.title}</p>
        <div className="flex gap-2">
          <Badge className="capitalize">
            {publication.status.replace('_', ' ')}
          </Badge>
          {publication.journal && (
            <Badge variant="outline">{publication.journal}</Badge>
          )}
        </div>
        {publication.doi && (
          <p className="text-xs text-muted-foreground">
            DOI: {publication.doi}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function GrantCard({ grant }: { grant: GrantApplication }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <p className="font-medium line-clamp-2">{grant.title}</p>
        <p className="text-xs text-muted-foreground">{grant.funder}</p>
        <div className="flex justify-between">
          <Badge className="capitalize">{grant.status}</Badge>
          <span className="text-xs font-medium">
            ${grant.amount.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function InnovationCard({ project }: { project: InnovationProject }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <p className="font-medium">{project.name}</p>
        <Badge variant="outline">{project.category}</Badge>
        <div className="flex justify-between text-xs">
          <Badge className="capitalize">{project.status}</Badge>
          <span>${project.budget.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function RegulatoryCard({
  submission,
}: {
  submission: RegulatorySubmission;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <Badge variant="outline">{submission.type}</Badge>
          <Badge className="capitalize">{submission.status}</Badge>
        </div>
        <p className="text-xs">Trial: {submission.trialId}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(submission.submittedAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function ResearchAuditCard({
  log,
}: {
  log: {
    auditId: string;
    action: string;
    resourceType: string;
    timestamp: string;
    outcome: string;
  };
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-1">
        <p className="font-medium capitalize">
          {log.action.replace(/_/g, ' ')}
        </p>
        <p className="text-xs text-muted-foreground">
          {log.resourceType} ·{' '}
          {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
        </p>
        <Badge variant={log.outcome === 'success' ? 'default' : 'destructive'}>
          {log.outcome}
        </Badge>
      </CardContent>
    </Card>
  );
}

export function AnalyticsPanel({
  analytics,
}: {
  analytics: ResearchAnalytics;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Enrollment Rate', value: `${analytics.enrollmentRate}%` },
          {
            label: 'Protocol Compliance',
            value: `${analytics.protocolCompliance}%`,
          },
          {
            label: 'Consent Completion',
            value: `${analytics.consentCompletionRate}%`,
          },
          { label: 'SAE Rate', value: `${analytics.saeRate}%` },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <BarChartPanel
          title="Enrollment Trend"
          data={analytics.enrollmentTrend}
        />
        <BarChartPanel
          title="Phase Distribution"
          data={analytics.phaseDistribution}
        />
      </div>
    </div>
  );
}

export function EnrollmentChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  return <BarChartPanel title="Enrollment Trend" data={data} />;
}

export function ExportToolbar({
  onExport,
}: {
  onExport?: (format: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(['csv', 'pdf', 'xlsx'] as const).map((fmt) => (
        <Button
          key={fmt}
          variant="outline"
          size="sm"
          onClick={() => onExport?.(fmt)}
        >
          Export {fmt.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}

export function ResearchSiteCard({
  site,
}: {
  site: {
    siteId: string;
    name: string;
    currentEnrollment: number;
    enrollmentTarget: number;
    status: string;
  };
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{site.name}</span>
          <Badge className="capitalize">{site.status}</Badge>
        </div>
        <p className="text-xs">
          {site.currentEnrollment}/{site.enrollmentTarget} enrolled
        </p>
      </CardContent>
    </Card>
  );
}

export function RecruitmentPanel({ trials }: { trials: ClinicalTrial[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Microscope className="h-5 w-5" /> Active Recruitment
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trials
          .filter((t) => t.status === 'recruiting')
          .slice(0, 6)
          .map((t) => (
            <TrialCard key={t.trialId} trial={t} />
          ))}
      </CardContent>
    </Card>
  );
}
