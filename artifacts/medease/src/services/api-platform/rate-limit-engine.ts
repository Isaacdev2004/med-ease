import type { RateLimitPolicy } from '@/services/api-platform/types';

export function isRateLimitExceeded(currentCount: number, policy: RateLimitPolicy): boolean {
  if (!policy.enabled) return false;
  return currentCount >= policy.requestsPerMinute;
}

export function computeBurstRemaining(currentCount: number, policy: RateLimitPolicy): number {
  return Math.max(0, policy.burstLimit - currentCount);
}

export function rateLimitUtilization(currentCount: number, policy: RateLimitPolicy): number {
  if (policy.requestsPerMinute === 0) return 0;
  return Math.min(100, Math.round((currentCount / policy.requestsPerMinute) * 100));
}

export function activeRateLimitPolicies(policies: RateLimitPolicy[]): number {
  return policies.filter((p) => p.enabled).length;
}
