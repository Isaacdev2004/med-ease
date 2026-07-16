/** FHIR / interoperability mapper stubs for workflow audit trails. */
export function toFhirProvenance(instanceId: string, actorId: string, action: string) {
  return {
    resourceType: 'Provenance',
    target: [{ reference: `WorkflowInstance/${instanceId}` }],
    activity: { coding: [{ code: action }] },
    agent: [{ who: { reference: `Practitioner/${actorId}` } }],
  };
}

export function toFhirAuditEvent(action: string, outcome: string) {
  return { resourceType: 'AuditEvent', action, outcome };
}
