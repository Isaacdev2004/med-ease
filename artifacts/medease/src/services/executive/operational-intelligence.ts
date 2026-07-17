import type {
  HospitalOperations,
  OperationalMetric,
} from '@/services/executive/types';

export function computeThroughputIndex(metrics: OperationalMetric[]): number {
  if (metrics.length === 0) return 0;
  const avg =
    metrics.reduce((s, m) => s + m.value / Math.max(m.benchmark, 1), 0) /
    metrics.length;
  return Math.round(avg * 100);
}

export function buildHospitalOperations(
  facilityId: string,
  metrics: OperationalMetric[],
): HospitalOperations {
  const ed = metrics.find((m) => m.name.includes('ED'))?.value ?? 45;
  const or = metrics.find((m) => m.name.includes('OR'))?.value ?? 72;
  const bed = metrics.find((m) => m.name.includes('Bed'))?.value ?? 85;
  return {
    facilityId,
    edWaitMinutes: ed,
    orUtilization: or,
    bedOccupancy: bed,
    dischargeRate: 18 + (metrics.length % 5),
    admissionRate: 22 + (metrics.length % 4),
    throughputIndex: computeThroughputIndex(metrics),
    activeAlerts: Math.round(metrics.length / 10),
  };
}

export function operationalEfficiency(metrics: OperationalMetric[]): number {
  if (metrics.length === 0) return 0;
  const scores = metrics.map((m) =>
    Math.min(100, Math.round((m.benchmark / Math.max(m.value, 1)) * 100)),
  );
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
