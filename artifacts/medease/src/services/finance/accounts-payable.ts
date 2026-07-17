import type { VendorBill } from '@/services/finance/types';

export function threeWayMatch(bill: VendorBill): {
  matched: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  if (!bill.purchaseOrderId) issues.push('Missing purchase order');
  if (!bill.receiptId) issues.push('Missing goods receipt');
  if (bill.status === 'overdue') issues.push('Bill is overdue');
  return { matched: issues.length === 0 && bill.matched, issues };
}

export function calculateAPAging(
  bills: VendorBill[],
): { bucket: string; amount: number; count: number }[] {
  const buckets = [
    { bucket: '0-30', min: 0, max: 30 },
    { bucket: '31-60', min: 31, max: 60 },
    { bucket: '61-90', min: 61, max: 90 },
    { bucket: '90+', min: 91, max: Infinity },
  ];
  return buckets.map(({ bucket, min, max }) => {
    const items = bills.filter(
      (b) => b.agingDays >= min && b.agingDays <= max && b.status !== 'paid',
    );
    return {
      bucket,
      amount: items.reduce((s, b) => s + b.totalAmount, 0),
      count: items.length,
    };
  });
}

export function paymentRunTotal(bills: VendorBill[], maxDate?: string): number {
  const cutoff = maxDate ?? new Date().toISOString().split('T')[0]!;
  return bills
    .filter((b) => b.status === 'open' && b.dueDate <= cutoff)
    .reduce((s, b) => s + b.totalAmount, 0);
}
