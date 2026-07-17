import type {
  Attendance,
  ClockEvent,
  Timesheet,
} from '@/services/workforce/types';

export function clockIn(employeeId: string, location?: string): ClockEvent {
  return {
    eventId: `clk-${Date.now()}`,
    employeeId,
    type: 'clock_in',
    timestamp: new Date().toISOString(),
    location,
  };
}

export function clockOut(employeeId: string, location?: string): ClockEvent {
  return {
    eventId: `clk-${Date.now()}`,
    employeeId,
    type: 'clock_out',
    timestamp: new Date().toISOString(),
    location,
  };
}

export function computeHoursWorked(
  clockIn?: string,
  clockOut?: string,
): number {
  if (!clockIn || !clockOut) return 0;
  return (
    Math.round(
      ((new Date(clockOut).getTime() - new Date(clockIn).getTime()) / 3600000) *
        10,
    ) / 10
  );
}

export function detectLateArrival(
  clockIn: string,
  scheduledStart: string,
  graceMinutes = 5,
): number {
  const diff =
    (new Date(clockIn).getTime() - new Date(scheduledStart).getTime()) / 60000;
  return diff > graceMinutes ? Math.round(diff - graceMinutes) : 0;
}

export function buildTimesheet(
  employeeId: string,
  entries: Attendance[],
  weekStart: string,
): Timesheet {
  const totalHours = entries.reduce((s, e) => s + e.hoursWorked, 0);
  const overtimeHours = entries.reduce((s, e) => s + e.overtimeHours, 0);
  return {
    timesheetId: `ts-${Date.now()}`,
    employeeId,
    weekStart,
    weekEnd: new Date(
      new Date(weekStart).getTime() + 6 * 86400000,
    ).toISOString(),
    totalHours,
    overtimeHours,
    status: 'draft',
    entries,
  };
}

export function complianceCheck(
  attendance: Attendance[],
  requiredDays: number,
): { compliant: boolean; missedDays: number } {
  const present = attendance.filter(
    (a) => a.status === 'present' || a.status === 'late',
  ).length;
  return {
    compliant: present >= requiredDays,
    missedDays: Math.max(0, requiredDays - present),
  };
}
