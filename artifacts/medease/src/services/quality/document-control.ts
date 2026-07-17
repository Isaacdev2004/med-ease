import type { PolicyDocument } from '@/services/quality/types';

export function policyComplianceRate(policies: PolicyDocument[]): number {
  if (!policies.length) return 100;
  const compliant = policies.filter(
    (p) => p.status === 'published' || p.status === 'approved',
  ).length;
  return Math.round((compliant / policies.length) * 100);
}

export function policiesDueForReview(
  policies: PolicyDocument[],
  withinDays = 30,
): PolicyDocument[] {
  const cutoff = Date.now() + withinDays * 24 * 60 * 60 * 1000;
  return policies.filter((p) => new Date(p.reviewDate).getTime() <= cutoff);
}

export function expiredPolicies(policies: PolicyDocument[]): PolicyDocument[] {
  return policies.filter(
    (p) =>
      p.status === 'expired' ||
      (p.expiryDate && new Date(p.expiryDate) < new Date()),
  );
}
