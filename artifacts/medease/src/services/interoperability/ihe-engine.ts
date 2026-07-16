import type { IheProfile } from '@/services/interoperability/types';

export const IHE_PROFILES: IheProfile[] = ['XDS', 'XCA', 'PIX', 'PDQ', 'XCPD', 'ATNA', 'BPPC'];

export function getIheProfileDescription(profile: IheProfile): string {
  const descriptions: Record<IheProfile, string> = {
    XDS: 'Cross-Enterprise Document Sharing',
    XCA: 'Cross-Community Access',
    PIX: 'Patient Identifier Cross-Reference',
    PDQ: 'Patient Demographics Query',
    XCPD: 'Cross-Community Patient Discovery',
    ATNA: 'Audit Trail and Node Authentication',
    BPPC: 'Basic Patient Privacy Consents',
  };
  return descriptions[profile];
}
