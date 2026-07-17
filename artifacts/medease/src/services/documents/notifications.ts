export function notifyDocumentShared(documentId: string, recipientId: string) {
  return {
    type: 'document_shared',
    documentId,
    recipientId,
    sentAt: new Date().toISOString(),
  };
}

export function notifySignatureRequested(requestId: string, signerId: string) {
  return {
    type: 'signature_requested',
    requestId,
    signerId,
    sentAt: new Date().toISOString(),
  };
}
