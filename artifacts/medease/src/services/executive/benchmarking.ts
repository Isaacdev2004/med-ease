import type { BenchmarkReport } from '@/services/executive/types';

export function computePercentile(internalValue: number, peerAverage: number, nationalBenchmark: number): number {
  const max = Math.max(internalValue, peerAverage, nationalBenchmark, 1);
  return Math.min(99, Math.round((internalValue / max) * 100));
}

export function averagePercentile(reports: BenchmarkReport[]): number {
  if (reports.length === 0) return 0;
  return Math.round(reports.reduce((s, r) => s + r.percentile, 0) / reports.length);
}

export function benchmarkStatus(percentile: number): 'leading' | 'average' | 'lagging' {
  if (percentile >= 75) return 'leading';
  if (percentile >= 40) return 'average';
  return 'lagging';
}
