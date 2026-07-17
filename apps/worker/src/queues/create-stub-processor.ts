import type {
  QueueName,
  QueueProcessorFn,
  QueueProcessorResult,
} from '@medease/queue';

/** Stub processor — validates envelope pipeline without domain logic. */
export function createStubProcessor(queue: QueueName): QueueProcessorFn {
  return async (context, envelope): Promise<QueueProcessorResult> => {
    return {
      processedAt: new Date().toISOString(),
      queue,
      jobName: context.job.name ?? envelope.eventType,
      jobId: context.job.id,
      envelopeId: envelope.id,
      correlationId: envelope.correlationId,
      stub: true,
    };
  };
}
