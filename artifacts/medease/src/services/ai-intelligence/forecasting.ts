import type { ForecastType, OperationalForecast } from '@/services/ai-intelligence/types';

export const FORECAST_TYPES: ForecastType[] = ['resource', 'bed_occupancy', 'operating_room', 'financial'];

export const FORECAST_LABELS: Record<ForecastType, string> = {
  resource: 'Resource Utilization',
  bed_occupancy: 'Bed Occupancy',
  operating_room: 'OR Demand',
  financial: 'Financial Forecast',
};

export function buildForecastTrend(baseValue: number, horizonDays: number): { label: string; value: number }[] {
  const points = Math.min(horizonDays, 14);
  return Array.from({ length: points }, (_, i) => ({
    label: `D+${i + 1}`,
    value: Math.round(baseValue * (1 + (i % 3 === 0 ? 0.05 : -0.02) * (i / points))),
  }));
}

export function forecastAccuracy(forecasts: OperationalForecast[]): number {
  if (forecasts.length === 0) return 0;
  const avgConfidence = forecasts.reduce((s, f) => {
    const spread = f.confidenceInterval.upper - f.confidenceInterval.lower;
    return s + (1 - spread / Math.max(f.predictedValue, 1));
  }, 0);
  return Math.round((avgConfidence / forecasts.length) * 100);
}

export function toFhirMeasureReport(forecast: OperationalForecast) {
  return {
    resourceType: 'MeasureReport',
    id: forecast.forecastId,
    status: 'complete',
    type: 'summary',
    measure: forecast.metric,
    date: forecast.generatedAt,
    group: [{ measureScore: { value: forecast.predictedValue } }],
  };
}
