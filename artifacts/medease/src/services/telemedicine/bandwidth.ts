import type { DeviceCheckResult } from '@/services/telemedicine/types';

export function runDeviceCheck(sessionId?: string): DeviceCheckResult {
  return {
    sessionId,
    camera: 'pass',
    microphone: 'pass',
    speaker: 'pass',
    bandwidthMbps: 12.5,
    latencyMs: 45,
    packetLossPercent: 0.2,
    checkedAt: new Date().toISOString(),
  };
}

export function measureBandwidth() {
  return { bandwidthMbps: 10 + Math.random() * 20, latencyMs: 30 + Math.random() * 50, packetLossPercent: Math.random() * 2 };
}
