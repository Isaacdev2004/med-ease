import {
  AdverseEventCard,
  AnalyticsPanel,
  BiospecimenCard,
  ConsentCard,
  ExportToolbar,
  GrantCard,
  InnovationCard,
  InvestigatorCard,
  ParticipantCard,
  ProtocolCard,
  PublicationCard,
  RecruitmentPanel,
  RegulatoryCard,
  ResearchAuditCard,
  ResearchSiteCard,
  SafetyBoard,
  StudyDashboard,
  TrialCard,
  VisitTimeline,
} from '@/features/research/components/ResearchComponents';
import {
  useAdverseEvents,
  useBiospecimens,
  useClinicalTrials,
  useConsent,
  useInnovationProjects,
  useInvestigators,
  useParticipants,
  useProtocolCompliance,
  usePublications,
  useResearchAnalytics,
  useResearchAudit,
  useResearchDashboard,
  useSafetyBoard,
  useStudySites,
  useStudyVisits,
} from '@/features/research/hooks/use-research';
import { useResearchMutations } from '@/features/research/mutations/research.mutations';
import type { ResearchFilters } from '@/services/research/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { FlaskConical } from 'lucide-react';

export type ResearchSection =
  | 'dashboard'
  | 'trials'
  | 'participants'
  | 'visits'
  | 'adverse-events'
  | 'biospecimens'
  | 'sites'
  | 'recruitment'
  | 'facility-dashboard'
  | 'innovation'
  | 'hub'
  | 'trials-admin'
  | 'regulatory'
  | 'publications'
  | 'grants'
  | 'analytics'
  | 'protocols'
  | 'audit';

export function DashboardSection({ filters }: { filters?: ResearchFilters }) {
  const dashboard = useResearchDashboard(filters?.facilityId);
  const trials = useClinicalTrials(filters);
  const { exportData } = useResearchMutations();
  if (dashboard.isLoading)
    return <LoadingView label="Loading research dashboard…" />;
  if (!dashboard.data)
    return <EmptyState icon={FlaskConical} title="No research data" />;
  return (
    <div className="space-y-6">
      <StudyDashboard dashboard={dashboard.data} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(trials.data?.items ?? dashboard.data.topTrials)
          .slice(0, 6)
          .map((t) => (
            <TrialCard key={t.trialId} trial={t} />
          ))}
      </div>
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function TrialsSection({ filters }: { filters?: ResearchFilters }) {
  const trials = useClinicalTrials(filters);
  if (trials.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(trials.data?.items ?? []).map((t) => (
        <TrialCard key={t.trialId} trial={t} />
      ))}
    </div>
  );
}

export function ParticipantsSection({
  filters,
}: {
  filters?: ResearchFilters;
}) {
  const participants = useParticipants(filters);
  const consents = useConsent(filters);
  if (participants.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(participants.data?.items ?? []).slice(0, 12).map((p) => (
          <ParticipantCard key={p.participantId} participant={p} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(consents.data?.items ?? []).slice(0, 6).map((c) => (
          <ConsentCard key={c.consentId} consent={c} />
        ))}
      </div>
    </div>
  );
}

export function VisitsSection({ filters }: { filters?: ResearchFilters }) {
  const visits = useStudyVisits(filters);
  if (visits.isLoading) return <LoadingView />;
  return <VisitTimeline visits={visits.data?.items ?? []} />;
}

export function AdverseEventsSection({
  filters,
}: {
  filters?: ResearchFilters;
}) {
  const events = useAdverseEvents(filters);
  const safety = useSafetyBoard(filters);
  if (events.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <SafetyBoard events={safety.data?.items ?? []} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(events.data?.items ?? []).slice(0, 12).map((e) => (
          <AdverseEventCard key={e.eventId} event={e} />
        ))}
      </div>
    </div>
  );
}

export function BiospecimensSection({
  filters,
}: {
  filters?: ResearchFilters;
}) {
  const specimens = useBiospecimens(filters);
  if (specimens.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(specimens.data?.items ?? []).slice(0, 12).map((s) => (
        <BiospecimenCard key={s.specimenId} specimen={s} />
      ))}
    </div>
  );
}

export function SitesSection({ filters }: { filters?: ResearchFilters }) {
  const sites = useStudySites(filters);
  const investigators = useInvestigators(filters);
  if (sites.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(sites.data?.items ?? []).map((s) => (
          <ResearchSiteCard key={s.siteId} site={s} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(investigators.data?.items ?? []).slice(0, 6).map((i) => (
          <InvestigatorCard key={i.investigatorId} investigator={i} />
        ))}
      </div>
    </div>
  );
}

export function RecruitmentSection({ filters }: { filters?: ResearchFilters }) {
  const trials = useClinicalTrials({ ...filters, status: 'recruiting' });
  if (trials.isLoading) return <LoadingView />;
  return <RecruitmentPanel trials={trials.data?.items ?? []} />;
}

export function InnovationSection({ filters }: { filters?: ResearchFilters }) {
  const projects = useInnovationProjects(filters);
  if (projects.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(projects.data?.items ?? []).map((p) => (
        <InnovationCard key={p.projectId} project={p} />
      ))}
    </div>
  );
}

export function RegulatorySection({ filters }: { filters?: ResearchFilters }) {
  const regulatory = useProtocolCompliance(filters);
  if (regulatory.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(regulatory.data?.regulatory?.items ?? []).map((r) => (
        <RegulatoryCard key={r.submissionId} submission={r} />
      ))}
    </div>
  );
}

export function PublicationsSection({
  filters,
}: {
  filters?: ResearchFilters;
}) {
  const pubs = usePublications(filters);
  if (pubs.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(pubs.data?.items ?? []).map((p) => (
        <PublicationCard key={p.publicationId} publication={p} />
      ))}
    </div>
  );
}

export function GrantsSection({ filters }: { filters?: ResearchFilters }) {
  const grants = useProtocolCompliance(filters);
  if (grants.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(grants.data?.grants?.items ?? []).map((g) => (
        <GrantCard key={g.grantId} grant={g} />
      ))}
    </div>
  );
}

export function ProtocolsSection({ filters }: { filters?: ResearchFilters }) {
  const protocol = useProtocolCompliance(filters);
  if (protocol.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(protocol.data?.deviations?.items ?? []).slice(0, 12).map((d) => (
        <ProtocolCard key={d.deviationId} deviation={d} />
      ))}
    </div>
  );
}

export function AnalyticsSection({ filters }: { filters?: ResearchFilters }) {
  const analytics = useResearchAnalytics(filters?.facilityId);
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return <EmptyState title="No analytics data" />;
  return <AnalyticsPanel analytics={analytics.data} />;
}

export function AuditSection({ filters }: { filters?: ResearchFilters }) {
  const audit = useResearchAudit(filters);
  if (audit.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(audit.data?.items ?? []).slice(0, 12).map((log) => (
        <ResearchAuditCard key={log.auditId} log={log} />
      ))}
    </div>
  );
}

export function ResearchSectionContent({
  section,
  filters,
}: {
  section: ResearchSection;
  filters?: ResearchFilters;
  variant?: 'professional' | 'facility' | 'admin';
}) {
  switch (section) {
    case 'trials':
    case 'trials-admin':
      return <TrialsSection filters={filters} />;
    case 'participants':
      return <ParticipantsSection filters={filters} />;
    case 'visits':
      return <VisitsSection filters={filters} />;
    case 'adverse-events':
      return <AdverseEventsSection filters={filters} />;
    case 'biospecimens':
      return <BiospecimensSection filters={filters} />;
    case 'sites':
      return <SitesSection filters={filters} />;
    case 'recruitment':
      return <RecruitmentSection filters={filters} />;
    case 'facility-dashboard':
    case 'hub':
      return <DashboardSection filters={filters} />;
    case 'innovation':
      return <InnovationSection filters={filters} />;
    case 'regulatory':
      return <RegulatorySection filters={filters} />;
    case 'publications':
      return <PublicationsSection filters={filters} />;
    case 'grants':
      return <GrantsSection filters={filters} />;
    case 'protocols':
      return <ProtocolsSection filters={filters} />;
    case 'analytics':
      return <AnalyticsSection filters={filters} />;
    case 'audit':
      return <AuditSection filters={filters} />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
