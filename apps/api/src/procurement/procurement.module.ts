import { Module } from '@nestjs/common';
import { PrismaModule } from '@medease/prisma';
import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { ProcurementController } from './procurement.controller';
import { ProcurementRepository } from './procurement.repository';
import { ProcurementService } from './procurement.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [ProcurementController],
  providers: [ProcurementRepository, ProcurementService],
  exports: [ProcurementService, ProcurementRepository],
})
export class ProcurementModule {}
