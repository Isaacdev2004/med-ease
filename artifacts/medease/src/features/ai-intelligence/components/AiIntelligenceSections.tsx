import {
  AIAnalyticsPanel,
  AiAlertsPanel,
  AiDashboardPanel,
  BiasDashboard,
  ClinicalSummaryCard,
  CopilotChatPanel,
  DriftDetectionPanel,
  ExplainabilityPanel,
  ExportToolbar,
  ModelPerformanceCard,
  OperationalForecastPanel,
  PredictionCard,
  PromptHistoryPanel,
  RecommendationCard,
  RiskScoreCard,
} from '@/features/ai-intelligence/components/AiIntelligenceComponents';
import {
  useAiAnalytics,
  useAiDashboard,
  useBiasMonitoring,
  useClinicalCopilot,
  useClinicalSummaries,
  useExplainability,
  useForecasts,
  useModelPerformance,
  useModelRegistry,
  usePredictions,
  useRecommendations,
  useRiskScores,
} from '@/features/ai-intelligence/hooks/use-ai-intelligence';
import { useAiIntelligenceMutations } from '@/features/ai-intelligence/mutations/ai-intelligence.mutations';
import type { AiIntelligenceFilters } from '@/services/ai-intelligence/types';
import { LoadingView } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Sparkles } from 'lucide-react';

export type AiIntelligenceSection =
  | 'dashboard'
  | 'copilot'
  | 'predictions'
  | 'risk-scores'
  | 'summaries'
  | 'forecasting'
  | 'resource-predictions'
  | 'capacity'
  | 'hub'
  | 'model-registry'
  | 'model-monitoring'
  | 'governance'
  | 'bias'
  | 'analytics'
  | 'audit';

export function DashboardSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const dashboard = useAiDashboard(filters?.facilityId);
  const predictions = usePredictions(filters);
  const recommendations = useRecommendations(filters);
  const { exportData } = useAiIntelligenceMutations();
  if (dashboard.isLoading) return <LoadingView label="Loading AI dashboard…" />;
  if (!dashboard.data) return <EmptyState icon={Sparkles} title="No AI intelligence data" />;
  return (
    <div className="space-y-6">
      <AiDashboardPanel dashboard={dashboard.data} />
      <AiAlertsPanel alerts={dashboard.data.recentAlerts} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(predictions.data?.items ?? []).slice(0, 6).map((p) => <PredictionCard key={p.predictionId} prediction={p} />)}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(recommendations.data?.items ?? []).slice(0, 4).map((r) => <RecommendationCard key={r.recommendationId} recommendation={r} />)}
      </div>
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function CopilotSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const sessions = useClinicalCopilot(filters);
  if (sessions.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <PromptHistoryPanel sessions={sessions.data?.items ?? []} />
      <div className="grid gap-4 sm:grid-cols-2">
        {(sessions.data?.items ?? []).slice(0, 4).map((s) => <CopilotChatPanel key={s.sessionId} session={s} />)}
      </div>
    </div>
  );
}

export function PredictionsSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const predictions = usePredictions(filters);
  const explainability = useExplainability(filters);
  if (predictions.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(predictions.data?.items ?? []).slice(0, 12).map((p) => <PredictionCard key={p.predictionId} prediction={p} />)}
      </div>
      {(explainability.data?.items ?? []).slice(0, 2).map((r) => <ExplainabilityPanel key={r.reportId} report={r} />)}
    </div>
  );
}

export function RiskScoresSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const riskScores = useRiskScores(filters);
  if (riskScores.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(riskScores.data?.items ?? []).slice(0, 12).map((a) => <RiskScoreCard key={a.assessmentId} assessment={a} />)}
    </div>
  );
}

export function SummariesSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const summaries = useClinicalSummaries(filters);
  if (summaries.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(summaries.data?.items ?? []).slice(0, 12).map((s) => <ClinicalSummaryCard key={s.summaryId} summary={s} />)}
    </div>
  );
}

export function ForecastingSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const forecasts = useForecasts(filters);
  if (forecasts.isLoading) return <LoadingView />;
  return <OperationalForecastPanel forecasts={forecasts.data?.items ?? []} />;
}

export function ResourcePredictionsSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const forecasts = useForecasts({ ...filters, forecastType: 'resource' });
  const predictions = usePredictions(filters);
  if (forecasts.isLoading || predictions.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      <OperationalForecastPanel forecasts={forecasts.data?.items ?? []} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(predictions.data?.items ?? []).slice(0, 6).map((p) => <PredictionCard key={p.predictionId} prediction={p} />)}
      </div>
    </div>
  );
}

export function CapacitySection({ filters }: { filters?: AiIntelligenceFilters }) {
  const forecasts = useForecasts({ ...filters, forecastType: 'bed_occupancy' });
  if (forecasts.isLoading) return <LoadingView />;
  return <OperationalForecastPanel forecasts={forecasts.data?.items ?? []} />;
}

export function ModelRegistrySection({ filters }: { filters?: AiIntelligenceFilters }) {
  const models = useModelRegistry(filters);
  const performance = useModelPerformance();
  if (models.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(models.data?.items ?? []).map((m) => (
        <ModelPerformanceCard key={m.modelId} model={m} evaluations={performance.data?.items} />
      ))}
    </div>
  );
}

export function ModelMonitoringSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const dashboard = useAiDashboard(filters?.facilityId);
  const performance = useModelPerformance();
  if (dashboard.isLoading || performance.isLoading) return <LoadingView />;
  return (
    <div className="space-y-6">
      {dashboard.data && <DriftDetectionPanel alerts={dashboard.data.recentAlerts} />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(performance.data?.items ?? []).slice(0, 9).map((e) => (
          <ModelPerformanceCard
            key={e.evaluationId}
            model={{ modelId: e.modelId, name: e.metric, version: '', type: 'deterioration', status: e.passed ? 'production' : 'staging', accuracy: e.value, createdAt: e.evaluatedAt }}
            evaluations={[e]}
          />
        ))}
      </div>
    </div>
  );
}

export function GovernanceSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const models = useModelRegistry({ ...filters, status: 'staging' });
  if (models.isLoading) return <LoadingView />;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(models.data?.items ?? []).map((m) => <ModelPerformanceCard key={m.modelId} model={m} />)}
    </div>
  );
}

export function BiasSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const bias = useBiasMonitoring(filters);
  if (bias.isLoading) return <LoadingView />;
  return <BiasDashboard metrics={bias.data?.items ?? []} />;
}

export function AnalyticsSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const analytics = useAiAnalytics(filters?.facilityId);
  const { exportData } = useAiIntelligenceMutations();
  if (analytics.isLoading) return <LoadingView />;
  if (!analytics.data) return <EmptyState icon={Sparkles} title="No analytics data" />;
  return (
    <div className="space-y-6">
      <AIAnalyticsPanel analytics={analytics.data} />
      <ExportToolbar onExport={(fmt) => exportData.mutate(fmt)} />
    </div>
  );
}

export function AuditSection({ filters }: { filters?: AiIntelligenceFilters }) {
  const dashboard = useAiDashboard(filters?.facilityId);
  if (dashboard.isLoading) return <LoadingView />;
  return dashboard.data ? <AiAlertsPanel alerts={dashboard.data.recentAlerts} /> : null;
}

export function AiIntelligenceSectionContent({ section, filters }: { section: AiIntelligenceSection; filters?: AiIntelligenceFilters }) {
  switch (section) {
    case 'copilot': return <CopilotSection filters={filters} />;
    case 'predictions': return <PredictionsSection filters={filters} />;
    case 'risk-scores': return <RiskScoresSection filters={filters} />;
    case 'summaries': return <SummariesSection filters={filters} />;
    case 'forecasting': return <ForecastingSection filters={filters} />;
    case 'resource-predictions': return <ResourcePredictionsSection filters={filters} />;
    case 'capacity': return <CapacitySection filters={filters} />;
    case 'hub': return <DashboardSection filters={filters} />;
    case 'model-registry': return <ModelRegistrySection filters={filters} />;
    case 'model-monitoring': return <ModelMonitoringSection filters={filters} />;
    case 'governance': return <GovernanceSection filters={filters} />;
    case 'bias': return <BiasSection filters={filters} />;
    case 'analytics': return <AnalyticsSection filters={filters} />;
    case 'audit': return <AuditSection filters={filters} />;
    default: return <DashboardSection filters={filters} />;
  }
}
