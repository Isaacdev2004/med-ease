import type {
  ProtocolDeviation,
  DeviationStatus,
} from '@/services/research/types';

export function computeComplianceRate(
  totalVisits: number,
  deviations: number,
): number {
  if (totalVisits === 0) return 100;
  return Math.max(0, Math.round(100 - (deviations / totalVisits) * 100));
}

export function canCloseDeviation(deviation: ProtocolDeviation): boolean {
  return deviation.status === 'open' || deviation.status === 'under_review';
}

export function deviationSeverityWeight(
  severity: ProtocolDeviation['severity'],
): number {
  return { minor: 1, major: 3, critical: 5 }[severity];
}

export function aggregateDeviationStatus(
  items: ProtocolDeviation[],
): DeviationStatus {
  if (items.some((d) => d.status === 'open')) return 'open';
  if (items.some((d) => d.status === 'under_review')) return 'under_review';
  return 'closed';
}
