import type { Job } from 'bullmq';

import {
  validateEnvelope,
  type ProcessorContext,
  type ProcessorLifecycleHooks,
  type QueueJobEnvelope,
  type QueueName,
  type QueueProcessorFn,
  type QueueProcessorResult,
} from '@medease/queue';
import {
  requestContextFromJobEnvelope,
  runWithRequestContext,
  runWithSpan,
} from '@medease/observability';
import type { Logger } from '@medease/logger';

import type { MetricsCollector } from '../metrics/metrics-collector.js';

export interface MiddlewarePipelineOptions {
  queue: QueueName;
  job: Job<QueueJobEnvelope>;
  processor: QueueProcessorFn;
  hooks?: ProcessorLifecycleHooks;
  logger: Logger;
  metrics: MetricsCollector;
}

function buildContext(
  queue: QueueName,
  job: Job<QueueJobEnvelope>,
  envelope: QueueJobEnvelope,
): ProcessorContext {
  return {
    queue,
    job,
    envelope,
    tenantId: envelope.tenantId,
    facilityId: envelope.facilityId,
    correlationId: envelope.correlationId,
    requestId: envelope.requestId,
    actorId: envelope.actorId,
    attempt: job.attemptsMade + 1,
    maxAttempts: job.opts.attempts ?? 1,
  };
}

/**
 * Platform queue middleware pipeline:
 * Validate → Context → Trace → Metrics → Processor → Audit hooks → Outcome hooks
 */
export async function runQueueMiddlewarePipeline(
  options: MiddlewarePipelineOptions,
): Promise<QueueProcessorResult> {
  const { queue, job, processor, hooks, logger, metrics } = options;

  const envelope = validateEnvelope(job.data);
  const context = buildContext(queue, job, envelope);
  const requestContext = requestContextFromJobEnvelope(envelope);

  return runWithRequestContext(requestContext, () =>
    runWithSpan(
      'bullmq.process',
      {
        'medease.queue': queue,
        'medease.job.id': job.id ?? 'unknown',
        'medease.envelope.id': envelope.id,
        'medease.correlation_id': envelope.correlationId,
        'medease.tenant_id': envelope.tenantId,
        'medease.event_type': envelope.eventType,
        'medease.attempt': context.attempt,
      },
      async () => {
        logger.debug(
          {
            queue,
            jobId: job.id,
            envelopeId: envelope.id,
            correlationId: envelope.correlationId,
            tenantId: envelope.tenantId,
            eventType: envelope.eventType,
          },
          'Job envelope validated',
        );

        await hooks?.beforeProcess?.(context);

        const startedAt = Date.now();

        try {
          const result = await processor(context, envelope);
          metrics.recordProcessed(queue, Date.now() - startedAt);
          await hooks?.afterSuccess?.(context, result);
          return result;
        } catch (error) {
          const failure =
            error instanceof Error ? error : new Error(String(error));
          metrics.recordFailed(queue);

          if (context.attempt < context.maxAttempts) {
            metrics.recordRetry(queue);
            await hooks?.afterRetry?.(context, failure);
          }

          await hooks?.afterFailure?.(context, failure);
          throw failure;
        }
      },
    ),
  );
}

export async function runDeadLetterHooks(
  hooks: ProcessorLifecycleHooks | undefined,
  queue: QueueName,
  job: Job<QueueJobEnvelope>,
  error: Error,
  metrics?: MetricsCollector,
) {
  metrics?.recordDeadLetter(queue);

  if (!hooks?.afterDeadLetter) {
    return;
  }

  const envelope = validateEnvelope(job.data);
  const context = buildContext(queue, job, envelope);
  await hooks.afterDeadLetter(context, error);
}
