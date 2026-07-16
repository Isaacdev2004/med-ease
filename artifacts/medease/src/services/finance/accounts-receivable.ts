import type { CustomerReceivable } from '@/services/finance/types';

export function calculateARAging(receivables: CustomerReceivable[]): { bucket: string; amount: number; count: number }[] {
  const buckets = [
    { bucket: '0-30', min: 0, max: 30 },
    { bucket: '31-60', min: 31, max: 60 },
    { bucket: '61-90', min: 61, max: 90 },
    { bucket: '90+', min: 91, max: Infinity },
  ];
  return buckets.map(({ bucket, min, max }) => {
    const items = receivables.filter((r) => r.agingDays >= min && r.agingDays <= max && r.outstanding > 0);
    return { bucket, amount: items.reduce((s, r) => s + r.outstanding, 0), count: items.length };
  });
}

export function collectionRate(receivables: CustomerReceivable[]): number {
  if (!receivables.length) return 100;
  const collected = receivables.filter((r) => r.status === 'paid').length;
  return Math.round((collected / receivables.length) * 100);
}

export function badDebtProvision(receivables: CustomerReceivable[], thresholdDays = 90): number {
  return receivables.filter((r) => r.agingDays > thresholdDays).reduce((s, r) => s + r.outstanding * 0.5, 0);
}
