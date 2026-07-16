import type { ExecutiveForecast, ForecastHorizon } from '@/services/executive/types';

export const FORECAST_HORIZONS: ForecastHorizon[] = ['30d', '90d', '180d', '365d'];

export function buildForecastTrend(baseValue: number, points = 6): { label: string; value: number }[] {
  return Array.from({ length: points }, (_, i) => ({
    label: `M${i + 1}`,
    value: Math.round(baseValue * (1 + (i % 2 === 0 ? 0.03 : -0.01) * i)),
  }));
}

export function forecastAccuracy(forecasts: ExecutiveForecast[]): number {
  if (forecasts.length === 0) return 0;
  const avg = forecasts.reduce((s, f) => {
    const spread = f.confidenceInterval.upper - f.confidenceInterval.lower;
    return s + (1 - spread / Math.max(f.predictedValue, 1));
  }, 0);
  return Math.round((avg / forecasts.length) * 100);
}
