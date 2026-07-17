import type { ProcessorLifecycleHooks } from '@medease/queue';
import type { Logger } from '@medease/logger';

/** Default platform lifecycle hooks — modules extend rather than replace. */
export function createPlatformLifecycleHooks(
  logger: Logger,
): ProcessorLifecycleHooks {
  return {
    beforeProcess(context) {
      logger.info(
        {
          queue: context.queue,
          envelopeId: context.envelope.id,
          correlationId: context.correlationId,
          tenantId: context.tenantId,
          eventType: context.envelope.eventType,
          attempt: context.attempt,
        },
        'Job processing started',
      );
    },

    afterSuccess(context) {
      logger.info(
        {
          queue: context.queue,
          envelopeId: context.envelope.id,
          correlationId: context.correlationId,
          jobId: context.job.id,
        },
        'Job processing succeeded',
      );
    },

    afterFailure(context, error) {
      logger.warn(
        {
          queue: context.queue,
          envelopeId: context.envelope.id,
          correlationId: context.correlationId,
          attempt: context.attempt,
          maxAttempts: context.maxAttempts,
          error: error.message,
        },
        'Job processing failed',
      );
    },

    afterRetry(context, error) {
      logger.info(
        {
          queue: context.queue,
          envelopeId: context.envelope.id,
          attempt: context.attempt,
          error: error.message,
        },
        'Job scheduled for retry',
      );
    },

    afterDeadLetter(context, error) {
      logger.error(
        {
          queue: context.queue,
          envelopeId: context.envelope.id,
          correlationId: context.correlationId,
          error: error.message,
        },
        'Job moved to dead-letter queue',
      );
    },
  };
}

export function mergeLifecycleHooks(
  platform: ProcessorLifecycleHooks,
  module?: ProcessorLifecycleHooks,
): ProcessorLifecycleHooks {
  if (!module) {
    return platform;
  }

  return {
    beforeProcess: async (ctx) => {
      await platform.beforeProcess?.(ctx);
      await module.beforeProcess?.(ctx);
    },
    afterSuccess: async (ctx, result) => {
      await platform.afterSuccess?.(ctx, result);
      await module.afterSuccess?.(ctx, result);
    },
    afterFailure: async (ctx, error) => {
      await platform.afterFailure?.(ctx, error);
      await module.afterFailure?.(ctx, error);
    },
    afterRetry: async (ctx, error) => {
      await platform.afterRetry?.(ctx, error);
      await module.afterRetry?.(ctx, error);
    },
    afterDeadLetter: async (ctx, error) => {
      await platform.afterDeadLetter?.(ctx, error);
      await module.afterDeadLetter?.(ctx, error);
    },
  };
}
