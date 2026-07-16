import type { ConsentRecord, ConsentStatus } from '@/services/research/types';

export function validateConsentVersion(current: string, required: string): boolean {
  return current === required;
}

export function canSignConsent(status: ConsentStatus): boolean {
  return status === 'pending' || status === 'expired';
}

export function buildEconsentPayload(consent: ConsentRecord) {
  return {
    resourceType: 'Consent',
    id: consent.consentId,
    status: consent.status === 'signed' ? 'active' : 'draft',
    scope: { coding: [{ code: 'research' }] },
    dateTime: consent.signedAt,
    provision: { type: 'permit', period: { start: consent.signedAt } },
  };
}
