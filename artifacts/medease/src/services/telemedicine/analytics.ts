import type { TelemedicineAnalytics } from '@/services/telemedicine/types';
import {
  MOCK_RECORDINGS,
  MOCK_SESSIONS,
} from '@/services/telemedicine/mock-data';

export function computeTelemedicineAnalytics(): TelemedicineAnalytics {
  const completed = MOCK_SESSIONS.filter((s) => s.status === 'completed');
  const noShows = MOCK_SESSIONS.filter((s) => s.status === 'no_show');
  const active = MOCK_SESSIONS.filter(
    (s) => s.status === 'in_progress' || s.status === 'waiting',
  );
  const avgDuration = completed.length
    ? completed.reduce((s, c) => s + (c.duration ?? 25), 0) / completed.length
    : 25;

  return {
    totalSessions: MOCK_SESSIONS.length,
    activeSessions: active.length,
    completedVisits: completed.length,
    averageDurationMinutes: Math.round(avgDuration),
    noShowRate: Math.round((noShows.length / MOCK_SESSIONS.length) * 100),
    connectionFailureRate: 3,
    recordingRate: Math.round(
      (MOCK_RECORDINGS.length / MOCK_SESSIONS.length) * 100,
    ),
    patientSatisfaction: 4.6,
    providerUtilization: 78,
    bandwidthUsageMbps: 145,
    dailySessions: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
      (label, i) => ({
        label,
        value: 15 + i * 4 + (MOCK_SESSIONS.length % 10),
      }),
    ),
    weeklyTrends: ['W1', 'W2', 'W3', 'W4'].map((label, i) => ({
      label,
      value: 80 + i * 12,
    })),
    monthlyUtilization: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(
      (label, i) => ({ label, value: 60 + i * 8 }),
    ),
    sessionQuality: ['Excellent', 'Good', 'Fair', 'Poor'].map((label, i) => ({
      label,
      value: [45, 35, 15, 5][i]!,
    })),
    providerWorkload: [
      'Dr. Chen',
      'Dr. Martin',
      'Dr. Bernard',
      'Dr. Dupont',
    ].map((label, i) => ({ label, value: 20 + i * 8 })),
    platformHealth: ['WebRTC', 'Twilio', 'Daily', 'Zoom'].map((label, i) => ({
      label,
      value: 95 - i * 2,
    })),
  };
}
