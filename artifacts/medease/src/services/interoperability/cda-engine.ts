import type { CdaDocument } from '@/services/interoperability/types';

export function validateCdaDocument(doc: CdaDocument): boolean {
  return Boolean(doc.patientId && doc.type && doc.author);
}

export const CDA_TYPES = [
  'CCD',
  'C-CDA',
  'Discharge Summary',
  'Referral',
] as const;
