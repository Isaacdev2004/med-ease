import type { BackgroundJob } from '@/services/workflows/types';

export function runningJobCount(jobs: BackgroundJob[]): number {
  return jobs.filter((j) => j.status === 'running' || j.status === 'queued').length;
}

export function jobSuccessRate(jobs: BackgroundJob[]): number {
  const finished = jobs.filter((j) => j.status === 'completed' || j.status === 'failed');
  if (finished.length === 0) return 100;
  return Math.round((jobs.filter((j) => j.status === 'completed').length / finished.length) * 100);
}
