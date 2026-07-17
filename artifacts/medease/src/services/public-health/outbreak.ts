import type {
  OutbreakInvestigation,
  OutbreakStatus,
} from '@/services/public-health/types';

export function canResolveOutbreak(outbreak: OutbreakInvestigation): boolean {
  return (
    outbreak.status === 'containment' || outbreak.status === 'investigation'
  );
}

export function outbreakSeverity(
  caseCount: number,
): 'low' | 'moderate' | 'high' | 'critical' {
  if (caseCount >= 50) return 'critical';
  if (caseCount >= 20) return 'high';
  if (caseCount >= 5) return 'moderate';
  return 'low';
}

export function nextOutbreakStatus(
  current: OutbreakStatus,
): OutbreakStatus | null {
  const flow: OutbreakStatus[] = [
    'monitoring',
    'investigation',
    'containment',
    'resolved',
  ];
  const idx = flow.indexOf(current);
  return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1]! : null;
}
