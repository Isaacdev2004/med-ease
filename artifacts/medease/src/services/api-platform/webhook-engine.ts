import type { DeliveryStatus, Webhook, WebhookDelivery } from '@/services/api-platform/types';

export function nextDeliveryStatus(current: DeliveryStatus, action: 'deliver' | 'fail' | 'retry'): DeliveryStatus {
  if (action === 'deliver') return 'delivered';
  if (action === 'retry') return 'retrying';
  return 'failed';
}

export function canDeliverWebhook(webhook: Webhook): boolean {
  return webhook.status === 'active';
}

export function webhookSuccessRate(deliveries: WebhookDelivery[]): number {
  if (deliveries.length === 0) return 100;
  const delivered = deliveries.filter((d) => d.status === 'delivered').length;
  return Math.round((delivered / deliveries.length) * 100);
}

export function pendingDeliveryCount(deliveries: WebhookDelivery[]): number {
  return deliveries.filter((d) => d.status === 'pending' || d.status === 'retrying').length;
}

export function buildWebhookSignature(secret: string, payload: string): string {
  return `sha256=${secret.slice(0, 8)}${payload.length}`;
}
