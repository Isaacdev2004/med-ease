import type { Shift } from '@/services/workforce/types';

export function detectShiftConflicts(shifts: Shift[], newShift: Shift): Shift[] {
  return shifts.filter((s) =>
    s.employeeId === newShift.employeeId &&
    s.shiftId !== newShift.shiftId &&
    s.status !== 'cancelled' &&
    new Date(s.startTime) < new Date(newShift.endTime) &&
    new Date(s.endTime) > new Date(newShift.startTime),
  );
}

export function calculateCoverage(required: number, scheduled: number): number {
  if (required <= 0) return 100;
  return Math.min(100, Math.round((scheduled / required) * 100));
}

export function detectOvertime(shift: Shift, weeklyHours: number, threshold = 40): boolean {
  const duration = (new Date(shift.endTime).getTime() - new Date(shift.startTime).getTime()) / 3600000;
  return weeklyHours + duration > threshold || shift.isOvertime;
}

export function validateShiftSwap(shiftA: Shift, shiftB: Shift): { valid: boolean; reason?: string } {
  if (shiftA.departmentId !== shiftB.departmentId) return { valid: false, reason: 'Different departments' };
  if (shiftA.status === 'completed' || shiftB.status === 'completed') return { valid: false, reason: 'Shift already completed' };
  return { valid: true };
}

export function generateWeeklyRoster(employeeIds: string[], startDate: Date): { employeeId: string; day: number; shiftType: Shift['shiftType'] }[] {
  const weekOffset = startDate.getDay();
  return employeeIds.flatMap((employeeId, idx) =>
    Array.from({ length: 7 }, (_, day) => ({
      employeeId,
      day,
      shiftType: (['day', 'evening', 'night'] as const)[(idx + day + weekOffset) % 3]!,
    })),
  );
}

export function balanceNightShifts(shifts: Shift[]): { employeeId: string; nightCount: number }[] {
  const counts = new Map<string, number>();
  for (const s of shifts.filter((x) => x.shiftType === 'night')) {
    counts.set(s.employeeId, (counts.get(s.employeeId) ?? 0) + 1);
  }
  return [...counts.entries()].map(([employeeId, nightCount]) => ({ employeeId, nightCount })).sort((a, b) => a.nightCount - b.nightCount);
}
