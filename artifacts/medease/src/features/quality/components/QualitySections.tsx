import {
  AccreditationCard,
  AnalyticsPanel,
  AuditCard,
  CAPACard,
  ComplianceScoreCard,
  DocumentViewer,
  ExecutiveDashboard,
  ExportToolbar,
  FishbonePanel,
  FiveWhysPanel,
  HeatMap,
  IncidentCard,
  InfectionDashboard,
  PolicyCard,
  QualityMetrics,
  RiskCard,
  RootCauseTimeline,
} from '@/features/quality/components/QualityComponents';
import {
  useAccreditation,
  useAudits,
  useCapa,
  useCompliance,
  useIncidents,
  useInfectionControl,
  usePolicies,
  useQualityAnalytics,
  useQualityDashboard,
  useQualityIndicators,
  useRisks,
} from '@/features/quality/hooks/use-quality';
import { useQualityMutations } from '@/features/quality/mutations/quality.mutations';
import { qualityService } from '@/services/quality/quality.service';
import type { QualityFilters } from '@/services/quality/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export type QualitySection =
  | 'dashboard'
  | 'incidents'
  | 'policies'
  | 'infection'
  | 'audits'
  | 'compliance'
  | 'risks'
  | 'capa'
  | 'accreditation'
  | 'documents'
  | 'regulatory'
  | 'analytics';

export function DashboardSection({ filters }: { filters?: QualityFilters }) {
  const dashboard = useQualityDashboard(filters?.facilityId);
  const incidents = useIncidents(filters);
  const { escalateIncident } = useQualityMutations();
  if (dashboard.isLoading)
    return <LoadingView label="Loading quality dashboard…" />;
  if (!dashboard.data)
    return <EmptyState icon={Shield} title="No quality data" />;
  return (
    <div className="space-y-6">
      <ExecutiveDashboard dashboard={dashboard.data} />
      <HeatMap data={dashboard.data.riskHeatMap} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(incidents.data?.items ?? dashboard.data.recentIncidents)
          .slice(0, 6)
          .map((i) => (
            <IncidentCard
              key={i.incidentId}
              incident={i}
              onEscalate={() => escalateIncident.mutate(i.incidentId)}
            />
          ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboard.data.recentCapa.map((c) => (
          <CAPACard key={c.capaId} capa={c} />
        ))}
      </div>
    </div>
  );
}

export function IncidentsSection({ filters }: { filters?: QualityFilters }) {
  const incidents = useIncidents(filters);
  const { escalateIncident } = useQualityMutations();
  if (incidents.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(incidents.data?.items ?? []).slice(0, 12).map((i) => (
        <IncidentCard
          key={i.incidentId}
          incident={i}
          onEscalate={() => escalateIncident.mutate(i.incidentId)}
        />
      ))}
    </div>
  );
}

export function PoliciesSection({ filters }: { filters?: QualityFilters }) {
  const policies = usePolicies(filters);
  const { archivePolicy } = useQualityMutations();
  if (policies.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(policies.data?.items ?? []).slice(0, 9).map((p) => (
          <PolicyCard
            key={p.policyId}
            policy={p}
            onArchive={() => archivePolicy.mutate(p.policyId)}
          />
        ))}
      </div>
      {(policies.data?.items ?? []).slice(0, 2).map((p) => (
        <DocumentViewer key={`doc-${p.policyId}`} policy={p} />
      ))}
    </div>
  );
}

export function InfectionSection({ filters }: { filters?: QualityFilters }) {
  const infection = useInfectionControl(filters);
  if (infection.isLoading) return <LoadingView />;
  if (!infection.data) return <EmptyState title="No infection data" />;
  return (
    <InfectionDashboard
      records={infection.data.records.items}
      outbreaks={infection.data.outbreaks}
    />
  );
}

export function AuditsSection({ filters }: { filters?: QualityFilters }) {
  const audits = useAudits(filters);
  if (audits.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(audits.data?.items ?? []).slice(0, 12).map((a) => (
        <AuditCard key={a.auditId} audit={a} />
      ))}
    </div>
  );
}

export function ComplianceSection({ filters }: { filters?: QualityFilters }) {
  const compliance = useCompliance(filters);
  if (compliance.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(compliance.data?.items ?? []).slice(0, 9).map((c) => (
        <ComplianceScoreCard key={c.complianceId} record={c} />
      ))}
    </div>
  );
}

export function RisksSection({ filters }: { filters?: QualityFilters }) {
  const risks = useRisks(filters);
  if (risks.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(risks.data?.items ?? []).slice(0, 12).map((r) => (
        <RiskCard key={r.riskId} risk={r} />
      ))}
    </div>
  );
}

export function CapaSection({ filters }: { filters?: QualityFilters }) {
  const capa = useCapa(filters);
  const rca = useQuery({
    queryKey: ['quality', 'rca'],
    queryFn: () => qualityService.getRootCauseAnalyses(),
  });
  const { closeCapa } = useQualityMutations();
  if (capa.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(capa.data?.items ?? []).slice(0, 9).map((c) => (
          <CAPACard
            key={c.capaId}
            capa={c}
            onClose={() =>
              closeCapa.mutate({ capaId: c.capaId, effectivenessScore: 92 })
            }
          />
        ))}
      </div>
      <FishbonePanel rca={rca.data?.[0]} />
      <FiveWhysPanel rca={rca.data?.[1]} />
      <RootCauseTimeline analyses={rca.data ?? []} />
    </div>
  );
}

export function AccreditationSection() {
  const accreditation = useAccreditation();
  const gaps = useQuery({
    queryKey: ['quality', 'accreditation-gaps'],
    queryFn: () => qualityService.accreditationGaps(),
  });
  if (accreditation.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(accreditation.data ?? []).slice(0, 12).map((s) => (
          <AccreditationCard key={s.standardId} standard={s} />
        ))}
      </div>
      {gaps.data?.length ? (
        <p className="text-sm text-muted-foreground">
          {gaps.data.length} standards with identified gaps
        </p>
      ) : null}
    </div>
  );
}

export function DocumentsSection({ filters }: { filters?: QualityFilters }) {
  return <PoliciesSection filters={filters} />;
}

export function RegulatorySection({ filters }: { filters?: QualityFilters }) {
  return <ComplianceSection filters={filters} />;
}

export function AnalyticsSection({ filters }: { filters?: QualityFilters }) {
  const analytics = useQualityAnalytics(filters?.facilityId);
  const indicators = useQualityIndicators(filters);
  const { exportData } = useQualityMutations();
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return <EmptyState title="No analytics" />;
  return (
    <div className="space-y-6">
      <AnalyticsPanel analytics={analytics.data} />
      <QualityMetrics indicators={indicators.data?.items ?? []} />
      <ExportToolbar onExport={(f) => exportData.mutate(f)} />
    </div>
  );
}

export function QualitySectionContent({
  section,
  filters,
}: {
  section: QualitySection;
  filters?: QualityFilters;
}) {
  switch (section) {
    case 'incidents':
      return <IncidentsSection filters={filters} />;
    case 'policies':
      return <PoliciesSection filters={filters} />;
    case 'infection':
      return <InfectionSection filters={filters} />;
    case 'audits':
      return <AuditsSection filters={filters} />;
    case 'compliance':
      return <ComplianceSection filters={filters} />;
    case 'risks':
      return <RisksSection filters={filters} />;
    case 'capa':
      return <CapaSection filters={filters} />;
    case 'accreditation':
      return <AccreditationSection />;
    case 'documents':
      return <DocumentsSection filters={filters} />;
    case 'regulatory':
      return <RegulatorySection filters={filters} />;
    case 'analytics':
      return <AnalyticsSection filters={filters} />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
