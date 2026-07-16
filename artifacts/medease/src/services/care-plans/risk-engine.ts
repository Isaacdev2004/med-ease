import type { RiskAssessment, RiskSeverity } from '@/services/care-plans/types';

const SEVERITY_ORDER: Record<RiskSeverity, number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export function computeOverallRisk(risks: RiskAssessment[]): RiskSeverity {
  if (!risks.length) return 'low';
  let max: RiskSeverity = 'low';
  for (const r of risks) {
    if (SEVERITY_ORDER[r.severity] > SEVERITY_ORDER[max]) max = r.severity;
  }
  return max;
}

export function getRiskSeverityColor(severity: RiskSeverity): string {
  const colors: Record<RiskSeverity, string> = {
    low: 'var(--success)',
    moderate: 'var(--warning)',
    high: 'var(--destructive)',
    critical: '#7f1d1d',
  };
  return colors[severity];
}

export function filterActiveRisks(risks: RiskAssessment[]) {
  return risks.filter((r) => r.active);
}
