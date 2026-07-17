import {
  PREDICTION_LABELS,
  PREDICTION_TYPES,
  computePredictionScore,
  scoreToRiskLevel,
} from '@/services/ai-intelligence/predictive-models';
import {
  RECOMMENDATION_CATEGORIES,
  recommendationPriority,
} from '@/services/ai-intelligence/recommendation-engine';
import {
  FORECAST_LABELS,
  FORECAST_TYPES,
  buildForecastTrend,
} from '@/services/ai-intelligence/forecasting';
import { COPILOT_PROMPTS } from '@/services/ai-intelligence/clinical-copilot';
import type {
  AiAlert,
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

const FACILITIES = Array.from(
  { length: 25 },
  (_, i) => `fac-${String(i + 1).padStart(3, '0')}`,
);
const SCALE = {
  predictions: 125,
  recommendations: 160,
  riskAssessments: 100,
  summaries: 150,
  forecasts: 20,
  alerts: 60,
  evaluations: 32,
  explainability: 40,
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const MOCK_PREDICTIONS: AiPrediction[] = Array.from(
  { length: 400 },
  (_, i) => {
    const type = PREDICTION_TYPES[i % PREDICTION_TYPES.length]!;
    const score = computePredictionScore(type, i);
    return {
      predictionId: `pred-${String(i + 1).padStart(5, '0')}`,
      patientId: `phr-${String((i % 5000) + 1).padStart(4, '0')}`,
      facilityId: FACILITIES[i % 25]!,
      type,
      score,
      confidence: Math.round((0.78 + (i % 20) * 0.01) * 100) / 100,
      riskLevel: scoreToRiskLevel(score),
      generatedAt: daysAgo(i % 30),
      modelVersion: `v${1 + (i % 5)}.${i % 10}`,
      providerId: `prov-${String((i % 200) + 1).padStart(4, '0')}`,
      encounterId:
        i % 2 === 0
          ? `enc-${String((i % 3000) + 1).padStart(5, '0')}`
          : undefined,
    };
  },
);

export const MOCK_RISK_ASSESSMENTS: RiskAssessment[] = Array.from(
  { length: 300 },
  (_, i) => {
    const category =
      PREDICTION_LABELS[PREDICTION_TYPES[i % PREDICTION_TYPES.length]!]!;
    const score = computePredictionScore(
      PREDICTION_TYPES[i % PREDICTION_TYPES.length]!,
      i + 7,
    );
    return {
      assessmentId: `risk-${String(i + 1).padStart(5, '0')}`,
      patientId: `phr-${String((i % 4000) + 1).padStart(4, '0')}`,
      facilityId: FACILITIES[i % 25]!,
      category,
      score,
      riskLevel: scoreToRiskLevel(score),
      assessedAt: daysAgo(i % 45),
      factors: ['Age', 'Comorbidities', 'Recent vitals trend'].slice(
        0,
        2 + (i % 2),
      ),
      modelVersion: `v${1 + (i % 4)}.0`,
    };
  },
);

export const MOCK_RECOMMENDATIONS: ClinicalRecommendation[] = Array.from(
  { length: 500 },
  (_, i) => {
    const category =
      RECOMMENDATION_CATEGORIES[i % RECOMMENDATION_CATEGORIES.length]!;
    const status = (['pending', 'accepted', 'rejected', 'overridden'] as const)[
      i % 4
    ]!;
    return {
      recommendationId: `rec-${String(i + 1).padStart(5, '0')}`,
      patientId: `phr-${String((i % 4500) + 1).padStart(4, '0')}`,
      facilityId: FACILITIES[i % 25]!,
      category,
      title: `${category} recommendation for patient follow-up`,
      rationale: `AI analysis suggests ${category.toLowerCase()} based on recent clinical data and population benchmarks.`,
      status,
      priority: recommendationPriority(category),
      createdAt: daysAgo(i % 20),
      modelVersion: `v${1 + (i % 3)}.2`,
      rating: status !== 'pending' ? 3 + (i % 3) : undefined,
    };
  },
);

export const MOCK_COPILOT_SESSIONS: CopilotSession[] = Array.from(
  { length: 300 },
  (_, i) => {
    const prompt = COPILOT_PROMPTS[i % COPILOT_PROMPTS.length]!;
    return {
      sessionId: `cop-${String(i + 1).padStart(5, '0')}`,
      patientId:
        i % 3 === 0
          ? `phr-${String((i % 2000) + 1).padStart(4, '0')}`
          : undefined,
      facilityId: FACILITIES[i % 25]!,
      providerId: `prov-${String((i % 150) + 1).padStart(4, '0')}`,
      title: prompt.length > 48 ? `${prompt.slice(0, 45)}…` : prompt,
      startedAt: daysAgo(i % 14),
      lastMessageAt: daysAgo(i % 3),
      messages: [
        {
          messageId: `msg-${i}-1`,
          role: 'user',
          content: prompt,
          timestamp: daysAgo(i % 14),
        },
        {
          messageId: `msg-${i}-2`,
          role: 'assistant',
          content:
            'Based on available clinical data, I recommend reviewing recent vitals and care plan goals.',
          timestamp: daysAgo(i % 13),
        },
      ],
    };
  },
);

export const MOCK_CLINICAL_SUMMARIES: ClinicalSummary[] = Array.from(
  { length: 400 },
  (_, i) => {
    const sourceType = (['note', 'encounter', 'discharge'] as const)[i % 3]!;
    return {
      summaryId: `sum-${String(i + 1).padStart(5, '0')}`,
      patientId: `phr-${String((i % 3500) + 1).padStart(4, '0')}`,
      facilityId: FACILITIES[i % 25]!,
      sourceType,
      sourceId: `${sourceType}-${String((i % 5000) + 1).padStart(5, '0')}`,
      summary: `AI-generated ${sourceType} summary: patient clinically stable with ongoing management per care plan.`,
      keyFindings: [
        'Vitals stable',
        'Medications reconciled',
        'Follow-up scheduled',
      ],
      generatedAt: daysAgo(i % 25),
      modelVersion: `v2.${i % 5}`,
    };
  },
);

export const MOCK_FORECASTS: OperationalForecast[] = Array.from(
  { length: 150 },
  (_, i) => {
    const type = FORECAST_TYPES[i % FORECAST_TYPES.length]!;
    const predictedValue = 50 + (i % 45);
    return {
      forecastId: `fc-${String(i + 1).padStart(5, '0')}`,
      facilityId: FACILITIES[i % 25]!,
      type,
      metric: FORECAST_LABELS[type],
      horizonDays: 7 + (i % 14),
      predictedValue,
      confidenceInterval: {
        lower: predictedValue - 8,
        upper: predictedValue + 8,
      },
      generatedAt: daysAgo(i % 10),
      trend: buildForecastTrend(predictedValue, 7 + (i % 7)),
    };
  },
);

export const MOCK_AI_ALERTS: AiAlert[] = Array.from({ length: 200 }, (_, i) => {
  const severity = (['info', 'warning', 'critical'] as const)[i % 3]!;
  return {
    alertId: `alert-${String(i + 1).padStart(5, '0')}`,
    facilityId: FACILITIES[i % 25]!,
    type: [
      'model_drift',
      'bias_threshold',
      'prediction_spike',
      'copilot_usage',
    ][i % 4]!,
    severity,
    title: `${severity === 'critical' ? 'Critical' : 'AI'} alert: ${['Model drift detected', 'Bias threshold exceeded', 'Prediction volume spike', 'Copilot anomaly'][i % 4]}`,
    message: 'Automated monitoring flagged an anomaly requiring review.',
    createdAt: daysAgo(i % 15),
    acknowledged: i % 4 === 0,
    modelId:
      i % 2 === 0
        ? `model-${String((i % 50) + 1).padStart(3, '0')}`
        : undefined,
  };
});

export const MOCK_MODEL_VERSIONS: ModelVersion[] = Array.from(
  { length: 50 },
  (_, i) => {
    const status = (['draft', 'staging', 'production', 'archived'] as const)[
      i % 4
    ]!;
    const type =
      i % 3 === 0
        ? PREDICTION_TYPES[i % PREDICTION_TYPES.length]!
        : i % 3 === 1
          ? FORECAST_TYPES[i % FORECAST_TYPES.length]!
          : (['nlp', 'copilot', 'recommendation'] as const)[i % 3]!;
    return {
      modelId: `model-${String(i + 1).padStart(3, '0')}`,
      name: `${typeof type === 'string' && PREDICTION_LABELS[type as keyof typeof PREDICTION_LABELS] ? PREDICTION_LABELS[type as keyof typeof PREDICTION_LABELS] : String(type)} Model`,
      version: `v${1 + Math.floor(i / 10)}.${i % 10}`,
      type,
      status,
      accuracy: Math.round((0.82 + (i % 15) * 0.01) * 100) / 100,
      deployedAt: status === 'production' ? daysAgo(i % 30) : undefined,
      createdAt: daysAgo(60 - (i % 50)),
      facilityId: i % 5 === 0 ? FACILITIES[i % 25] : undefined,
    };
  },
);

export const MOCK_MODEL_EVALUATIONS: ModelEvaluation[] = Array.from(
  { length: 150 },
  (_, i) => {
    const value = Math.round((0.75 + (i % 20) * 0.01) * 100) / 100;
    const threshold = 0.8;
    return {
      evaluationId: `eval-${String(i + 1).padStart(5, '0')}`,
      modelId: MOCK_MODEL_VERSIONS[i % 50]!.modelId,
      metric: ['accuracy', 'precision', 'recall', 'f1', 'auc'][i % 5]!,
      value,
      threshold,
      passed: value >= threshold,
      evaluatedAt: daysAgo(i % 20),
    };
  },
);

export const MOCK_EXPLAINABILITY: ExplainabilityReport[] = Array.from(
  { length: 200 },
  (_, i) => {
    const pred = MOCK_PREDICTIONS[i % 400]!;
    return {
      reportId: `xai-${String(i + 1).padStart(5, '0')}`,
      predictionId: pred.predictionId,
      patientId: pred.patientId,
      facilityId: pred.facilityId,
      topFeatures: [
        { feature: 'Prior admissions', contribution: 0.28 },
        { feature: 'Lab trend', contribution: 0.22 },
        { feature: 'Age', contribution: 0.18 },
        { feature: 'Vital signs', contribution: 0.15 },
      ],
      narrative: `Model identified ${PREDICTION_LABELS[pred.type]} drivers primarily from historical utilization and recent clinical indicators.`,
      generatedAt: daysAgo(i % 12),
    };
  },
);

export const MOCK_BIAS_METRICS: BiasMetric[] = Array.from(
  { length: 80 },
  (_, i) => {
    const disparityIndex = Math.round((0.02 + (i % 15) * 0.01) * 100) / 100;
    return {
      metricId: `bias-${String(i + 1).padStart(4, '0')}`,
      modelId: MOCK_MODEL_VERSIONS[i % 50]!.modelId,
      demographic: ['age', 'sex', 'race', 'insurance', 'language'][i % 5]!,
      disparityIndex,
      sampleSize: 1000 + (i % 50) * 100,
      status:
        disparityIndex > 0.12
          ? 'action_required'
          : disparityIndex > 0.08
            ? 'monitoring'
            : 'within_threshold',
      measuredAt: daysAgo(i % 30),
    };
  },
);

export const MOCK_AI_AUDIT: import('@/services/ai-intelligence/types').AiAuditLog[] =
  Array.from({ length: 100 }, (_, i) => ({
    auditId: `aiaudit-${String(i + 1).padStart(4, '0')}`,
    action: [
      'generate_prediction',
      'start_copilot',
      'approve_model',
      'rate_recommendation',
      'export',
    ][i % 5]!,
    actorId: `user-${String((i % 50) + 1).padStart(3, '0')}`,
    resourceType: [
      'prediction',
      'copilot',
      'model',
      'recommendation',
      'summary',
    ][i % 5]!,
    resourceId: `res-${String(i + 1).padStart(4, '0')}`,
    timestamp: daysAgo(i % 60),
    facilityId: FACILITIES[i % 25],
    outcome: i % 15 === 0 ? ('failure' as const) : ('success' as const),
  }));

export function buildAiDashboard(facilityId?: string): AiIntelligenceDashboard {
  const predictions = facilityId
    ? MOCK_PREDICTIONS.filter((p) => p.facilityId === facilityId)
    : MOCK_PREDICTIONS;
  const recommendations = facilityId
    ? MOCK_RECOMMENDATIONS.filter((r) => r.facilityId === facilityId)
    : MOCK_RECOMMENDATIONS;
  const alerts = facilityId
    ? MOCK_AI_ALERTS.filter((a) => a.facilityId === facilityId)
    : MOCK_AI_ALERTS;
  const sessions = facilityId
    ? MOCK_COPILOT_SESSIONS.filter((s) => s.facilityId === facilityId)
    : MOCK_COPILOT_SESSIONS;
  const models = MOCK_MODEL_VERSIONS.filter((m) => m.status === 'production');

  return {
    activePredictions: predictions.length * SCALE.predictions,
    highRiskPatients:
      predictions.filter(
        (p) => p.riskLevel === 'high' || p.riskLevel === 'critical',
      ).length * SCALE.riskAssessments,
    pendingRecommendations:
      recommendations.filter((r) => r.status === 'pending').length *
      SCALE.recommendations,
    activeCopilotSessions:
      sessions.filter(
        (s) => new Date(s.lastMessageAt).getTime() > Date.now() - 86400000,
      ).length * 50,
    modelAccuracy: Math.round(
      (models.reduce((s, m) => s + m.accuracy, 0) /
        Math.max(models.length, 1)) *
        100,
    ),
    alertsOpen: alerts.filter((a) => !a.acknowledged).length * SCALE.alerts,
    predictionTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
      (label, i) => ({
        label,
        value:
          Math.round(predictions.length / 7 + i * (predictions.length / 20)) *
          SCALE.predictions,
      }),
    ),
    riskDistribution: ['low', 'moderate', 'high', 'critical'].map((label) => ({
      label,
      value:
        predictions.filter((p) => p.riskLevel === label).length *
        SCALE.predictions,
    })),
    recentAlerts: [...alerts].filter((a) => !a.acknowledged).slice(0, 5),
  };
}
