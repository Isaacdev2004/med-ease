import type { CareTask } from '@/services/care-plans/types';

export function buildTaskDueReminder(task: CareTask) {
  return {
    id: `cp-reminder-${task.id}`,
    title: 'Care plan task due',
    message: `${task.title} is due ${new Date(task.dueDate).toLocaleDateString()}.`,
    type: 'care_plan' as const,
    priority: task.priority === 'urgent' ? 'high' as const : 'normal' as const,
  };
}

export function buildTaskOverdueAlert(task: CareTask) {
  return {
    id: `cp-overdue-${task.id}`,
    title: 'Overdue care task',
    message: `${task.title} is overdue. Please complete or reschedule.`,
    type: 'care_plan' as const,
    priority: 'high' as const,
  };
}
