import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { AdmissionsController } from './admissions.controller';
import { AdmissionsRepository } from './admissions.repository';
import { AdmissionsService } from './admissions.service';
import { TransfersController } from './transfers.controller';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [AdmissionsController, TransfersController],
  providers: [AdmissionsRepository, AdmissionsService],
  exports: [AdmissionsService, AdmissionsRepository],
})
export class AdmissionsModule {}
