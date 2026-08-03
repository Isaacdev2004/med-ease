import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { InventoryController } from './inventory.controller';
import { InventoryRepository } from './inventory.repository';
import { InventoryService } from './inventory.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [InventoryController],
  providers: [InventoryRepository, InventoryService],
  exports: [InventoryService, InventoryRepository],
})
export class InventoryModule {}
