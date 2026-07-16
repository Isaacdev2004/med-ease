import { useMemo } from 'react';

import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  type Permission,
} from '@/config/permissions';
import { env } from '@/config/env';
import { useAuth } from '@/services/auth/auth-context';

export function usePermissions() {
  const { permissions, activeRole, isAuthenticated } = useAuth();

  return useMemo(
    () => ({
      permissions,
      role: activeRole,
      isAuthenticated,
      isDevBypass: env.isDev,
      can: (permission: Permission | string) =>
        hasPermission(permissions, permission),
      canAny: (required: Permission[]) =>
        hasAnyPermission(permissions, required),
      canAll: (required: Permission[]) =>
        hasAllPermissions(permissions, required),
    }),
    [permissions, activeRole, isAuthenticated],
  );
}
