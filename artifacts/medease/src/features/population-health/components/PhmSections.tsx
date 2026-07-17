import {
  CareGapCard,
  ChronicProgramCard,
  CohortBuilder,
  CommunityHealthCard,
  HighRiskPatientCard,
  OutreachCampaignCard,
  PhmExportToolbar,
  PhmRiskCard,
  PopulationAnalyticsPanel,
  PopulationDashboard,
  PreventiveCareCard,
  RegistryCard,
  RiskDistributionPanel,
} from '@/features/population-health/components/PhmComponents';
import {
  useCareGaps,
  useChronicPrograms,
  useCohorts,
  useCommunityHealth,
  useHighRiskPatients,
  useOutreach,
  usePhmDashboard,
  usePopulationAnalytics,
  usePreventiveCare,
  useRegistries,
  useRiskScores,
} from '@/features/population-health/hooks/use-phm';
import { usePhmMutations } from '@/features/population-health/mutations/phm.mutations';
import type { PhmFilters } from '@/services/population-health/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { HeartPulse } from 'lucide-react';

export type PhmSection =
  | 'dashboard'
  | 'care-gaps'
  | 'registries'
  | 'high-risk'
  | 'outreach'
  | 'programs'
  | 'community-health'
  | 'analytics'
  | 'quality-measures'
  | 'population-risk'
  | 'executive'
  | 'campaigns';

export function DashboardSection({ filters }: { filters?: PhmFilters }) {
  const dashboard = usePhmDashboard(filters?.facilityId);
  const gaps = useCareGaps(filters);
  const registries = useRegistries(filters);
  const { closeCareGap } = usePhmMutations();
  if (dashboard.isLoading)
    return <LoadingView label="Loading population dashboard…" />;
  if (!dashboard.data)
    return <EmptyState icon={HeartPulse} title="No population data" />;
  return (
    <div className="space-y-6">
      <PopulationDashboard dashboard={dashboard.data} />
      <RiskDistributionPanel distribution={dashboard.data.riskDistribution} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(gaps.data?.items ?? dashboard.data.recentGaps)
          .slice(0, 6)
          .map((g) => (
            <CareGapCard
              key={g.gapId}
              gap={g}
              onClose={() =>
                closeCareGap.mutate({
                  gapId: g.gapId,
                  closedBy: 'current-user',
                })
              }
            />
          ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(registries.data?.items ?? dashboard.data.topRegistries)
          .slice(0, 6)
          .map((r) => (
            <RegistryCard key={r.registryId} registry={r} />
          ))}
      </div>
    </div>
  );
}

export function CareGapsSection({ filters }: { filters?: PhmFilters }) {
  const gaps = useCareGaps(filters);
  const { closeCareGap } = usePhmMutations();
  if (gaps.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(gaps.data?.items ?? []).slice(0, 12).map((g) => (
        <CareGapCard
          key={g.gapId}
          gap={g}
          onClose={() =>
            closeCareGap.mutate({ gapId: g.gapId, closedBy: 'current-user' })
          }
        />
      ))}
    </div>
  );
}

export function RegistriesSection({ filters }: { filters?: PhmFilters }) {
  const registries = useRegistries(filters);
  if (registries.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(registries.data?.items ?? []).slice(0, 12).map((r) => (
        <RegistryCard key={r.registryId} registry={r} />
      ))}
    </div>
  );
}

export function HighRiskSection({ filters }: { filters?: PhmFilters }) {
  const patients = useHighRiskPatients(filters);
  const scores = useRiskScores({ ...filters, riskTier: 'high' });
  if (patients.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(patients.data?.items ?? []).slice(0, 9).map((p) => (
          <HighRiskPatientCard key={p.memberId} member={p} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(scores.data?.items ?? []).slice(0, 6).map((s) => (
          <PhmRiskCard key={s.scoreId} score={s} />
        ))}
      </div>
    </div>
  );
}

export function OutreachSection({ filters }: { filters?: PhmFilters }) {
  const outreach = useOutreach(filters);
  const cohorts = useCohorts(filters);
  const { launchCampaign } = usePhmMutations();
  if (outreach.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(outreach.data?.items ?? []).slice(0, 9).map((c) => (
          <OutreachCampaignCard key={c.campaignId} campaign={c} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(cohorts.data?.items ?? []).slice(0, 4).map((c) => (
          <CohortBuilder
            key={c.cohortId}
            cohort={c}
            onLaunch={() =>
              launchCampaign.mutate({
                name: `Outreach — ${c.name}`,
                channel: 'sms',
                facilityId: filters?.facilityId,
                targetCount: c.memberCount,
                scheduledDate: new Date().toISOString(),
                cohortId: c.cohortId,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

export function ProgramsSection({ filters }: { filters?: PhmFilters }) {
  const programs = useChronicPrograms(filters);
  const preventive = usePreventiveCare(filters);
  if (programs.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(programs.data?.items ?? []).slice(0, 9).map((p) => (
          <ChronicProgramCard key={p.programId} program={p} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(preventive.data?.items ?? []).slice(0, 6).map((p) => (
          <PreventiveCareCard key={p.preventiveId} item={p} />
        ))}
      </div>
    </div>
  );
}

export function CommunityHealthSection({ filters }: { filters?: PhmFilters }) {
  const community = useCommunityHealth(filters);
  if (community.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(community.data?.items ?? []).slice(0, 12).map((p) => (
        <CommunityHealthCard key={p.programId} program={p} />
      ))}
    </div>
  );
}

export function AnalyticsSection({ filters }: { filters?: PhmFilters }) {
  const analytics = usePopulationAnalytics(filters?.facilityId);
  const { exportData } = usePhmMutations();
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return <EmptyState title="No analytics data" />;
  return (
    <div className="space-y-6">
      <PopulationAnalyticsPanel analytics={analytics.data} />
      <PhmExportToolbar onExport={(f) => exportData.mutate(f)} />
    </div>
  );
}

export function QualityMeasuresSection({ filters }: { filters?: PhmFilters }) {
  const preventive = usePreventiveCare(filters);
  const registries = useRegistries(filters);
  if (preventive.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(preventive.data?.items ?? []).slice(0, 9).map((p) => (
          <PreventiveCareCard key={p.preventiveId} item={p} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(registries.data?.items ?? []).slice(0, 6).map((r) => (
          <RegistryCard key={r.registryId} registry={r} />
        ))}
      </div>
    </div>
  );
}

export function PopulationRiskSection({ filters }: { filters?: PhmFilters }) {
  const scores = useRiskScores(filters);
  const patients = useHighRiskPatients(filters);
  if (scores.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(scores.data?.items ?? []).slice(0, 12).map((s) => (
          <PhmRiskCard key={s.scoreId} score={s} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(patients.data?.items ?? []).slice(0, 6).map((p) => (
          <HighRiskPatientCard key={p.memberId} member={p} />
        ))}
      </div>
    </div>
  );
}

export function ExecutiveSection({ filters }: { filters?: PhmFilters }) {
  const dashboard = usePhmDashboard(filters?.facilityId);
  const analytics = usePopulationAnalytics(filters?.facilityId);
  if (dashboard.isLoading || analytics.isLoading) return <LoadingView />;
  if (!dashboard.data || !analytics.data)
    return <EmptyState title="No executive data" />;
  return (
    <div className="space-y-6">
      <PopulationDashboard dashboard={dashboard.data} />
      <PopulationAnalyticsPanel analytics={analytics.data} />
    </div>
  );
}

export function CampaignsSection({ filters }: { filters?: PhmFilters }) {
  const outreach = useOutreach(filters);
  const cohorts = useCohorts(filters);
  const { launchCampaign, createCohort } = usePhmMutations();
  if (outreach.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(outreach.data?.items ?? []).slice(0, 12).map((c) => (
          <OutreachCampaignCard key={c.campaignId} campaign={c} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(cohorts.data?.items ?? []).slice(0, 4).map((c) => (
          <CohortBuilder
            key={c.cohortId}
            cohort={c}
            onLaunch={() =>
              launchCampaign.mutate({
                name: `Campaign — ${c.name}`,
                channel: 'email',
                facilityId: filters?.facilityId,
                targetCount: c.memberCount,
                scheduledDate: new Date().toISOString(),
                cohortId: c.cohortId,
              })
            }
          />
        ))}
      </div>
      <button
        type="button"
        className="text-sm text-primary underline"
        onClick={() =>
          createCohort.mutate({
            name: 'High-risk diabetes cohort',
            description:
              'Patients with uncontrolled diabetes and missed follow-ups',
            criteria:
              'Age > 60\nAND\nDiabetes\nAND\nHbA1c > 8\nAND\nNo appointment in 6 months',
            facilityId: filters?.facilityId,
            dynamic: true,
          })
        }
      >
        Create sample cohort
      </button>
    </div>
  );
}

export function PhmSectionContent({
  section,
  filters,
}: {
  section: PhmSection;
  filters?: PhmFilters;
}) {
  switch (section) {
    case 'care-gaps':
      return <CareGapsSection filters={filters} />;
    case 'registries':
      return <RegistriesSection filters={filters} />;
    case 'high-risk':
      return <HighRiskSection filters={filters} />;
    case 'outreach':
      return <OutreachSection filters={filters} />;
    case 'programs':
      return <ProgramsSection filters={filters} />;
    case 'community-health':
      return <CommunityHealthSection filters={filters} />;
    case 'analytics':
      return <AnalyticsSection filters={filters} />;
    case 'quality-measures':
      return <QualityMeasuresSection filters={filters} />;
    case 'population-risk':
      return <PopulationRiskSection filters={filters} />;
    case 'executive':
      return <ExecutiveSection filters={filters} />;
    case 'campaigns':
      return <CampaignsSection filters={filters} />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
