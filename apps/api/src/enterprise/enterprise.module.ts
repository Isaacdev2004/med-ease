import { Module } from '@nestjs/common';
import { PrismaModule } from '@medease/prisma';
import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { EnterpriseController } from './enterprise.controller';
import { EnterpriseRepository } from './enterprise.repository';
import { EnterpriseService } from './enterprise.service';
import { NotificationsController } from './notifications.controller';
import { SettingsController } from './settings.controller';

@Module({
  imports: [AuthModule, PrismaModule, TenantModule],
  controllers: [
    EnterpriseController,
    NotificationsController,
    SettingsController,
  ],
  providers: [EnterpriseRepository, EnterpriseService],
  exports: [EnterpriseService, EnterpriseRepository],
})
export class EnterpriseModule {}
