import type { CapaRecord } from '@/services/quality/types';

export function canCloseCapa(capa: CapaRecord): boolean {
  return (
    capa.status === 'effectiveness_review' &&
    (capa.effectivenessScore ?? 0) >= 80
  );
}

export function capaCompletionRate(records: CapaRecord[]): number {
  if (!records.length) return 100;
  return Math.round(
    (records.filter((c) => c.status === 'closed').length / records.length) *
      100,
  );
}

export function nextCapaStatus(
  current: CapaRecord['status'],
): CapaRecord['status'] {
  const flow: CapaRecord['status'][] = [
    'open',
    'in_progress',
    'verification',
    'effectiveness_review',
    'closed',
  ];
  const idx = flow.indexOf(current);
  return flow[Math.min(idx + 1, flow.length - 1)]!;
}
