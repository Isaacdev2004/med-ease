import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

import type { PermissionMode, PermissionRequirement } from '@medease/auth';

export const IS_PUBLIC_KEY = 'medease:isPublic';
export const PERMISSIONS_KEY = 'medease:permissions';

export interface RequirePermissionOptions {
  mode?: PermissionMode;
  policies?: string[];
}

export function Public() {
  return SetMetadata(IS_PUBLIC_KEY, true);
}

export function RequirePermission(
  permissions: string | string[],
  options: RequirePermissionOptions = {},
) {
  const requirement: PermissionRequirement = {
    permissions: Array.isArray(permissions) ? permissions : [permissions],
    mode: options.mode ?? 'all',
    policies: options.policies,
  };

  return applyDecorators(
    SetMetadata(PERMISSIONS_KEY, requirement),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ApiForbiddenResponse({ description: 'Insufficient permissions' }),
  );
}

export function RequireAnyPermission(
  permissions: string[],
  options: Omit<RequirePermissionOptions, 'mode'> = {},
) {
  return RequirePermission(permissions, { ...options, mode: 'any' });
}

export function RequireAllPermissions(
  permissions: string[],
  options: Omit<RequirePermissionOptions, 'mode'> = {},
) {
  return RequirePermission(permissions, { ...options, mode: 'all' });
}
