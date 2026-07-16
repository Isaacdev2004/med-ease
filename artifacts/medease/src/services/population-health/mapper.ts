import type { CareGap, DiseaseRegistry, PatientCohort, PopulationMember } from '@/services/population-health/types';

export function toFhirGroup(cohort: PatientCohort) {
  return {
    resourceType: 'Group',
    id: cohort.cohortId,
    type: cohort.dynamic ? 'person' : 'person',
    actual: true,
    name: cohort.name,
    quantity: cohort.memberCount,
  };
}

export function toFhirMeasureReport(registry: DiseaseRegistry) {
  return {
    resourceType: 'MeasureReport',
    id: `mr-${registry.registryId}`,
    status: 'complete',
    type: 'summary',
    measure: registry.name,
    group: [{ measureScore: { value: registry.complianceRate } }],
  };
}

export function toFhirRiskAssessment(member: PopulationMember) {
  return {
    resourceType: 'RiskAssessment',
    id: `ra-${member.memberId}`,
    status: 'final',
    subject: { reference: `Patient/${member.patientId}` },
    prediction: [{ outcome: { text: member.riskTier } }],
  };
}

export function toFhirDetectedIssue(gap: CareGap) {
  return {
    resourceType: 'DetectedIssue',
    id: gap.gapId,
    status: gap.status === 'closed' ? 'resolved' : 'final',
    code: { text: gap.title },
    patient: { reference: `Patient/${gap.patientId}` },
  };
}
