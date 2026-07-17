import type { CarePlan, CareGoal, CareTask } from '@/services/care-plans/types';

export function toFhirCarePlan(plan: CarePlan) {
  return {
    resourceType: 'CarePlan',
    id: plan.id,
    status:
      plan.status === 'active'
        ? 'active'
        : plan.status === 'completed'
          ? 'completed'
          : 'on-hold',
    intent: 'plan',
    title: plan.title,
    description: plan.description,
    subject: { reference: `Patient/${plan.patientId}` },
    period: { start: plan.startDate, end: plan.endDate },
    created: plan.createdAt,
  };
}

export function toFhirGoal(goal: CareGoal) {
  return {
    resourceType: 'Goal',
    id: goal.id,
    lifecycleStatus: goal.status === 'achieved' ? 'completed' : 'active',
    description: { text: goal.title },
    target: [{ detailString: goal.target, dueDate: goal.deadline }],
    subject: { reference: `Patient/${goal.patientId}` },
  };
}

export function toFhirTask(task: CareTask) {
  return {
    resourceType: 'Task',
    id: task.id,
    status: task.status === 'completed' ? 'completed' : 'in-progress',
    intent: 'order',
    description: task.title,
    for: { reference: `Patient/${task.patientId}` },
    executionPeriod: { end: task.dueDate },
  };
}
