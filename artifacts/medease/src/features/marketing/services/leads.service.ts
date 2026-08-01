import { getApiBaseUrl } from '@/services/api/configure-api-client';
import type { CtaFormId } from '@/features/marketing/content/cta-forms';

export interface MarketingLeadPayload {
  ctaId: CtaFormId;
  fields: Record<string, string | string[]>;
}

export async function submitMarketingLead(
  payload: MarketingLeadPayload,
): Promise<void> {
  const base = getApiBaseUrl().replace(/\/$/, '');

  if (base) {
    const response = await fetch(`${base}/api/marketing/leads`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('lead_submit_failed');
    }
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 600));
}
