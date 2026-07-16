export function parseCronNextRun(cron: string): string {
  const d = new Date();
  d.setHours(d.getHours() + (cron.includes('hourly') ? 1 : 24));
  return d.toISOString();
}

export function isScheduleDue(nextRunAt: string): boolean {
  return new Date(nextRunAt).getTime() <= Date.now();
}
