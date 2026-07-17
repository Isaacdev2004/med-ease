import type { QualityIndicator } from '@/services/quality/types';

export function indicatorsOnTarget(indicators: QualityIndicator[]): number {
  if (!indicators.length) return 100;
  return Math.round(
    (indicators.filter((i) => i.value <= i.target).length / indicators.length) *
      100,
  );
}

export function summarizeIndicators(
  indicators: QualityIndicator[],
): { label: string; value: number }[] {
  return indicators
    .slice(0, 12)
    .map((i) => ({ label: i.name, value: i.value }));
}
