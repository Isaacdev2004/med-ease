import type { CareGoal } from '@/services/care-plans/types';

export function computeGoalCompletionRate(goals: CareGoal[]): number {
  if (!goals.length) return 0;
  const achieved = goals.filter((g) => g.status === 'achieved').length;
  return Math.round((achieved / goals.length) * 100);
}

export function getGoalsByCategory(goals: CareGoal[]) {
  const map = new Map<string, CareGoal[]>();
  for (const g of goals) {
    const list = map.get(g.category) ?? [];
    list.push(g);
    map.set(g.category, list);
  }
  return map;
}
