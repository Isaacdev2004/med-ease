import type { ConsentRecord } from '@/services/iam/types';

export function isConsentValid(consent: ConsentRecord): boolean {
  if (consent.status !== 'active') return false;
  if (consent.expiresAt && new Date(consent.expiresAt).getTime() < Date.now()) return false;
  return true;
}

export function consentComplianceRate(consents: ConsentRecord[]): number {
  if (consents.length === 0) return 100;
  const valid = consents.filter(isConsentValid).length;
  return Math.round((valid / consents.length) * 100);
}

export function toFhirConsent(consent: ConsentRecord) {
  return {
    resourceType: 'Consent',
    id: consent.consentId,
    status: consent.status === 'active' ? 'active' : 'inactive',
    patient: { reference: `Patient/${consent.patientId}` },
    dateTime: consent.grantedAt,
    provision: { type: 'permit', purpose: [{ text: consent.purpose }] },
  };
}
