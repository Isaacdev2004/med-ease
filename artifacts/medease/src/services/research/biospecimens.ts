import type { Biospecimen, BiospecimenStatus } from '@/services/research/types';

export const SPECIMEN_TYPES = ['blood', 'plasma', 'serum', 'tissue', 'urine', 'saliva', 'csf', 'biopsy'];

export function canShipSpecimen(specimen: Biospecimen): boolean {
  return specimen.status === 'processed' || specimen.status === 'stored';
}

export function nextSpecimenStatus(current: BiospecimenStatus): BiospecimenStatus | null {
  const flow: BiospecimenStatus[] = ['collected', 'processed', 'stored', 'shipped', 'analyzed'];
  const idx = flow.indexOf(current);
  return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1]! : null;
}

export function toFhirSpecimen(specimen: Biospecimen) {
  return {
    resourceType: 'Specimen',
    id: specimen.specimenId,
    type: { coding: [{ code: specimen.type }] },
    subject: { reference: `Patient/${specimen.participantId}` },
    receivedTime: specimen.collectedAt,
    status: specimen.status === 'disposed' ? 'unavailable' : 'available',
  };
}
