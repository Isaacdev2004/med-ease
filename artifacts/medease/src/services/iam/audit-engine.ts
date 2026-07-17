import type { IamAuditEvent } from '@/services/iam/types';

export function auditSuccessRate(events: IamAuditEvent[]): number {
  if (events.length === 0) return 100;
  const success = events.filter((e) => e.outcome === 'success').length;
  return Math.round((success / events.length) * 100);
}

export function toFhirAuditEvent(event: IamAuditEvent) {
  return {
    resourceType: 'AuditEvent',
    id: event.auditId,
    type: { text: event.action },
    recorded: event.timestamp,
    outcome: event.outcome,
    agent: [{ who: { reference: `Practitioner/${event.actorId}` } }],
    entity: [
      { what: { reference: `${event.resourceType}/${event.resourceId}` } },
    ],
  };
}

export function toFhirProvenance(resourceId: string, actorId: string) {
  return {
    resourceType: 'Provenance',
    target: [{ reference: resourceId }],
    recorded: new Date().toISOString(),
    agent: [{ who: { reference: `Practitioner/${actorId}` } }],
  };
}
