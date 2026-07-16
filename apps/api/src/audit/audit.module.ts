import { Global, Module } from '@nestjs/common';

import { MedeaseConfigModule } from '../config/config.module';
import { AuditQueueService } from './audit-queue.service';

@Global()
@Module({
  imports: [MedeaseConfigModule],
  providers: [AuditQueueService],
  exports: [AuditQueueService],
})
export class AuditModule {}
