/** FHIR mapper stubs for document interoperability. */
export function toFhirDocumentReference(documentId: string, title: string, patientId?: string) {
  return {
    resourceType: 'DocumentReference',
    id: documentId,
    status: 'current',
    description: title,
    subject: patientId ? { reference: `Patient/${patientId}` } : undefined,
  };
}

export function toFhirBinary(documentId: string, contentType: string) {
  return { resourceType: 'Binary', id: documentId, contentType };
}

export function toFhirMedia(documentId: string, type: string) {
  return { resourceType: 'Media', id: documentId, type };
}

export function toFhirProvenance(documentId: string, actorId: string) {
  return {
    resourceType: 'Provenance',
    target: [{ reference: `DocumentReference/${documentId}` }],
    agent: [{ who: { reference: `Practitioner/${actorId}` } }],
  };
}
