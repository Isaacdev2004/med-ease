import type { VideoPlatform } from '@/services/telemedicine/types';

export interface VideoAdapter {
  platform: VideoPlatform;
  joinRoom(roomId: string, token: string): Promise<{ connected: boolean }>;
  leaveRoom(roomId: string): Promise<void>;
  toggleVideo(enabled: boolean): Promise<void>;
  toggleAudio(enabled: boolean): Promise<void>;
  startScreenShare(): Promise<void>;
  stopScreenShare(): Promise<void>;
}

function mockAdapter(platform: VideoPlatform): VideoAdapter {
  return {
    platform,
    async joinRoom() { return { connected: true }; },
    async leaveRoom() { /* mock */ },
    async toggleVideo() { /* mock */ },
    async toggleAudio() { /* mock */ },
    async startScreenShare() { /* mock */ },
    async stopScreenShare() { /* mock */ },
  };
}

const adapters: Record<VideoPlatform, VideoAdapter> = {
  webrtc: mockAdapter('webrtc'),
  twilio: mockAdapter('twilio'),
  agora: mockAdapter('agora'),
  daily: mockAdapter('daily'),
  zoom: mockAdapter('zoom'),
  teams: mockAdapter('teams'),
};

export function getVideoAdapter(platform: VideoPlatform): VideoAdapter {
  return adapters[platform];
}

export async function startVideo(sessionId: string, platform: VideoPlatform, roomId: string) {
  const adapter = getVideoAdapter(platform);
  return adapter.joinRoom(roomId, `mock-token-${sessionId}`);
}

export async function stopVideo(platform: VideoPlatform, roomId: string) {
  return getVideoAdapter(platform).leaveRoom(roomId);
}
