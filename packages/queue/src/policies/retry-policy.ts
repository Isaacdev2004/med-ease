import type { JobsOptions } from 'bullmq';

/** Default retry + retention policy for all platform queues. */
export const DEFAULT_JOB_OPTIONS: JobsOptions = {
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 2_000,
  },
  removeOnComplete: {
    count: 500,
    age: 86_400,
  },
  removeOnFail: false,
};

export const DLQ_JOB_OPTIONS: JobsOptions = {
  attempts: 1,
  removeOnComplete: false,
  removeOnFail: {
    count: 1_000,
    age: 604_800,
  },
};

export const DEFAULT_WORKER_CONCURRENCY = 5;
