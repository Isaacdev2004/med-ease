import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { PermissionService } from './permission.service';
import { PolicyService } from './policy.service';

@Global()
@Module({
  imports: [AuthModule],
  providers: [
    PermissionService,
    PolicyService,
    PermissionsGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [PermissionService, PolicyService, PermissionsGuard],
})
export class AuthorizationModule {}
