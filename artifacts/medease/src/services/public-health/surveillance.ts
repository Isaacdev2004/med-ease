import type { CaseStatus, DiseaseCase } from '@/services/public-health/types';

export const REPORTABLE_DISEASES = ['Influenza', 'COVID-19', 'Tuberculosis', 'Measles', 'Hepatitis A', 'Salmonella', 'Legionella', 'West Nile Virus', 'Lyme Disease'];

export function isReportable(disease: string): boolean {
  return REPORTABLE_DISEASES.includes(disease);
}

export function requiresInvestigation(caseRecord: DiseaseCase): boolean {
  return caseRecord.status === 'confirmed' || caseRecord.status === 'probable';
}

export function casePriority(status: CaseStatus): number {
  return { suspected: 2, probable: 3, confirmed: 4, ruled_out: 0, closed: 0 }[status];
}

export function toFhirCondition(caseRecord: DiseaseCase) {
  return {
    resourceType: 'Condition',
    id: caseRecord.caseId,
    clinicalStatus: { coding: [{ code: caseRecord.status }] },
    code: { coding: [{ system: 'http://hl7.org/fhir/sid/icd-10', code: caseRecord.icd10Code, display: caseRecord.disease }] },
    subject: { reference: `Patient/${caseRecord.patientId}` },
    recordedDate: caseRecord.reportedAt,
  };
}
