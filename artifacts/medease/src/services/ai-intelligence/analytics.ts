import type { AiAnalytics } from '@/services/ai-intelligence/types';
import { activeSessionCount } from '@/services/ai-intelligence/clinical-copilot';
import { forecastAccuracy } from '@/services/ai-intelligence/forecasting';
import { acceptanceRate } from '@/services/ai-intelligence/recommendation-engine';
import {
  MOCK_AI_ALERTS,
  MOCK_BIAS_METRICS,
  MOCK_COPILOT_SESSIONS,
  MOCK_FORECASTS,
  MOCK_MODEL_EVALUATIONS,
  MOCK_PREDICTIONS,
  MOCK_RECOMMENDATIONS,
  buildAiDashboard,
} from '@/services/ai-intelligence/mock-data';

export function computeAiAnalytics(facilityId?: string): AiAnalytics {
  const dashboard = buildAiDashboard(facilityId);
  const predictions = facilityId ? MOCK_PREDICTIONS.filter((p) => p.facilityId === facilityId) : MOCK_PREDICTIONS;
  const recommendations = facilityId ? MOCK_RECOMMENDATIONS.filter((r) => r.facilityId === facilityId) : MOCK_RECOMMENDATIONS;
  const sessions = facilityId ? MOCK_COPILOT_SESSIONS.filter((s) => s.facilityId === facilityId) : MOCK_COPILOT_SESSIONS;
  const forecasts = facilityId ? MOCK_FORECASTS.filter((f) => f.facilityId === facilityId) : MOCK_FORECASTS;
  const bias = MOCK_BIAS_METRICS.filter((b) => b.status !== 'within_threshold');
  const evaluations = MOCK_MODEL_EVALUATIONS.filter((e) => e.passed);

  return {
    predictionVolume: dashboard.activePredictions,
    recommendationAcceptanceRate: acceptanceRate(recommendations),
    copilotUsageHours: activeSessionCount(sessions) * 2.5,
    modelDriftScore: Math.round((MOCK_AI_ALERTS.filter((a) => a.type === 'model_drift').length / Math.max(MOCK_AI_ALERTS.length, 1)) * 100) / 100,
    biasAlerts: bias.length * 15,
    forecastAccuracy: forecastAccuracy(forecasts),
    predictionTrend: dashboard.predictionTrend,
    modelPerformance: ['Accuracy', 'Precision', 'Recall', 'F1', 'AUC'].map((label, i) => ({
      label,
      value: Math.round((evaluations.length / Math.max(MOCK_MODEL_EVALUATIONS.length, 1)) * 100 + i * 2),
    })),
    recommendationTrend: ['W1', 'W2', 'W3', 'W4'].map((label, i) => ({
      label,
      value: Math.round(recommendations.filter((r) => r.status === 'accepted').length / 4 + i * 20),
    })),
    usageByModule: [
      { label: 'Clinical', value: predictions.length * 100 },
      { label: 'Operations', value: forecasts.length * 30 },
      { label: 'Population Health', value: Math.round(predictions.length * 0.4) * 100 },
      { label: 'Research', value: Math.round(predictions.length * 0.15) * 100 },
      { label: 'Public Health', value: Math.round(predictions.length * 0.2) * 100 },
    ],
  };
}

export { buildAiDashboard };
