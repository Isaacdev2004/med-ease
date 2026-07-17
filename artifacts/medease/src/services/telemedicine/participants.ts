import type { VideoParticipant } from '@/services/telemedicine/types';

export function inviteParticipant(
  sessionId: string,
  name: string,
  role: VideoParticipant['role'],
): VideoParticipant {
  return {
    id: `part-inv-${Date.now()}`,
    sessionId,
    name,
    role,
    cameraOn: false,
    microphoneOn: false,
    screenSharing: false,
    connectionQuality: 'good',
    deviceType: 'unknown',
    browser: 'unknown',
    networkType: 'unknown',
    permissions: ['join'],
  };
}

export function removeParticipant(
  participant: VideoParticipant,
): VideoParticipant {
  return {
    ...participant,
    leftAt: new Date().toISOString(),
    connectionQuality: 'disconnected',
  };
}
