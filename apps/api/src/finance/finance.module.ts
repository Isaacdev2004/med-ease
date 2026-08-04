import { Module } from '@nestjs/common';
import { PrismaModule } from '@medease/prisma';
import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { FinanceController } from './finance.controller';
import { FinanceRepository } from './finance.repository';
import { FinanceService } from './finance.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [FinanceController],
  providers: [FinanceRepository, FinanceService],
  exports: [FinanceService, FinanceRepository],
})
export class FinanceModule {}
