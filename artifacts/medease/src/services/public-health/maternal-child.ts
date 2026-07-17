import type {
  MaternalRecord,
  ChildHealthRecord,
} from '@/services/public-health/types';

export function maternalRiskScore(record: MaternalRecord): number {
  const base = { low: 1, moderate: 3, high: 5 }[record.riskLevel];
  return base + (record.gestationalWeeks < 12 ? 1 : 0);
}

export function childNeedsReferral(record: ChildHealthRecord): boolean {
  return (
    record.wellnessStatus === 'referral_needed' || !record.immunizationUpToDate
  );
}
