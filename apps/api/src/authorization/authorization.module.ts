import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { PermissionsGuard } from './guards/permissions.guard';
import { PermissionService } from './permission.service';
import { PolicyService } from './policy.service';

@Global()
@Module({
  providers: [
    PermissionService,
    PolicyService,
    PermissionsGuard,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [PermissionService, PolicyService, PermissionsGuard],
})
export class AuthorizationModule {}
