import type { Job } from 'bullmq';

import type { QueueJobEnvelope } from './envelope/queue-job.envelope';
import type { QueueName } from './constants/queue-names';

export interface ProcessorContext {
  queue: QueueName;
  job: Job<QueueJobEnvelope>;
  envelope: QueueJobEnvelope;
  tenantId: string;
  facilityId?: string;
  correlationId: string;
  requestId?: string;
  actorId?: string;
  attempt: number;
  maxAttempts: number;
}

export interface ProcessorLifecycleHooks {
  beforeProcess?(context: ProcessorContext): Promise<void> | void;
  afterSuccess?(context: ProcessorContext, result: unknown): Promise<void> | void;
  afterFailure?(context: ProcessorContext, error: Error): Promise<void> | void;
  afterRetry?(context: ProcessorContext, error: Error): Promise<void> | void;
  afterDeadLetter?(context: ProcessorContext, error: Error): Promise<void> | void;
}

export interface QueueProcessorResult {
  processedAt: string;
  queue: QueueName;
  jobName: string;
  jobId?: string;
  envelopeId: string;
  correlationId: string;
  stub?: true;
}

export type QueueProcessorFn = (
  context: ProcessorContext,
  envelope: QueueJobEnvelope,
) => Promise<QueueProcessorResult>;

export interface QueueDefinition {
  name: QueueName;
  processor: QueueProcessorFn;
  concurrency?: number;
  hooks?: ProcessorLifecycleHooks;
}

export interface QueueDepthSnapshot {
  queue: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
  dlqWaiting: number;
}

export interface QueueDashboardRow extends QueueDepthSnapshot {
  dlq: number;
  oldestJobAgeMs: number | null;
  workerVersion: string;
}

export interface QueueMetricsSnapshot {
  processedTotal: number;
  failedTotal: number;
  processingDurationMsTotal: number;
}

export interface ScheduledJobPayload {
  targetQueue: QueueName;
  envelope: QueueJobEnvelope;
  cron?: string;
  description?: string;
}

/** @deprecated Use QueueJobEnvelope */
export type QueueJobPayload = QueueJobEnvelope;

/** @deprecated Use QueueProcessorFn via QueueDefinition */
export type QueueProcessor = QueueProcessorFn;
