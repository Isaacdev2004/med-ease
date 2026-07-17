import type { InfectionRecord } from '@/services/quality/types';

export function infectionRatePer1000(
  records: InfectionRecord[],
  patientDays = 10000,
): number {
  return Math.round((records.length / patientDays) * 1000 * 100) / 100;
}

export function outbreakClusters(
  records: InfectionRecord[],
): { outbreakId: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of records) {
    if (!r.outbreakId) continue;
    map.set(r.outbreakId, (map.get(r.outbreakId) ?? 0) + 1);
  }
  return [...map.entries()].map(([outbreakId, count]) => ({
    outbreakId,
    count,
  }));
}

export function isolationCompliance(records: InfectionRecord[]): number {
  if (!records.length) return 100;
  return Math.round(
    (records.filter((r) => r.isolated).length / records.length) * 100,
  );
}
