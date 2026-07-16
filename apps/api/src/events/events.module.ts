import { Global, Module } from '@nestjs/common';

import { createAuditHandler, DomainEventBus } from '@medease/events';

import { AuditModule } from '../audit/audit.module';
import { AuditQueueService } from '../audit/audit-queue.service';

@Global()
@Module({
  imports: [AuditModule],
  providers: [
    {
      provide: DomainEventBus,
      useFactory: (auditQueue: AuditQueueService) => {
        const bus = new DomainEventBus();
        bus.register(createAuditHandler(auditQueue.publisher));
        return bus;
      },
      inject: [AuditQueueService],
    },
  ],
  exports: [DomainEventBus],
})
export class EventsModule {}
