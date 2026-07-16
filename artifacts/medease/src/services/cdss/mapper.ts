import type { ClinicalAlert, Guideline, OrderSet } from '@/services/cdss/types';

export function toGuidanceResponse(alert: ClinicalAlert) {
  return {
    resourceType: 'GuidanceResponse',
    id: alert.alertId,
    status: alert.status,
    subject: { reference: `Patient/${alert.patientId}` },
    reasonCode: [{ text: alert.title }],
  };
}

export function toPlanDefinition(orderSet: OrderSet) {
  return {
    resourceType: 'PlanDefinition',
    id: orderSet.orderSetId,
    title: orderSet.name,
    status: 'active',
    type: { text: orderSet.category },
  };
}

export function toLibrary(guideline: Guideline) {
  return {
    resourceType: 'Library',
    id: guideline.guidelineId,
    title: guideline.title,
    status: guideline.status,
    publisher: guideline.source.toUpperCase(),
  };
}

export function toDetectedIssue(alert: ClinicalAlert) {
  return {
    resourceType: 'DetectedIssue',
    id: alert.alertId,
    status: alert.status,
    severity: alert.severity,
    detail: alert.message,
  };
}
