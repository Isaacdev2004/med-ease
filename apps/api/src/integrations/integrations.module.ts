import { Module } from '@nestjs/common';

import { BdpmExternalService } from './bdpm-external.service';
import { FinessExternalService } from './finess-external.service';

@Module({
  providers: [BdpmExternalService, FinessExternalService],
  exports: [BdpmExternalService, FinessExternalService],
})
export class IntegrationsModule {}
