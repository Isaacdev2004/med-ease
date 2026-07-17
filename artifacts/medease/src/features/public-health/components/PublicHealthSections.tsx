import {
  AnalyticsPanel,
  ChildHealthCard,
  CommunityProgramCard,
  ContactTracingBoard,
  DiseaseCaseCard,
  EnvironmentalInspectionCard,
  EpidemiologyDashboard,
  ExportToolbar,
  ImmunizationCard,
  MaternalHealthCard,
  OccupationalHealthCard,
  OutbreakCard,
  PublicHealthSafetyPanel,
  RegistryCard,
  SDOHCard,
  SchoolHealthCard,
} from '@/features/public-health/components/PublicHealthComponents';
import {
  useCommunityPrograms,
  useContactTracing,
  useDiseaseCases,
  useEnvironmentalHealth,
  useImmunizations,
  useMaternalHealth,
  useOccupationalHealth,
  useOutbreaks,
  usePublicHealthAnalytics,
  usePublicHealthDashboard,
  useRegistries,
  useSchoolHealth,
  useSdohAssessments,
  useChildHealth,
} from '@/features/public-health/hooks/use-public-health';
import { usePublicHealthMutations } from '@/features/public-health/mutations/public-health.mutations';
import type { PublicHealthFilters } from '@/services/public-health/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Shield } from 'lucide-react';

export type PublicHealthSection =
  | 'dashboard'
  | 'surveillance'
  | 'immunizations'
  | 'community-programs'
  | 'sdoh'
  | 'outbreaks'
  | 'contact-tracing'
  | 'environmental'
  | 'outreach'
  | 'hub'
  | 'epidemiology'
  | 'immunization-registry'
  | 'maternal-child'
  | 'school-health'
  | 'occupational'
  | 'analytics'
  | 'community-dashboard';

export function DashboardSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const dashboard = usePublicHealthDashboard(filters?.facilityId);
  const cases = useDiseaseCases(filters);
  const outbreaks = useOutbreaks(filters);
  const { exportData } = usePublicHealthMutations();
  if (dashboard.isLoading)
    return <LoadingView label="Loading public health dashboard…" />;
  if (!dashboard.data)
    return <EmptyState icon={Shield} title="No public health data" />;
  return (
    <div className="space-y-6">
      <EpidemiologyDashboard dashboard={dashboard.data} />
      <PublicHealthSafetyPanel
        outbreaks={outbreaks.data?.items ?? dashboard.data.recentOutbreaks}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(cases.data?.items ?? []).slice(0, 6).map((c) => (
          <DiseaseCaseCard key={c.caseId} caseRecord={c} />
        ))}
      </div>
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function SurveillanceSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const cases = useDiseaseCases(filters);
  const outbreaks = useOutbreaks(filters);
  if (cases.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(outbreaks.data?.items ?? []).slice(0, 4).map((o) => (
          <OutbreakCard key={o.outbreakId} outbreak={o} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(cases.data?.items ?? []).slice(0, 12).map((c) => (
          <DiseaseCaseCard key={c.caseId} caseRecord={c} />
        ))}
      </div>
    </div>
  );
}

export function ImmunizationsSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const immunizations = useImmunizations(filters);
  if (immunizations.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(immunizations.data?.items ?? []).slice(0, 12).map((r) => (
        <ImmunizationCard key={r.immunizationId} record={r} />
      ))}
    </div>
  );
}

export function CommunityProgramsSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const programs = useCommunityPrograms(filters);
  if (programs.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(programs.data?.items ?? []).map((p) => (
        <CommunityProgramCard key={p.programId} program={p} />
      ))}
    </div>
  );
}

export function SdohSection({ filters }: { filters?: PublicHealthFilters }) {
  const sdoh = useSdohAssessments(filters);
  if (sdoh.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(sdoh.data?.items ?? []).slice(0, 12).map((a) => (
        <SDOHCard key={a.assessmentId} assessment={a} />
      ))}
    </div>
  );
}

export function OutbreaksSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const outbreaks = useOutbreaks(filters);
  const contacts = useContactTracing(filters);
  if (outbreaks.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(outbreaks.data?.items ?? []).map((o) => (
          <OutbreakCard key={o.outbreakId} outbreak={o} />
        ))}
      </div>
      <ContactTracingBoard contacts={contacts.data?.items ?? []} />
    </div>
  );
}

export function ContactTracingSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const contacts = useContactTracing(filters);
  if (contacts.isLoading) return <LoadingView />;
  return <ContactTracingBoard contacts={contacts.data?.items ?? []} />;
}

export function EnvironmentalSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const inspections = useEnvironmentalHealth(filters);
  if (inspections.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(inspections.data?.items ?? []).map((i) => (
        <EnvironmentalInspectionCard key={i.inspectionId} inspection={i} />
      ))}
    </div>
  );
}

export function OutreachSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  return <CommunityProgramsSection filters={filters} />;
}

export function ImmunizationRegistrySection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const registries = useRegistries(filters);
  const immunizations = useImmunizations(filters);
  if (registries.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(registries.data?.items ?? []).map((r) => (
          <RegistryCard key={r.registryId} registry={r} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(immunizations.data?.items ?? []).slice(0, 6).map((r) => (
          <ImmunizationCard key={r.immunizationId} record={r} />
        ))}
      </div>
    </div>
  );
}

export function MaternalChildSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const maternal = useMaternalHealth(filters);
  const child = useChildHealth(filters);
  if (maternal.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(maternal.data?.items ?? []).map((m) => (
          <MaternalHealthCard key={m.recordId} record={m} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(child.data?.items ?? []).slice(0, 6).map((c) => (
          <ChildHealthCard key={c.recordId} record={c} />
        ))}
      </div>
    </div>
  );
}

export function SchoolHealthSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const school = useSchoolHealth(filters);
  if (school.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(school.data?.items ?? []).map((s) => (
        <SchoolHealthCard key={s.screeningId} screening={s} />
      ))}
    </div>
  );
}

export function OccupationalSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const occupational = useOccupationalHealth(filters);
  if (occupational.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(occupational.data?.items ?? []).map((a) => (
        <OccupationalHealthCard key={a.assessmentId} assessment={a} />
      ))}
    </div>
  );
}

export function AnalyticsSection({
  filters,
}: {
  filters?: PublicHealthFilters;
}) {
  const analytics = usePublicHealthAnalytics(filters?.facilityId);
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return <EmptyState title="No analytics data" />;
  return <AnalyticsPanel analytics={analytics.data} />;
}

export function PublicHealthSectionContent({
  section,
  filters,
}: {
  section: PublicHealthSection;
  filters?: PublicHealthFilters;
}) {
  switch (section) {
    case 'surveillance':
    case 'epidemiology':
      return <SurveillanceSection filters={filters} />;
    case 'immunizations':
    case 'immunization-registry':
      return section === 'immunization-registry' ? (
        <ImmunizationRegistrySection filters={filters} />
      ) : (
        <ImmunizationsSection filters={filters} />
      );
    case 'community-programs':
    case 'outreach':
    case 'community-dashboard':
      return section === 'outreach' ? (
        <OutreachSection filters={filters} />
      ) : (
        <CommunityProgramsSection filters={filters} />
      );
    case 'sdoh':
      return <SdohSection filters={filters} />;
    case 'outbreaks':
      return <OutbreaksSection filters={filters} />;
    case 'contact-tracing':
      return <ContactTracingSection filters={filters} />;
    case 'environmental':
      return <EnvironmentalSection filters={filters} />;
    case 'maternal-child':
      return <MaternalChildSection filters={filters} />;
    case 'school-health':
      return <SchoolHealthSection filters={filters} />;
    case 'occupational':
      return <OccupationalSection filters={filters} />;
    case 'analytics':
      return <AnalyticsSection filters={filters} />;
    case 'hub':
      return <DashboardSection filters={filters} />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
