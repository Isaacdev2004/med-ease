import { Module } from '@nestjs/common';

import { PrismaModule } from '@medease/prisma';

import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { IamController } from './iam.controller';
import { IamRepository } from './iam.repository';
import { IamService } from './iam.service';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  providers: [IamRepository, IamService],
  controllers: [IamController],
  exports: [IamService, IamRepository],
})
export class IamModule {}
