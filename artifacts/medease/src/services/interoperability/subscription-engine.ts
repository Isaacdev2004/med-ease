import type { Subscription } from '@/services/interoperability/types';

export function filterActiveSubscriptions(subs: Subscription[]): Subscription[] {
  return subs.filter((s) => s.status === 'active');
}

export function buildWebhookPayload(eventType: string, resourceId: string): Record<string, string> {
  return { event: eventType, resourceId, timestamp: new Date().toISOString() };
}
