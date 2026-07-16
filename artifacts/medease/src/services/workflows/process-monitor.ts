import type { InstanceStatus, WorkflowInstance } from '@/services/workflows/types';

export function activeInstances(instances: WorkflowInstance[]): WorkflowInstance[] {
  return instances.filter((i) => i.status === 'running' || i.status === 'paused');
}

export function instancesByStatus(instances: WorkflowInstance[]): Record<InstanceStatus, number> {
  const counts: Record<string, number> = {};
  for (const i of instances) counts[i.status] = (counts[i.status] ?? 0) + 1;
  return counts as Record<InstanceStatus, number>;
}

export function avgCycleTimeHours(instances: WorkflowInstance[]): number {
  const completed = instances.filter((i) => i.completedAt);
  if (completed.length === 0) return 0;
  const total = completed.reduce((s, i) => s + (new Date(i.completedAt!).getTime() - new Date(i.startedAt).getTime()), 0);
  return Math.round((total / completed.length / 3600000) * 10) / 10;
}
