import type { Broadcast, BroadcastStatus } from '@/services/messaging/types';

export function broadcastsTodayCount(broadcasts: Broadcast[]): number {
  const today = new Date().toDateString();
  return broadcasts.filter(
    (b) => b.sentAt && new Date(b.sentAt).toDateString() === today,
  ).length;
}

export function broadcastReachRate(broadcast: Broadcast): number {
  if (broadcast.recipientCount === 0) return 0;
  return Math.round(
    (broadcast.deliveredCount / broadcast.recipientCount) * 100,
  );
}

export function nextBroadcastStatus(
  action: 'send' | 'cancel',
): BroadcastStatus {
  return action === 'send' ? 'sent' : 'cancelled';
}

export function scheduledBroadcastCount(broadcasts: Broadcast[]): number {
  return broadcasts.filter((b) => b.status === 'scheduled').length;
}
