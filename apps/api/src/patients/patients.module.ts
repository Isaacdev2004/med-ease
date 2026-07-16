import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { PatientsController } from './patients.controller';
import { PatientsRepository } from './patients.repository';
import { PatientsService } from './patients.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [PatientsController],
  providers: [PatientsRepository, PatientsService],
  exports: [PatientsService, PatientsRepository],
})
export class PatientsModule {}
