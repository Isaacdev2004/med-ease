import type { Escalation, WorkflowTask } from '@/services/workflows/types';

export function escalationRate(
  tasks: WorkflowTask[],
  escalations: Escalation[],
): number {
  if (tasks.length === 0) return 0;
  return Math.round((escalations.length / tasks.length) * 100);
}

export function unresolvedEscalations(escalations: Escalation[]): Escalation[] {
  return escalations.filter((e) => !e.resolved);
}
