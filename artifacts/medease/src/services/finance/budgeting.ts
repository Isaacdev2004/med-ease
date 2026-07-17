import type { Budget } from '@/services/finance/types';

export function varianceAnalysis(budget: Budget): {
  variance: number;
  variancePercent: number;
  status: 'under' | 'over' | 'on_track';
} {
  const variance = budget.allocated - budget.spent;
  const variancePercent = budget.allocated
    ? Math.round((variance / budget.allocated) * 100)
    : 0;
  const status =
    variancePercent > 10
      ? 'under'
      : variancePercent < -10
        ? 'over'
        : 'on_track';
  return { variance, variancePercent, status };
}

export function forecastSpend(budget: Budget, monthsElapsed: number): number {
  const monthlyRate = budget.spent / Math.max(monthsElapsed, 1);
  return Math.round(monthlyRate * 12);
}

export function departmentBudgetUtilization(
  budgets: Budget[],
): { departmentId: string; utilization: number }[] {
  const byDept = new Map<string, { allocated: number; spent: number }>();
  for (const b of budgets) {
    const key = b.departmentId ?? 'general';
    const cur = byDept.get(key) ?? { allocated: 0, spent: 0 };
    cur.allocated += b.allocated;
    cur.spent += b.spent;
    byDept.set(key, cur);
  }
  return [...byDept.entries()].map(([departmentId, { allocated, spent }]) => ({
    departmentId,
    utilization: allocated ? Math.round((spent / allocated) * 100) : 0,
  }));
}

export function budgetVarianceSummary(budgets: Budget[]) {
  const allocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const spent = budgets.reduce((s, b) => s + b.spent, 0);
  const variance = allocated - spent;
  return {
    allocated,
    spent,
    variance,
    variancePercent: allocated ? Math.round((variance / allocated) * 100) : 0,
    items: budgets.slice(0, 20).map((b) => ({
      budgetId: b.budgetId,
      name: b.name,
      variance: b.variance,
      variancePercent: b.variancePercent,
    })),
  };
}
