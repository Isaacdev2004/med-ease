import type { TrustedDevice } from '@/services/iam/types';

export function computeTrustScore(device: TrustedDevice): number {
  const ageDays =
    (Date.now() - new Date(device.registeredAt).getTime()) / 86400000;
  return Math.min(100, Math.round(device.trustScore + ageDays * 0.5));
}

export function isDeviceTrusted(score: number): boolean {
  return score >= 70;
}
