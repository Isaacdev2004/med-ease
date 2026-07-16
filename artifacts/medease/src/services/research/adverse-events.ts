import type { AdverseEvent, AdverseEventSeverity } from '@/services/research/types';

export function isSeriousAdverseEvent(event: AdverseEvent): boolean {
  return event.serious || ['life_threatening', 'fatal'].includes(event.severity);
}

export function requiresDsmbReview(event: AdverseEvent): boolean {
  return isSeriousAdverseEvent(event) && event.status !== 'closed';
}

export function severityRank(severity: AdverseEventSeverity): number {
  return { mild: 1, moderate: 2, severe: 3, life_threatening: 4, fatal: 5 }[severity];
}

export function toFhirAdverseEvent(event: AdverseEvent) {
  return {
    resourceType: 'AdverseEvent',
    id: event.eventId,
    actuality: 'actual',
    category: [{ coding: [{ code: event.serious ? 'product-problem' : 'medication-mistake' }] }],
    seriousness: { coding: [{ code: event.severity }] },
    subject: { reference: `Patient/${event.participantId}` },
    recordedDate: event.reportedAt,
  };
}
