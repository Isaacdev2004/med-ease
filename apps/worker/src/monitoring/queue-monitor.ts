import type { Queue } from 'bullmq';

import {
  deadLetterQueueName,
  type QueueDashboardRow,
  type QueueDepthSnapshot,
  type QueueJobEnvelope,
} from '@medease/queue';

import type { RegisteredQueue } from '../framework/queue-registry.js';

async function getOldestJobAgeMs(
  queue: Queue<QueueJobEnvelope>,
): Promise<number | null> {
  const jobs = await queue.getJobs(['waiting', 'delayed'], 0, 0, true);
  const oldest = jobs[0];
  if (!oldest) {
    return null;
  }

  const timestamp = oldest.timestamp ?? Date.now();
  return Math.max(0, Date.now() - timestamp);
}

export async function collectQueueDepth(
  queue: Queue<QueueJobEnvelope>,
  dlq: Queue<QueueJobEnvelope>,
  workerVersion: string,
): Promise<QueueDashboardRow> {
  const [counts, dlqCounts, oldestJobAgeMs] = await Promise.all([
    queue.getJobCounts(
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
      'paused',
    ),
    dlq.getJobCounts(
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
      'paused',
    ),
    getOldestJobAgeMs(queue),
  ]);

  return {
    queue: queue.name,
    waiting: counts.waiting ?? 0,
    active: counts.active ?? 0,
    completed: counts.completed ?? 0,
    failed: counts.failed ?? 0,
    delayed: counts.delayed ?? 0,
    paused: counts.paused ?? 0,
    dlqWaiting: dlqCounts.waiting ?? 0,
    dlq: dlqCounts.waiting ?? 0,
    oldestJobAgeMs,
    workerVersion,
  };
}

export async function collectAllQueueDashboards(
  registered: RegisteredQueue[],
  workerVersion: string,
): Promise<QueueDashboardRow[]> {
  return Promise.all(
    registered.map(({ producer }) =>
      collectQueueDepth(
        producer.queue,
        producer.deadLetterQueue,
        workerVersion,
      ),
    ),
  );
}

export function summarizeQueueHealth(depths: QueueDepthSnapshot[]) {
  const totalWaiting = depths.reduce(
    (sum, item) => sum + item.waiting + item.delayed,
    0,
  );
  const totalFailed = depths.reduce(
    (sum, item) => sum + item.failed + item.dlqWaiting,
    0,
  );

  return {
    queueCount: depths.length,
    totalWaiting,
    totalFailed,
    deadLetterQueues: depths.map((item) => deadLetterQueueName(item.queue)),
  };
}
