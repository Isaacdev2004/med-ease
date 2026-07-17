import type { Campaign, CampaignStatus } from '@/services/messaging/types';

export function activeCampaignCount(campaigns: Campaign[]): number {
  return campaigns.filter(
    (c) => c.status === 'running' || c.status === 'scheduled',
  ).length;
}

export function campaignOpenRate(campaigns: Campaign[]): number {
  if (campaigns.length === 0) return 0;
  const total = campaigns.reduce((sum, c) => sum + c.openRate, 0);
  return Math.round(total / campaigns.length);
}

export function nextCampaignStatus(
  action: 'start' | 'complete' | 'cancel',
): CampaignStatus {
  if (action === 'start') return 'running';
  if (action === 'complete') return 'completed';
  return 'cancelled';
}

export function campaignDeliveryRate(campaign: Campaign): number {
  if (campaign.sentCount === 0) return 0;
  return Math.round((campaign.deliveredCount / campaign.sentCount) * 100);
}
