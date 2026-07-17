import type { RepeatOptions } from 'bullmq';

import type { QueueName } from '../constants/queue-names';
import { QUEUE_NAMES } from '../constants/queue-names';
import type { QueueProducerPair } from '../factory/queue-producer';
import { enqueueEnvelope } from '../factory/queue-producer';
import type { QueueJobEnvelope } from '../envelope/queue-job.envelope';
import { createEnvelope } from '../envelope/queue-job.envelope';
import type { ScheduledJobPayload } from '../types';

export interface ScheduleRepeatOptions {
  cron: string;
  jobId?: string;
  tz?: string;
}

export interface ScheduleOnceOptions {
  delayMs: number;
  jobId?: string;
}

/**
 * Platform scheduler — all timed work flows: Scheduler → Queue → Processor.
 * Repeatable jobs are registered on the target queue via BullMQ repeat options.
 */
export class QueueScheduler {
  constructor(private readonly producers: Map<QueueName, QueueProducerPair>) {}

  async scheduleRepeat(
    targetQueue: QueueName,
    envelope: QueueJobEnvelope,
    options: ScheduleRepeatOptions,
  ) {
    const producer = this.requireProducer(targetQueue);
    const repeat: RepeatOptions = {
      pattern: options.cron,
      tz: options.tz,
    };

    return enqueueEnvelope(producer, envelope.eventType, envelope, {
      jobId: options.jobId ?? `schedule:${targetQueue}:${envelope.eventType}`,
      repeat,
    });
  }

  async scheduleOnce(
    targetQueue: QueueName,
    envelope: QueueJobEnvelope,
    options: ScheduleOnceOptions,
  ) {
    const producer = this.requireProducer(targetQueue);
    return enqueueEnvelope(producer, envelope.eventType, envelope, {
      jobId: options.jobId,
      delay: options.delayMs,
    });
  }

  /** Enqueue a dispatch job on the scheduled queue (for complex cron routing). */
  async enqueueScheduledDispatch(
    scheduledProducer: QueueProducerPair,
    payload: ScheduledJobPayload,
    repeat?: RepeatOptions,
  ) {
    const envelope = createEnvelope({
      tenantId: payload.envelope.tenantId,
      source: 'platform-scheduler',
      eventType: 'scheduler.dispatch',
      payload,
      correlationId: payload.envelope.correlationId,
      facilityId: payload.envelope.facilityId,
    });

    return enqueueEnvelope(scheduledProducer, envelope.eventType, envelope, {
      repeat,
      jobId: payload.cron
        ? `scheduler:${payload.targetQueue}:${payload.cron}`
        : undefined,
    });
  }

  private requireProducer(queue: QueueName): QueueProducerPair {
    const producer = this.producers.get(queue);
    if (!producer) {
      throw new Error(`No producer registered for queue: ${queue}`);
    }
    return producer;
  }
}

export function createQueueScheduler(
  producers: Map<QueueName, QueueProducerPair>,
) {
  return new QueueScheduler(producers);
}

export { QUEUE_NAMES };
