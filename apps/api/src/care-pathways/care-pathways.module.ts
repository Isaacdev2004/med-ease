import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import {
  CarePathwaysController,
  CarePlansController,
} from './care-pathways.controller';
import { CarePathwaysRepository } from './care-pathways.repository';
import { CarePathwaysService } from './care-pathways.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [CarePathwaysController, CarePlansController],
  providers: [CarePathwaysRepository, CarePathwaysService],
  exports: [CarePathwaysService, CarePathwaysRepository],
})
export class CarePathwaysModule {}
