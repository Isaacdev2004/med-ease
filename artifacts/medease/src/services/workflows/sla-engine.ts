import type {
  SLA,
  SlaStatus,
  WorkflowInstance,
} from '@/services/workflows/types';

export function computeSlaStatus(
  startedAt: string,
  targetMinutes: number,
  warningMinutes: number,
): SlaStatus {
  const elapsed = (Date.now() - new Date(startedAt).getTime()) / 60000;
  if (elapsed >= targetMinutes) return 'breached';
  if (elapsed >= warningMinutes) return 'at_risk';
  return 'on_track';
}

export function slaComplianceRate(instances: WorkflowInstance[]): number {
  if (instances.length === 0) return 100;
  const compliant = instances.filter((i) => i.slaStatus !== 'breached').length;
  return Math.round((compliant / instances.length) * 100);
}

export function slaBreaches(slas: SLA[]): number {
  return slas.filter((s) => s.status === 'breached').length;
}
