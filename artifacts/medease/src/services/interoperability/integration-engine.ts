import type {
  IntegrationJob,
  JobStatus,
  SyncState,
} from '@/services/interoperability/types';

export function resolveConflict(
  strategy: 'source_wins' | 'target_wins' | 'manual',
): SyncState {
  if (strategy === 'manual') return 'conflict';
  return 'success';
}

export function shouldRetry(job: IntegrationJob, maxRetries = 3): boolean {
  return job.status === 'failed' && job.retryCount < maxRetries;
}

export function nextJobStatus(current: JobStatus, success: boolean): JobStatus {
  if (success) return 'completed';
  return current === 'retrying' ? 'dead_letter' : 'failed';
}

export function computeProgress(processed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((processed / total) * 100));
}
