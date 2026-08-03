import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { MonitoringController } from './monitoring.controller';
import { MonitoringRepository } from './monitoring.repository';
import { MonitoringService } from './monitoring.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [MonitoringController],
  providers: [MonitoringRepository, MonitoringService],
  exports: [MonitoringService, MonitoringRepository],
})
export class MonitoringModule {}
