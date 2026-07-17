import { Queue } from 'bullmq';
import type { ConnectionOptions, JobsOptions, QueueOptions } from 'bullmq';

import type { QueueName } from '../constants/queue-names';
import { deadLetterQueueName } from '../constants/queue-names';
import {
  createEnvelope,
  type QueueJobEnvelope,
} from '../envelope/queue-job.envelope';
import { DEFAULT_JOB_OPTIONS, DLQ_JOB_OPTIONS } from '../policies/retry-policy';

export interface QueueProducerPair {
  queue: Queue<QueueJobEnvelope>;
  deadLetterQueue: Queue<QueueJobEnvelope>;
}

export function createQueueProducer(
  name: QueueName,
  connection: ConnectionOptions,
  defaultJobOptions: JobsOptions = DEFAULT_JOB_OPTIONS,
): QueueProducerPair {
  const queueOptions: QueueOptions = {
    connection,
    defaultJobOptions,
  };

  const queue = new Queue<QueueJobEnvelope>(name, queueOptions);
  const deadLetterQueue = new Queue<QueueJobEnvelope>(
    deadLetterQueueName(name),
    {
      connection,
      defaultJobOptions: DLQ_JOB_OPTIONS,
    },
  );

  return { queue, deadLetterQueue };
}

export async function enqueueEnvelope<T>(
  producer: QueueProducerPair,
  jobName: string,
  envelope: QueueJobEnvelope<T>,
  options?: JobsOptions,
) {
  return producer.queue.add(jobName, envelope as QueueJobEnvelope, options);
}

/** @deprecated Use enqueueEnvelope */
export async function enqueueJob(
  producer: QueueProducerPair,
  jobName: string,
  payload: QueueJobEnvelope,
  options?: JobsOptions,
) {
  const envelope =
    payload.id && payload.tenantId && payload.correlationId
      ? payload
      : createEnvelope({
          tenantId: payload.tenantId ?? 'unknown',
          source: String(payload.source ?? 'legacy'),
          eventType: jobName,
          payload: payload.payload ?? payload,
          correlationId: payload.correlationId,
          requestId: payload.requestId,
          actorId: payload.actorId,
          facilityId: payload.facilityId,
        });

  return enqueueEnvelope(producer, jobName, envelope, options);
}

export async function closeQueueProducer(producer: QueueProducerPair) {
  await Promise.all([producer.queue.close(), producer.deadLetterQueue.close()]);
}
