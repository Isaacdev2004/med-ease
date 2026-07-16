import type { PreventiveCategory, PreventiveReminder } from '@/services/cdss/types';

export function sortPreventiveByUrgency(reminders: PreventiveReminder[]): PreventiveReminder[] {
  const statusWeight = { overdue: 3, due: 2, scheduled: 1, completed: 0 };
  return [...reminders].sort((a, b) => {
    const diff = statusWeight[b.status] - statusWeight[a.status];
    if (diff !== 0) return diff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function filterPreventiveByCategory(
  reminders: PreventiveReminder[],
  category?: PreventiveCategory,
): PreventiveReminder[] {
  if (!category) return reminders;
  return reminders.filter((r) => r.category === category);
}
