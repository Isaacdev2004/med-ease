import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { TelemedicineController } from './telemedicine.controller';
import { TelemedicineRepository } from './telemedicine.repository';
import { TelemedicineService } from './telemedicine.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [TelemedicineController],
  providers: [TelemedicineRepository, TelemedicineService],
  exports: [TelemedicineService, TelemedicineRepository],
})
export class TelemedicineModule {}
