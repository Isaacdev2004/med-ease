import type { CareGoal, CareTask } from '@/services/care-plans/types';

export function computeGoalProgress(goals: CareGoal[]): number {
  if (!goals.length) return 0;
  return Math.round(
    goals.reduce((s, g) => s + g.progressPercent, 0) / goals.length,
  );
}

export function categorizeTasks(tasks: CareTask[]) {
  const now = Date.now();
  return {
    pending: tasks.filter((t) => t.status === 'pending'),
    upcoming: tasks.filter(
      (t) => t.status === 'pending' && new Date(t.dueDate).getTime() > now,
    ),
    completed: tasks.filter((t) => t.status === 'completed'),
    overdue: tasks.filter((t) => t.status === 'overdue'),
    missed: tasks.filter((t) => t.status === 'missed'),
    today: tasks.filter((t) => {
      const d = new Date(t.dueDate);
      const today = new Date();
      return (
        d.toDateString() === today.toDateString() && t.status === 'pending'
      );
    }),
  };
}

export function sortTasksByDueDate(tasks: CareTask[]): CareTask[] {
  return [...tasks].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  );
}
