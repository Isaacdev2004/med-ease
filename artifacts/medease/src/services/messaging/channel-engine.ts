import type { ChannelConfig, MessageChannel, MessageStatus } from '@/services/messaging/types';

export function channelHealthScore(channels: ChannelConfig[]): number {
  if (channels.length === 0) return 0;
  const weights = { healthy: 100, degraded: 60, offline: 0 };
  const total = channels.reduce((sum, c) => sum + weights[c.health], 0);
  return Math.round(total / channels.length);
}

export function enabledChannels(channels: ChannelConfig[]): MessageChannel[] {
  return channels.filter((c) => c.enabled).map((c) => c.channel);
}

export function channelCapacityRemaining(channel: ChannelConfig): number {
  return Math.max(0, channel.dailyLimit - channel.sentToday);
}

export function nextMessageStatus(action: 'send' | 'deliver' | 'read' | 'fail'): MessageStatus {
  if (action === 'send') return 'sent';
  if (action === 'deliver') return 'delivered';
  if (action === 'read') return 'read';
  return 'failed';
}

export function resolveChannelProvider(channel: MessageChannel): string {
  const providers: Record<MessageChannel, string> = {
    sms: 'Twilio',
    email: 'SendGrid',
    push: 'Firebase',
    whatsapp: 'Meta Business',
    teams: 'Microsoft Teams',
    slack: 'Slack',
    in_app: 'Med-Ease',
  };
  return providers[channel];
}
