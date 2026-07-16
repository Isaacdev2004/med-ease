import type { InteropAnalytics } from '@/services/interoperability/types';
import { buildInteropDashboard, MOCK_ENDPOINTS, MOCK_HL7_MESSAGES, MOCK_JOBS } from '@/services/interoperability/mock-data';

export function computeInteropAnalytics(facilityId?: string): InteropAnalytics {
  const dashboard = buildInteropDashboard(facilityId);
  const endpoints = facilityId ? MOCK_ENDPOINTS.filter((e) => e.facilityId === facilityId) : MOCK_ENDPOINTS;
  const messages = facilityId ? MOCK_HL7_MESSAGES.filter((m) => m.facilityId === facilityId) : MOCK_HL7_MESSAGES;
  const jobs = facilityId ? MOCK_JOBS.filter((j) => j.facilityId === facilityId) : MOCK_JOBS;

  return {
    messageVolume: dashboard.messagesToday,
    successRate: Math.round(endpoints.reduce((s, e) => s + e.successRate, 0) / Math.max(endpoints.length, 1)),
    avgLatencyMs: 124,
    activeEndpoints: dashboard.activeEndpoints,
    failedJobs: dashboard.failedJobs,
    volumeTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({ label, value: Math.round(messages.length / 50 + i * 80) })),
    protocolDistribution: ['FHIR', 'HL7', 'DICOM', 'CDA', 'REST'].map((label, i) => ({ label, value: Math.round(endpoints.length / 5 + i * 15) })),
    topEndpoints: dashboard.topEndpoints.map((e) => ({ label: e.name.slice(0, 24), value: e.messageCount })),
    errorTrend: ['W1', 'W2', 'W3', 'W4'].map((label, i) => ({ label, value: jobs.filter((j) => j.status === 'failed').length / 4 + i * 2 })),
  };
}

export { buildInteropDashboard };
