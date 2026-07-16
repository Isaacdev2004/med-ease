import type { JobStatus, QueueConfig, SystemJob } from '@/services/platform-admin/types';

export function canRetryJob(job: SystemJob): boolean {
  return job.status === 'failed';
}

export function runningJobCount(jobs: SystemJob[]): number {
  return jobs.filter((j) => j.status === 'running').length;
}

export function queueDepth(queues: QueueConfig[]): number {
  return queues.reduce((sum, q) => sum + q.pendingCount, 0);
}

export function jobSuccessRate(jobs: SystemJob[]): number {
  if (jobs.length === 0) return 100;
  const terminal = jobs.filter((j) => j.status === 'completed' || j.status === 'failed');
  if (terminal.length === 0) return 100;
  const completed = terminal.filter((j) => j.status === 'completed').length;
  return Math.round((completed / terminal.length) * 100);
}

export function nextJobStatus(current: JobStatus, action: 'start' | 'complete' | 'fail'): JobStatus {
  if (action === 'start') return 'running';
  if (action === 'fail') return 'failed';
  return 'completed';
}
