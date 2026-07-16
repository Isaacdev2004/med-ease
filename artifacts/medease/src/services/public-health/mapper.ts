import { toFhirCondition } from '@/services/public-health/surveillance';
import { toFhirImmunization } from '@/services/public-health/immunization';
import { toFhirRelatedPerson } from '@/services/public-health/contact-tracing';
import { toFhirQuestionnaireResponse } from '@/services/public-health/sdoh';
import type { ContactTracingRecord, DiseaseCase, ImmunizationRecord, SdohAssessment } from '@/services/public-health/types';

export function mapCaseToFhir(caseRecord: DiseaseCase) {
  return toFhirCondition(caseRecord);
}

export function mapImmunizationToFhir(record: ImmunizationRecord) {
  return toFhirImmunization(record);
}

export function mapContactToFhir(contact: ContactTracingRecord) {
  return toFhirRelatedPerson(contact);
}

export function mapSdohToFhir(assessment: SdohAssessment) {
  return toFhirQuestionnaireResponse(assessment);
}

export function mapOutbreakToFhirGroup(outbreakId: string, memberIds: string[]) {
  return {
    resourceType: 'Group',
    id: outbreakId,
    type: 'person',
    actual: true,
    member: memberIds.map((id) => ({ entity: { reference: `Patient/${id}` } })),
  };
}
