import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { RadiologyController } from './radiology.controller';
import { RadiologyRepository } from './radiology.repository';
import { RadiologyService } from './radiology.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [RadiologyController],
  providers: [RadiologyRepository, RadiologyService],
  exports: [RadiologyService, RadiologyRepository],
})
export class RadiologyModule {}
