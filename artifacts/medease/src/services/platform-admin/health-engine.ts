import type {
  HealthStatus,
  SystemHealth,
} from '@/services/platform-admin/types';

export function computeHealthScore(services: SystemHealth[]): number {
  if (services.length === 0) return 100;
  const weights: Record<HealthStatus, number> = {
    healthy: 100,
    degraded: 60,
    critical: 20,
  };
  const total = services.reduce((sum, s) => sum + weights[s.status], 0);
  return Math.round(total / services.length);
}

export function serviceStatus(
  services: SystemHealth[],
  serviceName: string,
): HealthStatus {
  return services.find((s) => s.service === serviceName)?.status ?? 'degraded';
}

export function criticalServiceCount(services: SystemHealth[]): number {
  return services.filter((s) => s.status === 'critical').length;
}

export function systemUptimePercent(services: SystemHealth[]): number {
  if (services.length === 0) return 99.9;
  const avg =
    services.reduce((sum, s) => sum + s.uptimePercent, 0) / services.length;
  return Math.round(avg * 10) / 10;
}
