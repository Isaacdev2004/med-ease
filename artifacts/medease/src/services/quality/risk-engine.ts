import type { Risk } from '@/services/quality/types';

export function calculateRiskScore(likelihood: number, impact: number): number {
  return likelihood * impact;
}

export function riskLevelFromScore(score: number): Risk['level'] {
  if (score >= 20) return 'extreme';
  if (score >= 12) return 'high';
  if (score >= 6) return 'medium';
  return 'low';
}

export function assessRisk(
  likelihood: number,
  impact: number,
): Pick<Risk, 'riskScore' | 'level'> {
  const riskScore = calculateRiskScore(likelihood, impact);
  return { riskScore, level: riskLevelFromScore(riskScore) };
}

export function buildHeatMapData(
  risks: Risk[],
): { label: string; likelihood: number; impact: number; count: number }[] {
  const cells = new Map<
    string,
    { label: string; likelihood: number; impact: number; count: number }
  >();
  for (const r of risks) {
    const key = `${r.category}-${r.likelihood}-${r.impact}`;
    const cur = cells.get(key) ?? {
      label: r.category,
      likelihood: r.likelihood,
      impact: r.impact,
      count: 0,
    };
    cur.count += 1;
    cells.set(key, cur);
  }
  return [...cells.values()].slice(0, 12);
}

export function mitigationDue(risk: Risk): boolean {
  return (
    new Date(risk.reviewDate) <= new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  );
}
