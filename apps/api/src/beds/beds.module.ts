import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { BedsController } from './beds.controller';
import { BedsRepository } from './beds.repository';
import { BedsService } from './beds.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [BedsController],
  providers: [BedsRepository, BedsService],
  exports: [BedsService, BedsRepository],
})
export class BedsModule {}
