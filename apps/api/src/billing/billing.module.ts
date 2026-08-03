import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { BillingController } from './billing.controller';
import { BillingRepository } from './billing.repository';
import { BillingService } from './billing.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [BillingController],
  providers: [BillingRepository, BillingService],
  exports: [BillingService, BillingRepository],
})
export class BillingModule {}
