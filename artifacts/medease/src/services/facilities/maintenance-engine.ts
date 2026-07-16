import type { PreventiveMaintenance, WorkOrder } from '@/services/facilities/types';

export function prioritizeWorkOrder(wo: WorkOrder): number {
  const priorityScore = { emergency: 100, critical: 80, high: 60, medium: 40, low: 20 };
  const statusScore = { open: 30, assigned: 25, in_progress: 20, on_hold: 10, draft: 5, completed: 0, cancelled: 0 };
  return (priorityScore[wo.priority] ?? 0) + (statusScore[wo.status] ?? 0) + (wo.slaBreached ? 50 : 0);
}

export function calculateDowntime(startIso: string, endIso?: string): number {
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : Date.now();
  return Math.max(0, (end - start) / (1000 * 60 * 60));
}

export function checkSlaBreached(createdAt: string, slaHours: number, completedDate?: string): boolean {
  const elapsed = calculateDowntime(createdAt, completedDate);
  return elapsed > slaHours;
}

export function schedulePreventiveMaintenance(pm: PreventiveMaintenance, performedDate: string): PreventiveMaintenance {
  const next = new Date(performedDate);
  next.setDate(next.getDate() + pm.frequencyDays);
  const daysUntilDue = Math.ceil((next.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return {
    ...pm,
    lastPerformed: performedDate,
    nextDue: next.toISOString(),
    status: daysUntilDue <= 0 ? 'overdue' : daysUntilDue <= 7 ? 'due' : 'compliant',
  };
}

export function escalateWorkOrder(wo: WorkOrder): WorkOrder {
  const order: WorkOrder['priority'][] = ['low', 'medium', 'high', 'critical', 'emergency'];
  const idx = order.indexOf(wo.priority);
  return { ...wo, priority: order[Math.min(idx + 1, order.length - 1)]!, updatedAt: new Date().toISOString() };
}

export function workOrderLifecycle(status: WorkOrder['status']): string[] {
  const flows: Record<WorkOrder['status'], string[]> = {
    draft: ['open', 'cancelled'],
    open: ['assigned', 'cancelled'],
    assigned: ['in_progress', 'on_hold', 'cancelled'],
    in_progress: ['on_hold', 'completed', 'cancelled'],
    on_hold: ['in_progress', 'cancelled'],
    completed: [],
    cancelled: [],
  };
  return flows[status] ?? [];
}

export function generateWeeklyMaintenanceSchedule(equipmentIds: string[], startDate: Date): { equipmentId: string; day: number }[] {
  const offset = startDate.getDay();
  return equipmentIds.flatMap((equipmentId, idx) =>
    Array.from({ length: 7 }, (_, day) => ({ equipmentId, day: (day + offset) % 7 })).filter((_, day) => (idx + day) % 3 === 0),
  );
}
