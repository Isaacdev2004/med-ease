import type { DeliveryRecord, MessageStatus } from '@/services/messaging/types';

export function pendingDeliveryCount(deliveries: DeliveryRecord[]): number {
  return deliveries.filter((d) => d.status === 'queued' || d.status === 'sent').length;
}

export function deliverySuccessRate(deliveries: DeliveryRecord[]): number {
  if (deliveries.length === 0) return 0;
  const success = deliveries.filter((d) => d.status === 'delivered' || d.status === 'read').length;
  return Math.round((success / deliveries.length) * 100);
}

export function avgDeliveryTimeMs(deliveries: DeliveryRecord[]): number {
  const completed = deliveries.filter((d) => d.deliveredAt);
  if (completed.length === 0) return 0;
  const total = completed.reduce((sum, d) => {
    const start = new Date(d.lastAttemptAt).getTime();
    const end = new Date(d.deliveredAt!).getTime();
    return sum + (end - start);
  }, 0);
  return Math.round(total / completed.length);
}

export function nextDeliveryStatus(attempts: number): MessageStatus {
  return attempts >= 3 ? 'failed' : 'queued';
}

export function bounceRate(deliveries: DeliveryRecord[]): number {
  if (deliveries.length === 0) return 0;
  const bounced = deliveries.filter((d) => d.status === 'bounced' || d.status === 'failed').length;
  return Math.round((bounced / deliveries.length) * 100);
}
