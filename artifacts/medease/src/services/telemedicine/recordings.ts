import type { SessionRecording } from '@/services/telemedicine/types';

export function startRecording(
  sessionId: string,
  consentGiven: boolean,
): SessionRecording {
  return {
    id: `rec-${Date.now()}`,
    sessionId,
    consentGiven,
    status: consentGiven ? 'recording' : 'pending_consent',
    retentionDays: 90,
    startedAt: new Date().toISOString(),
  };
}

export function stopRecording(recording: SessionRecording): SessionRecording {
  return {
    ...recording,
    status: 'processing',
    stoppedAt: new Date().toISOString(),
    durationSeconds: recording.startedAt
      ? Math.round(
          (Date.now() - new Date(recording.startedAt).getTime()) / 1000,
        )
      : 0,
  };
}

export function generateTranscript(sessionId: string): string {
  return `Transcript for session ${sessionId}: Consultation summary and key discussion points.`;
}
