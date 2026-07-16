import type { TaskStatus, WorkflowTask } from '@/services/workflows/types';

export function pendingTaskCount(tasks: WorkflowTask[]): number {
  return tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
}

export function automationRate(tasks: WorkflowTask[]): number {
  if (tasks.length === 0) return 0;
  const automated = tasks.filter((t) => t.type === 'automated').length;
  return Math.round((automated / tasks.length) * 100);
}

export function nextTaskStatus(action: 'complete' | 'cancel' | 'escalate'): TaskStatus {
  if (action === 'complete') return 'completed';
  if (action === 'cancel') return 'cancelled';
  return 'escalated';
}
