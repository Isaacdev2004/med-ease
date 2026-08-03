import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { LaboratoryController } from './laboratory.controller';
import { LaboratoryRepository } from './laboratory.repository';
import { LaboratoryService } from './laboratory.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [LaboratoryController],
  providers: [LaboratoryRepository, LaboratoryService],
  exports: [LaboratoryService, LaboratoryRepository],
})
export class LaboratoryModule {}
