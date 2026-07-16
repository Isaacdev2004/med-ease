import { Redirect } from 'wouter';
import type { ReactNode } from 'react';

import { ROUTES } from '@/config/routes';
import type { Permission } from '@/config/permissions';
import { trackAuthEvent } from '@/services/auth/audit-events';
import { useAuth } from '@/services/auth/auth-context';

interface PermissionGuardProps {
  permission?: Permission | string;
  permissions?: Permission[];
  requireAll?: boolean;
  children: ReactNode;
}

/** Checks granular permissions — redirects to 403 when absent. */
export function PermissionGuard({
  permission,
  permissions = permission ? [permission as Permission] : [],
  requireAll = false,
  children,
}: PermissionGuardProps) {
  const { hasPermission: check, activeRole } = useAuth();

  if (permissions.length === 0) {
    return children;
  }

  const allowed = requireAll
    ? permissions.every((p) => check(p))
    : permissions.some((p) => check(p));

  if (allowed) {
    return children;
  }

  trackAuthEvent('permission_denied', {
    role: activeRole ?? 'none',
    permission: permissions.join(','),
  });

  return <Redirect to={ROUTES.forbidden} />;
}
