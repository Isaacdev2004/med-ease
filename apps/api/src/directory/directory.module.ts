import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { DirectoryController } from './directory.controller';
import { DirectoryRepository } from './directory.repository';
import { DirectoryService } from './directory.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [DirectoryController],
  providers: [DirectoryRepository, DirectoryService],
  exports: [DirectoryService, DirectoryRepository],
})
export class DirectoryModule {}
