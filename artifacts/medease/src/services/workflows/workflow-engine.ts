import type { InstanceStatus, WorkflowDefinition } from '@/services/workflows/types';

export function canStartWorkflow(def: WorkflowDefinition): boolean {
  return def.status === 'published';
}

export function nextInstanceStatus(current: InstanceStatus, action: 'pause' | 'resume' | 'cancel' | 'complete'): InstanceStatus {
  if (action === 'pause') return 'paused';
  if (action === 'resume') return 'running';
  if (action === 'cancel') return 'cancelled';
  return 'completed';
}

export function workflowCompletionRate(instances: { status: InstanceStatus }[]): number {
  if (instances.length === 0) return 100;
  const completed = instances.filter((i) => i.status === 'completed').length;
  return Math.round((completed / instances.length) * 100);
}
