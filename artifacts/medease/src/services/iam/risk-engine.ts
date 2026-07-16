import type { LoginAttempt, RiskScore } from '@/services/iam/types';

export function computeRiskScore(factors: string[], baseScore = 0.3): number {
  return Math.min(1, Math.round((baseScore + factors.length * 0.1) * 100) / 100);
}

export function riskLevel(score: number): RiskScore['level'] {
  if (score >= 0.8) return 'critical';
  if (score >= 0.6) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}

export function failedLoginRisk(attempts: LoginAttempt[]): number {
  const recent = attempts.filter((a) => !a.success && Date.now() - new Date(a.attemptedAt).getTime() < 86400000);
  return Math.min(1, recent.length * 0.15);
}
