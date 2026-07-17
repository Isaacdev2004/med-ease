import type { Job, Worker } from 'bullmq';
import { Worker as BullWorker } from 'bullmq';

import {
  createBootstrapEnvelope,
  createQueueProducer,
  createQueueScheduler,
  deadLetterQueueName,
  DEFAULT_WORKER_CONCURRENCY,
  enqueueEnvelope,
  parseRedisUrl,
  closeQueueProducer,
  QUEUE_NAMES,
  type QueueDefinition,
  type QueueJobEnvelope,
  type QueueName,
  type QueueProducerPair,
  type QueueScheduler,
} from '@medease/queue';
import type { Logger } from '@medease/logger';
import type { ConnectionOptions } from 'bullmq';

import {
  runDeadLetterHooks,
  runQueueMiddlewarePipeline,
} from './queue-middleware.js';
import {
  createPlatformLifecycleHooks,
  mergeLifecycleHooks,
} from './processor-lifecycle.js';
import type { MetricsCollector } from '../metrics/metrics-collector.js';

export interface RegisteredQueue {
  definition: QueueDefinition;
  producer: QueueProducerPair;
  worker: Worker<QueueJobEnvelope>;
}

export class QueueRegistry {
  private readonly queues = new Map<string, RegisteredQueue>();
  private readonly producers = new Map<QueueName, QueueProducerPair>();
  private scheduler: QueueScheduler | null = null;

  constructor(
    private readonly connection: ConnectionOptions,
    private readonly logger: Logger,
    private readonly metrics: MetricsCollector,
    private readonly defaultConcurrency = DEFAULT_WORKER_CONCURRENCY,
  ) {}

  register(definition: QueueDefinition) {
    if (this.queues.has(definition.name)) {
      throw new Error(`Queue already registered: ${definition.name}`);
    }

    const producer = createQueueProducer(definition.name, this.connection);
    const hooks = mergeLifecycleHooks(
      createPlatformLifecycleHooks(this.logger),
      definition.hooks,
    );

    const worker = new BullWorker<QueueJobEnvelope>(
      definition.name,
      async (job) =>
        runQueueMiddlewarePipeline({
          queue: definition.name,
          job,
          processor: definition.processor,
          hooks,
          logger: this.logger,
          metrics: this.metrics,
        }),
      {
        connection: this.connection,
        concurrency: definition.concurrency ?? this.defaultConcurrency,
      },
    );

    worker.on('ready', () => {
      this.logger.info({ queue: definition.name }, 'Queue worker ready');
    });

    worker.on('failed', (job, error) => {
      void this.handleFailure(definition, producer, job, error, hooks);
    });

    this.queues.set(definition.name, { definition, producer, worker });
    this.producers.set(definition.name, producer);
    this.scheduler = createQueueScheduler(this.producers);
  }

  registerAll(definitions: QueueDefinition[]) {
    for (const definition of definitions) {
      this.register(definition);
    }
  }

  getScheduler(): QueueScheduler {
    if (!this.scheduler) {
      throw new Error(
        'Scheduler unavailable until at least one queue is registered',
      );
    }
    return this.scheduler;
  }

  getRegisteredQueues(): RegisteredQueue[] {
    return [...this.queues.values()];
  }

  getProducer(queueName: QueueName): QueueProducerPair | undefined {
    return this.producers.get(queueName);
  }

  async seedBootstrapJobs() {
    for (const { definition, producer } of this.queues.values()) {
      const envelope = createBootstrapEnvelope(definition.name, {
        queue: definition.name,
      });
      await enqueueEnvelope(producer, envelope.eventType, envelope);
      this.logger.info(
        { queue: definition.name, envelopeId: envelope.id },
        'Bootstrap job enqueued',
      );
    }
  }

  async close() {
    await Promise.all(
      [...this.queues.values()].flatMap(({ worker, producer }) => [
        worker.close(),
        closeQueueProducer(producer),
      ]),
    );
    this.queues.clear();
    this.producers.clear();
    this.scheduler = null;
  }

  private async handleFailure(
    definition: QueueDefinition,
    producer: QueueProducerPair,
    job: Job<QueueJobEnvelope> | undefined,
    error: Error,
    hooks: ReturnType<typeof mergeLifecycleHooks>,
  ) {
    if (!job) {
      return;
    }

    const maxAttempts = job.opts.attempts ?? 1;
    const isFinalAttempt = job.attemptsMade >= maxAttempts;

    if (!isFinalAttempt) {
      return;
    }

    await this.moveToDeadLetter(definition.name, producer, job, error);
    await runDeadLetterHooks(hooks, definition.name, job, error, this.metrics);
  }

  private async moveToDeadLetter(
    queueName: string,
    producer: QueueProducerPair,
    job: Job<QueueJobEnvelope>,
    error: Error,
  ) {
    const envelope = job.data;

    await producer.deadLetterQueue.add(
      'dead-letter',
      {
        ...envelope,
        payload: {
          ...(typeof envelope.payload === 'object' && envelope.payload !== null
            ? (envelope.payload as Record<string, unknown>)
            : { value: envelope.payload }),
          originalQueue: queueName,
          originalJobId: job.id,
          originalJobName: job.name,
          failedReason: error.message,
          failedAt: new Date().toISOString(),
        },
      },
      { jobId: `${queueName}:${job.id}:dlq` },
    );

    this.logger.warn(
      { queue: queueName, dlq: deadLetterQueueName(queueName), jobId: job.id },
      'Job moved to dead-letter queue',
    );
  }
}

export function createQueueRegistry(
  redisUrl: string,
  logger: Logger,
  metrics: MetricsCollector,
  concurrency?: number,
) {
  return new QueueRegistry(
    parseRedisUrl(redisUrl),
    logger,
    metrics,
    concurrency,
  );
}

export { QUEUE_NAMES };
