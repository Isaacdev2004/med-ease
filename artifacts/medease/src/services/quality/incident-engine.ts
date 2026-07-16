import type { IncidentReport } from '@/services/quality/types';

export function canEscalateIncident(incident: IncidentReport): boolean {
  return !incident.escalated && ['high', 'critical'].includes(incident.severity) && incident.status !== 'closed';
}

export function prioritizeIncident(incident: IncidentReport): number {
  const severityWeight = { low: 1, medium: 2, high: 4, critical: 8 };
  return severityWeight[incident.severity] + (incident.escalated ? 4 : 0);
}

export function buildFishboneCategories(): string[] {
  return ['People', 'Process', 'Equipment', 'Environment', 'Management', 'Materials'];
}

export function buildFiveWhys(seed: string): string[] {
  return Array.from({ length: 5 }, (_, i) => `Why ${i + 1}: Contributing factor related to ${seed}`);
}
