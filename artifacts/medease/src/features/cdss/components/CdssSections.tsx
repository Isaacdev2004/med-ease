import {
  AllergyBanner,
  AuditTimeline,
  CDSDashboard,
  CdssAnalyticsPanel,
  CdssExportToolbar,
  ClinicalAlertCard,
  ClinicalPathwayCard,
  ClinicalProtocolCard,
  ClinicalRuleCard,
  ContraindicationBanner,
  DecisionTreeViewer,
  DiagnosticSuggestionCard,
  DrugInteractionBanner,
  DuplicateTherapyBanner,
  EvidenceCard,
  GuidelineCard,
  GuidelineViewer,
  OrderSetCard,
  OverrideDialogHint,
  PreventiveReminderCard,
  RecommendationCard,
  RiskCalculatorCard,
  CalculatorPanel,
} from '@/features/cdss/components/CdssComponents';
import {
  useCdssAnalytics,
  useCdssDashboard,
  useClinicalAlerts,
  useClinicalPathways,
  useDecisionTrees,
  useDrugSafety,
  useEvidenceArticles,
  useGuidelines,
  useOrderSets,
  usePreventiveCare,
  useProtocols,
  useRecommendations,
  useRiskCalculators,
  useRules,
  useAudit,
  useDiagnosticSupport,
} from '@/features/cdss/hooks/use-cdss';
import { useCdssMutations } from '@/features/cdss/mutations/cdss.mutations';
import type { CalculatorResult, CdssFilters } from '@/services/cdss/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Brain } from 'lucide-react';
import { useState } from 'react';

export type CdssSection =
  | 'dashboard'
  | 'alerts'
  | 'recommendations'
  | 'guidelines'
  | 'diagnostics'
  | 'drug-safety'
  | 'preventive'
  | 'order-sets'
  | 'calculators'
  | 'analytics'
  | 'compliance'
  | 'protocols'
  | 'rules'
  | 'knowledge'
  | 'audit';

export function DashboardSection({ filters }: { filters?: CdssFilters }) {
  const dashboard = useCdssDashboard(filters?.facilityId);
  const alerts = useClinicalAlerts(filters);
  const recs = useRecommendations(filters);
  const { acknowledgeAlert, applyRecommendation } = useCdssMutations();
  if (dashboard.isLoading)
    return <LoadingView label="Loading CDSS dashboard…" />;
  if (!dashboard.data) return <EmptyState icon={Brain} title="No CDSS data" />;
  return (
    <div className="space-y-6">
      <CDSDashboard dashboard={dashboard.data} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(alerts.data?.items ?? dashboard.data.recentAlerts)
          .slice(0, 6)
          .map((a) => (
            <ClinicalAlertCard
              key={a.alertId}
              alert={a}
              onAcknowledge={() =>
                acknowledgeAlert.mutate({
                  alertId: a.alertId,
                  providerId: 'current-user',
                })
              }
            />
          ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(recs.data?.items ?? dashboard.data.recentRecommendations)
          .slice(0, 6)
          .map((r) => (
            <RecommendationCard
              key={r.recommendationId}
              recommendation={r}
              onApply={() =>
                applyRecommendation.mutate({
                  recommendationId: r.recommendationId,
                  providerId: 'current-user',
                })
              }
            />
          ))}
      </div>
    </div>
  );
}

export function AlertsSection({ filters }: { filters?: CdssFilters }) {
  const alerts = useClinicalAlerts(filters);
  const { acknowledgeAlert, overrideAlert } = useCdssMutations();
  if (alerts.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(alerts.data?.items ?? []).slice(0, 12).map((a) => (
          <ClinicalAlertCard
            key={a.alertId}
            alert={a}
            onAcknowledge={() =>
              acknowledgeAlert.mutate({
                alertId: a.alertId,
                providerId: 'current-user',
              })
            }
            onOverride={() =>
              overrideAlert.mutate({
                alertId: a.alertId,
                providerId: 'current-user',
                reason: 'Clinical judgment documented',
              })
            }
          />
        ))}
      </div>
      <OverrideDialogHint
        onOverride={() =>
          overrideAlert.mutate({
            alertId: alerts.data?.items[0]?.alertId ?? '',
            providerId: 'current-user',
            reason: 'Documented override',
          })
        }
      />
    </div>
  );
}

export function RecommendationsSection({ filters }: { filters?: CdssFilters }) {
  const recs = useRecommendations(filters);
  const { applyRecommendation } = useCdssMutations();
  if (recs.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(recs.data?.items ?? []).slice(0, 12).map((r) => (
        <RecommendationCard
          key={r.recommendationId}
          recommendation={r}
          onApply={() =>
            applyRecommendation.mutate({
              recommendationId: r.recommendationId,
              providerId: 'current-user',
            })
          }
        />
      ))}
    </div>
  );
}

export function GuidelinesSection({ filters }: { filters?: CdssFilters }) {
  const guidelines = useGuidelines(filters);
  if (guidelines.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(guidelines.data?.items ?? []).slice(0, 9).map((g) => (
          <GuidelineCard key={g.guidelineId} guideline={g} />
        ))}
      </div>
      {(guidelines.data?.items ?? []).slice(0, 2).map((g) => (
        <GuidelineViewer key={`view-${g.guidelineId}`} guideline={g} />
      ))}
    </div>
  );
}

export function DiagnosticsSection({ filters }: { filters?: CdssFilters }) {
  const diagnostics = useDiagnosticSupport(filters);
  if (diagnostics.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(diagnostics.data?.items ?? []).slice(0, 12).map((d) => (
        <DiagnosticSuggestionCard key={d.suggestionId} suggestion={d} />
      ))}
    </div>
  );
}

export function DrugSafetySection({ filters }: { filters?: CdssFilters }) {
  const safety = useDrugSafety(filters);
  if (safety.isLoading) return <LoadingView />;
  return (
    <div className="space-y-4">
      {(safety.data?.interactions.items ?? []).slice(0, 3).map((a) => (
        <DrugInteractionBanner key={a.alertId} alert={a} />
      ))}
      {(safety.data?.allergies.items ?? []).slice(0, 2).map((a) => (
        <AllergyBanner key={a.alertId} alert={a} />
      ))}
      {(safety.data?.contraindications.items ?? []).slice(0, 2).map((a) => (
        <ContraindicationBanner key={a.alertId} alert={a} />
      ))}
      {(safety.data?.duplicateTherapy.items ?? []).slice(0, 2).map((a) => (
        <DuplicateTherapyBanner key={a.alertId} alert={a} />
      ))}
    </div>
  );
}

export function PreventiveSection({ filters }: { filters?: CdssFilters }) {
  const preventive = usePreventiveCare(filters);
  if (preventive.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(preventive.data?.items ?? []).slice(0, 12).map((p) => (
        <PreventiveReminderCard key={p.reminderId} reminder={p} />
      ))}
    </div>
  );
}

export function OrderSetsSection({ filters }: { filters?: CdssFilters }) {
  const orderSets = useOrderSets(filters);
  if (orderSets.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(orderSets.data?.items ?? []).slice(0, 12).map((o) => (
        <OrderSetCard key={o.orderSetId} orderSet={o} />
      ))}
    </div>
  );
}

export function CalculatorsSection() {
  const calculators = useRiskCalculators();
  const { calculateRisk } = useCdssMutations();
  const [result, setResult] = useState<CalculatorResult | null>(null);
  if (calculators.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(calculators.data ?? []).slice(0, 9).map((c) => (
          <RiskCalculatorCard
            key={c.calculatorId}
            calculator={c}
            onCalculate={() => {
              void calculateRisk
                .mutateAsync({
                  calculatorType: c.type,
                  inputs: { age: 72, sex: 'male' },
                })
                .then((r) => {
                  if (r) setResult(r);
                });
            }}
          />
        ))}
      </div>
      {result ? <CalculatorPanel result={result} /> : null}
    </div>
  );
}

export function AnalyticsSection({ filters }: { filters?: CdssFilters }) {
  const analytics = useCdssAnalytics(filters?.facilityId);
  const { exportData } = useCdssMutations();
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return <EmptyState title="No analytics data" />;
  return (
    <div className="space-y-6">
      <CdssAnalyticsPanel analytics={analytics.data} />
      <CdssExportToolbar onExport={(f) => exportData.mutate(f)} />
    </div>
  );
}

export function ComplianceSection({ filters }: { filters?: CdssFilters }) {
  const guidelines = useGuidelines(filters);
  const analytics = useCdssAnalytics(filters?.facilityId);
  if (guidelines.isLoading || analytics.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {analytics.data ? (
        <CdssAnalyticsPanel analytics={analytics.data} />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(guidelines.data?.items ?? []).slice(0, 9).map((g) => (
          <GuidelineCard key={g.guidelineId} guideline={g} />
        ))}
      </div>
    </div>
  );
}

export function ProtocolsSection({ filters }: { filters?: CdssFilters }) {
  const protocols = useProtocols(filters);
  const pathways = useClinicalPathways(filters);
  const { publishProtocol } = useCdssMutations();
  if (protocols.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(protocols.data?.items ?? []).slice(0, 9).map((p) => (
          <ClinicalProtocolCard key={p.protocolId} protocol={p} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(pathways.data?.items ?? []).slice(0, 6).map((p) => (
          <ClinicalPathwayCard key={p.pathwayId} pathway={p} />
        ))}
      </div>
      <button
        type="button"
        className="text-sm text-primary underline"
        onClick={() =>
          publishProtocol.mutate({
            protocolId: protocols.data?.items[0]?.protocolId ?? '',
            publishedBy: 'current-user',
          })
        }
      >
        Publish sample protocol
      </button>
    </div>
  );
}

export function RulesSection({ filters }: { filters?: CdssFilters }) {
  const rules = useRules(filters);
  const trees = useDecisionTrees();
  const { updateRule } = useCdssMutations();
  if (rules.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(rules.data?.items ?? []).slice(0, 12).map((r) => (
          <ClinicalRuleCard
            key={r.ruleId}
            rule={r}
            onToggle={() =>
              updateRule.mutate({ ruleId: r.ruleId, enabled: !r.enabled })
            }
          />
        ))}
      </div>
      {(trees.data ?? []).slice(0, 2).map((t) => (
        <DecisionTreeViewer key={t.treeId} tree={t} />
      ))}
    </div>
  );
}

export function KnowledgeSection({ filters }: { filters?: CdssFilters }) {
  const evidence = useEvidenceArticles(filters);
  const guidelines = useGuidelines(filters);
  if (evidence.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(evidence.data?.items ?? []).slice(0, 9).map((e) => (
          <EvidenceCard key={e.articleId} article={e} />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(guidelines.data?.items ?? []).slice(0, 6).map((g) => (
          <GuidelineCard key={g.guidelineId} guideline={g} />
        ))}
      </div>
    </div>
  );
}

export function AuditSection({ filters }: { filters?: CdssFilters }) {
  const audit = useAudit(filters);
  if (audit.isLoading) return <LoadingView />;
  return <AuditTimeline audits={audit.data?.items ?? []} />;
}

export function CdssSectionContent({
  section,
  filters,
  variant = 'professional',
}: {
  section: CdssSection;
  filters?: CdssFilters;
  variant?: 'professional' | 'facility' | 'admin';
}) {
  void variant;
  switch (section) {
    case 'alerts':
      return <AlertsSection filters={filters} />;
    case 'recommendations':
      return <RecommendationsSection filters={filters} />;
    case 'guidelines':
      return <GuidelinesSection filters={filters} />;
    case 'diagnostics':
      return <DiagnosticsSection filters={filters} />;
    case 'drug-safety':
      return <DrugSafetySection filters={filters} />;
    case 'preventive':
      return <PreventiveSection filters={filters} />;
    case 'order-sets':
      return <OrderSetsSection filters={filters} />;
    case 'calculators':
      return <CalculatorsSection />;
    case 'analytics':
      return <AnalyticsSection filters={filters} />;
    case 'compliance':
      return <ComplianceSection filters={filters} />;
    case 'protocols':
      return <ProtocolsSection filters={filters} />;
    case 'rules':
      return <RulesSection filters={filters} />;
    case 'knowledge':
      return <KnowledgeSection filters={filters} />;
    case 'audit':
      return <AuditSection filters={filters} />;
    default:
      return <DashboardSection filters={filters} />;
  }
}
