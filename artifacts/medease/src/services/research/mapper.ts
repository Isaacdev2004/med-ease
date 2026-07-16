import type { ClinicalTrial, ResearchParticipant } from '@/services/research/types';
import { toFhirResearchStudy } from '@/services/research/clinical-trials';
import { toFhirAdverseEvent } from '@/services/research/adverse-events';
import { toFhirSpecimen } from '@/services/research/biospecimens';
import { toFhirCitation } from '@/services/research/publications';
import { buildEconsentPayload } from '@/services/research/consent';
import type { AdverseEvent, Biospecimen, ConsentRecord, Publication } from '@/services/research/types';

export function toFhirResearchSubject(participant: ResearchParticipant, trial: ClinicalTrial) {
  return {
    resourceType: 'ResearchSubject',
    id: participant.participantId,
    status: participant.status === 'enrolled' || participant.status === 'active' ? 'on-study' : 'off-study',
    study: { reference: `ResearchStudy/${trial.trialId}` },
    individual: { reference: `Patient/${participant.patientId}` },
  };
}

export function mapTrialBundle(trial: ClinicalTrial) {
  return { researchStudy: toFhirResearchStudy(trial) };
}

export function mapParticipantBundle(participant: ResearchParticipant, trial: ClinicalTrial) {
  return { researchSubject: toFhirResearchSubject(participant, trial) };
}

export function mapConsentToFhir(consent: ConsentRecord) {
  return buildEconsentPayload(consent);
}

export function mapAdverseEventToFhir(event: AdverseEvent) {
  return toFhirAdverseEvent(event);
}

export function mapSpecimenToFhir(specimen: Biospecimen) {
  return toFhirSpecimen(specimen);
}

export function mapPublicationToFhir(pub: Publication) {
  return toFhirCitation(pub);
}
