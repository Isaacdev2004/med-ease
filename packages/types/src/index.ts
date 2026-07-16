export type HealthStatus = 'ok' | 'degraded' | 'error';

export interface DependencyCheck {
  name: string;
  status: HealthStatus;
  latencyMs?: number;
  message?: string;
}

export interface LivenessResponse {
  status: 'ok';
  service: string;
  uptimeSeconds: number;
}

export interface ReadinessResponse {
  status: 'ok' | 'degraded';
  service: string;
  checks: DependencyCheck[];
}
