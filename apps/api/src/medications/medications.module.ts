import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { MedicationsController } from './medications.controller';
import { MedicationsRepository } from './medications.repository';
import { MedicationsService } from './medications.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [MedicationsController],
  providers: [MedicationsRepository, MedicationsService],
  exports: [MedicationsService, MedicationsRepository],
})
export class MedicationsModule {}
