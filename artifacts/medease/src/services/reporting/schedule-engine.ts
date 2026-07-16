import type { ReportSchedule } from '@/services/reporting/types';

export function parseCronNextRun(cron: string): string {
  const d = new Date();
  d.setHours(d.getHours() + (cron.includes('hourly') ? 1 : 24));
  return d.toISOString();
}

export function isScheduleDue(nextRunAt: string): boolean {
  return new Date(nextRunAt).getTime() <= Date.now();
}

export function activeScheduleCount(schedules: ReportSchedule[]): number {
  return schedules.filter((s) => s.enabled).length;
}

export function scheduleComplianceRate(schedules: ReportSchedule[]): number {
  if (schedules.length === 0) return 100;
  const withRecentRun = schedules.filter((s) => s.lastRunAt).length;
  return Math.round((withRecentRun / schedules.length) * 100);
}
