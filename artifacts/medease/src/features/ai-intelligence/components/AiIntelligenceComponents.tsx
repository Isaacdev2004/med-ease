import { format } from 'date-fns';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  Brain,
  LineChart,
  MessageSquare,
  Shield,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

import { PREDICTION_LABELS } from '@/services/ai-intelligence/predictive-models';
import { FORECAST_LABELS } from '@/services/ai-intelligence/forecasting';
import type {
  AiAlert,
  AiAnalytics,
  AiIntelligenceDashboard,
  AiPrediction,
  BiasMetric,
  ClinicalRecommendation,
  ClinicalSummary,
  CopilotSession,
  ExplainabilityReport,
  ModelEvaluation,
  ModelVersion,
  OperationalForecast,
  RiskAssessment,
} from '@/services/ai-intelligence/types';
import { BarChartPanel } from '@/shared/charts';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

const riskVariant = {
  low: 'outline',
  moderate: 'secondary',
  high: 'destructive',
  critical: 'destructive',
} as const;
const alertVariant = {
  info: 'outline',
  warning: 'secondary',
  critical: 'destructive',
} as const;
const recVariant = {
  pending: 'outline',
  accepted: 'default',
  rejected: 'destructive',
  overridden: 'secondary',
} as const;

export function AiDashboardPanel({
  dashboard,
}: {
  dashboard: AiIntelligenceDashboard;
}) {
  const metrics = [
    {
      label: 'Active Predictions',
      value: dashboard.activePredictions.toLocaleString(),
      icon: Sparkles,
    },
    {
      label: 'High-Risk Patients',
      value: dashboard.highRiskPatients.toLocaleString(),
      icon: AlertTriangle,
    },
    {
      label: 'Pending Recommendations',
      value: dashboard.pendingRecommendations.toLocaleString(),
      icon: Brain,
    },
    {
      label: 'Copilot Sessions (24h)',
      value: dashboard.activeCopilotSessions.toLocaleString(),
      icon: Bot,
    },
    {
      label: 'Model Accuracy',
      value: `${dashboard.modelAccuracy}%`,
      icon: Activity,
    },
    {
      label: 'Open AI Alerts',
      value: dashboard.alertsOpen.toLocaleString(),
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
      <BarChartPanel
        title="Prediction Volume Trend"
        data={dashboard.predictionTrend}
      />
    </div>
  );
}

export function PredictionCard({ prediction }: { prediction: AiPrediction }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">
            {PREDICTION_LABELS[prediction.type]}
          </span>
          <Badge
            variant={riskVariant[prediction.riskLevel]}
            className="capitalize"
          >
            {prediction.riskLevel}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {prediction.predictionId} · {prediction.patientId}
        </p>
        <p className="text-xs">
          Score: {(prediction.score * 100).toFixed(0)}% · Confidence:{' '}
          {(prediction.confidence * 100).toFixed(0)}%
        </p>
        <p className="text-xs">
          {format(new Date(prediction.generatedAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function RiskScoreCard({ assessment }: { assessment: RiskAssessment }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{assessment.category}</span>
          <Badge
            variant={riskVariant[assessment.riskLevel]}
            className="capitalize"
          >
            {assessment.riskLevel}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{assessment.patientId}</p>
        <p className="text-xs">Score: {(assessment.score * 100).toFixed(0)}%</p>
        <div className="flex flex-wrap gap-1">
          {assessment.factors.slice(0, 3).map((f) => (
            <Badge key={f} variant="outline" className="text-xs">
              {f}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function RecommendationCard({
  recommendation,
}: {
  recommendation: ClinicalRecommendation;
}) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium line-clamp-2">
            {recommendation.title}
          </span>
          <Badge
            variant={recVariant[recommendation.status]}
            className="capitalize shrink-0"
          >
            {recommendation.status}
          </Badge>
        </div>
        <Badge variant="outline">{recommendation.category}</Badge>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {recommendation.rationale}
        </p>
        <p className="text-xs">
          {recommendation.patientId} ·{' '}
          {format(new Date(recommendation.createdAt), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export function CopilotChatPanel({ session }: { session: CopilotSession }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-5 w-5" /> {session.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {session.messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          session.messages.slice(-4).map((m) => (
            <div
              key={m.messageId}
              className={`text-sm rounded-md p-2 ${m.role === 'assistant' ? 'bg-muted' : 'bg-primary/5'}`}
            >
              <p className="text-xs font-medium capitalize mb-1">{m.role}</p>
              <p className="line-clamp-3">{m.content}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function ClinicalSummaryCard({ summary }: { summary: ClinicalSummary }) {
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium capitalize">
            {summary.sourceType} Summary
          </span>
          <Badge variant="outline">{summary.modelVersion}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {summary.patientId} · {summary.sourceId}
        </p>
        <p className="text-xs line-clamp-3">{summary.summary}</p>
        <div className="flex flex-wrap gap-1">
          {summary.keyFindings.map((f) => (
            <Badge key={f} variant="secondary" className="text-xs">
              {f}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ForecastChart({ forecast }: { forecast: OperationalForecast }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <LineChart className="h-5 w-5" /> {FORECAST_LABELS[forecast.type]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-2xl font-bold">{forecast.predictedValue}%</p>
        <p className="text-xs text-muted-foreground">
          {forecast.metric} · {forecast.horizonDays}-day horizon
        </p>
        <BarChartPanel title="" data={forecast.trend} />
      </CardContent>
    </Card>
  );
}

export function OperationalForecastPanel({
  forecasts,
}: {
  forecasts: OperationalForecast[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {forecasts.slice(0, 4).map((f) => (
        <ForecastChart key={f.forecastId} forecast={f} />
      ))}
    </div>
  );
}

export function ModelPerformanceCard({
  model,
  evaluations,
}: {
  model: ModelVersion;
  evaluations?: ModelEvaluation[];
}) {
  const evals = evaluations?.filter((e) => e.modelId === model.modelId) ?? [];
  return (
    <Card>
      <CardContent className="pt-4 text-sm space-y-2">
        <div className="flex justify-between gap-2">
          <span className="font-medium">{model.name}</span>
          <Badge className="capitalize">{model.status}</Badge>
        </div>
        <p className="text-xs">
          {model.modelId} · {model.version}
        </p>
        <p className="text-xs">
          Accuracy: {(model.accuracy * 100).toFixed(1)}%
        </p>
        {evals.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {evals.slice(0, 3).map((e) => (
              <Badge
                key={e.evaluationId}
                variant={e.passed ? 'default' : 'destructive'}
                className="text-xs"
              >
                {e.metric}: {(e.value * 100).toFixed(0)}%
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ExplainabilityPanel({
  report,
}: {
  report: ExplainabilityReport;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Explainability Report</CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-3">
        <p className="text-xs text-muted-foreground">
          Prediction: {report.predictionId} · {report.patientId}
        </p>
        <p>{report.narrative}</p>
        <div className="space-y-1">
          {report.topFeatures.map((f) => (
            <div key={f.feature} className="flex justify-between text-xs">
              <span>{f.feature}</span>
              <span>{(f.contribution * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DriftDetectionPanel({ alerts }: { alerts: AiAlert[] }) {
  const driftAlerts = alerts.filter((a) => a.type === 'model_drift');
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-5 w-5" /> Model Drift Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {driftAlerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No drift alerts detected.
          </p>
        ) : (
          driftAlerts.slice(0, 5).map((a) => (
            <div
              key={a.alertId}
              className="flex justify-between gap-2 text-sm border-b pb-2 last:border-0"
            >
              <span className="line-clamp-1">{a.title}</span>
              <Badge variant={alertVariant[a.severity]}>{a.severity}</Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function BiasDashboard({ metrics }: { metrics: BiasMetric[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-5 w-5" /> Bias Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {metrics.slice(0, 8).map((m) => (
          <div
            key={m.metricId}
            className="flex items-center justify-between gap-2 text-sm border-b pb-2 last:border-0"
          >
            <div>
              <p className="font-medium capitalize">{m.demographic}</p>
              <p className="text-xs text-muted-foreground">
                {m.modelId} · n={m.sampleSize.toLocaleString()}
              </p>
            </div>
            <Badge
              variant={
                m.status === 'action_required'
                  ? 'destructive'
                  : m.status === 'monitoring'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {(m.disparityIndex * 100).toFixed(1)}%
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AIAnalyticsPanel({ analytics }: { analytics: AiAnalytics }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: 'Prediction Volume',
            value: analytics.predictionVolume.toLocaleString(),
          },
          {
            label: 'Rec. Acceptance',
            value: `${analytics.recommendationAcceptanceRate}%`,
          },
          {
            label: 'Copilot Hours',
            value: analytics.copilotUsageHours.toFixed(1),
          },
          { label: 'Drift Score', value: analytics.modelDriftScore.toFixed(2) },
          { label: 'Bias Alerts', value: analytics.biasAlerts },
          {
            label: 'Forecast Accuracy',
            value: `${analytics.forecastAccuracy}%`,
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
      <BarChartPanel title="Usage by Module" data={analytics.usageByModule} />
      <BarChartPanel
        title="Model Performance"
        data={analytics.modelPerformance}
      />
    </div>
  );
}

export function PromptHistoryPanel({
  sessions,
}: {
  sessions: CopilotSession[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="h-5 w-5" /> Prompt History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sessions.slice(0, 6).map((s) => (
          <div
            key={s.sessionId}
            className="text-sm border-b pb-2 last:border-0"
          >
            <p className="font-medium line-clamp-1">{s.title}</p>
            <p className="text-xs text-muted-foreground">
              {s.providerId} ·{' '}
              {format(new Date(s.lastMessageAt), 'MMM d, yyyy')}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ExportToolbar({
  onExport,
}: {
  onExport: (format: 'csv' | 'pdf' | 'xlsx') => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={() => onExport('csv')}>
        <BarChart3 className="h-4 w-4 mr-1" /> Export CSV
      </Button>
      <Button variant="outline" size="sm" onClick={() => onExport('pdf')}>
        Export PDF
      </Button>
      <Button variant="outline" size="sm" onClick={() => onExport('xlsx')}>
        Export XLSX
      </Button>
    </div>
  );
}

export function AiAlertsPanel({ alerts }: { alerts: AiAlert[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent AI Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.slice(0, 6).map((a) => (
          <div
            key={a.alertId}
            className="flex justify-between gap-2 text-sm border-b pb-2 last:border-0"
          >
            <span className="line-clamp-1">{a.title}</span>
            <Badge variant={alertVariant[a.severity]}>{a.severity}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
