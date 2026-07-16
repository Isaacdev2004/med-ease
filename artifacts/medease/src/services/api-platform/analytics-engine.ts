import type { ApiAnalytics, ApiEndpoint, ApiKey, WebhookDelivery } from '@/services/api-platform/types';
import { webhookSuccessRate } from '@/services/api-platform/webhook-engine';
import { activeEndpointCount } from '@/services/api-platform/openapi-engine';
import { totalSdkDownloads } from '@/services/api-platform/sdk-engine';

export function computeErrorRate(totalRequests: number, errorCount: number): number {
  if (totalRequests === 0) return 0;
  return Math.round((errorCount / totalRequests) * 1000) / 10;
}

export function computeAvgLatency(samples: number[]): number {
  if (samples.length === 0) return 0;
  return Math.round(samples.reduce((a, b) => a + b, 0) / samples.length);
}

export function computeP99Latency(samples: number[]): number {
  if (samples.length === 0) return 0;
  const sorted = [...samples].sort((a, b) => a - b);
  const idx = Math.ceil(sorted.length * 0.99) - 1;
  return sorted[Math.max(0, idx)]!;
}

export function activeApiKeyCount(keys: ApiKey[]): number {
  return keys.filter((k) => k.status === 'active').length;
}

export function buildTopEndpoints(endpoints: ApiEndpoint[]): { label: string; value: number }[] {
  return endpoints.slice(0, 6).map((e, i) => ({
    label: `${e.method} ${e.path}`,
    value: 12000 - i * 1500 + (i % 3) * 200,
  }));
}

export function computeApiAnalytics(
  keys: ApiKey[],
  endpoints: ApiEndpoint[],
  deliveries: WebhookDelivery[],
  sdkDownloads: number,
): ApiAnalytics {
  const latencySamples = [45, 62, 38, 120, 55, 89, 42, 200, 67, 51];
  return {
    totalRequests: 2_450_000,
    errorRate: computeErrorRate(2_450_000, 12_250),
    avgLatencyMs: computeAvgLatency(latencySamples),
    p99LatencyMs: computeP99Latency(latencySamples),
    activeKeys: activeApiKeyCount(keys),
    webhookSuccessRate: webhookSuccessRate(deliveries),
    topEndpoints: buildTopEndpoints(endpoints),
    requestTrend: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
      label,
      value: 280_000 + i * 35_000,
    })),
    errorTrend: ['W1', 'W2', 'W3', 'W4'].map((label, i) => ({
      label,
      value: 0.5 - i * 0.05,
    })),
    partnerUsage: ['Acme Health', 'CareBridge', 'MedSync', 'HealthAPI Co', 'DataRx'].map((label, i) => ({
      label,
      value: 450_000 - i * 60_000,
    })),
  };
}

export function endpointCoverage(endpoints: ApiEndpoint[]): number {
  const active = activeEndpointCount(endpoints);
  if (endpoints.length === 0) return 0;
  return Math.round((active / endpoints.length) * 100);
}

export { totalSdkDownloads };
