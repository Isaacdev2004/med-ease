import type { RiskScore, RiskScoreType, RiskTier } from '@/services/population-health/types';
import { stratifyRisk } from '@/services/population-health/care-gap-engine';

export function calculateCharlson(age: number, comorbidities: number): number {
  return Math.min(10, Math.floor(age / 10) + comorbidities);
}

export function calculateLACE(lengthOfStay: number, acuity: number, comorbidities: number, edVisits: number): number {
  return Math.min(19, lengthOfStay + acuity + comorbidities + edVisits);
}

export function assessRiskScore(type: RiskScoreType, raw: number): { score: number; tier: RiskTier } {
  const normalized = Math.min(10, Math.max(1, raw));
  return { score: normalized, tier: stratifyRisk(normalized) };
}

export function aggregateRiskDistribution(scores: RiskScore[]): { label: string; value: number }[] {
  const tiers: RiskTier[] = ['high', 'rising', 'moderate', 'low'];
  return tiers.map((tier) => ({ label: tier, value: scores.filter((s) => s.tier === tier).length }));
}
