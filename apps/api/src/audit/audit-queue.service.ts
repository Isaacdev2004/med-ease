import { Global, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

import { AuditPublisher } from '@medease/audit';
import {
  closeQueueProducer,
  createQueueProducer,
  enqueueEnvelope,
  QUEUE_NAMES,
  type QueueProducerPair,
} from '@medease/queue';

import { MedeaseConfigService } from '../config/config.service';

@Global()
@Injectable()
export class AuditQueueService implements OnModuleDestroy {
  private readonly logger = new Logger(AuditQueueService.name);
  private readonly redis: Redis;
  private readonly producer: QueueProducerPair;
  readonly publisher: AuditPublisher;

  constructor(config: MedeaseConfigService) {
    this.redis = new Redis(config.redis.url, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });
    this.producer = createQueueProducer(QUEUE_NAMES.AUDIT, this.redis);
    this.publisher = new AuditPublisher(
      async (jobName, envelope) => {
        await enqueueEnvelope(this.producer, jobName, envelope);
      },
      {
        source: 'medease-api',
        onError: (error, event) => {
          this.logger.error(
            `Failed to enqueue audit event ${event.eventType}: ${error instanceof Error ? error.message : String(error)}`,
          );
        },
      },
    );
  }

  async onModuleDestroy(): Promise<void> {
    await closeQueueProducer(this.producer);
    this.redis.disconnect();
  }
}
