export function recordConsent(sessionId: string, patientId: string, consented: boolean) {
  return {
    sessionId,
    patientId,
    consented,
    recordedAt: new Date().toISOString(),
    type: 'telemedicine_recording' as const,
  };
}

export function recordVisitConsent(sessionId: string, patientId: string) {
  return recordConsent(sessionId, patientId, true);
}
