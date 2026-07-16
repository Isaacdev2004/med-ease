import type { IncidentReport, PolicyDocument, Risk } from '@/services/quality/types';

export function toFhirAdverseEvent(incident: IncidentReport) {
  return {
    resourceType: 'AdverseEvent',
    id: incident.incidentId,
    actuality: incident.status === 'closed' ? 'actual' : 'potential',
    category: [{ text: incident.type }],
    severity: incident.severity,
    recordedDate: incident.reportedAt,
  };
}

export function toFhirRiskAssessment(risk: Risk) {
  return {
    resourceType: 'RiskAssessment',
    id: risk.riskId,
    status: risk.status === 'closed' ? 'final' : 'registered',
    code: { text: risk.title },
    occurrenceDateTime: risk.reviewDate,
  };
}

export function toFhirDocumentReference(policy: PolicyDocument) {
  return {
    resourceType: 'DocumentReference',
    id: policy.policyId,
    status: policy.status === 'published' ? 'current' : 'superseded',
    type: { text: policy.type },
    date: policy.effectiveDate,
    description: policy.contentSummary,
  };
}
