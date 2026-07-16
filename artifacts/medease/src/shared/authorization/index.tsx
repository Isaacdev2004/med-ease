import type { ReactNode } from 'react';

import { isFeatureEnabled, type FeatureFlag } from '@/config/feature-flags';
import type { Permission } from '@/config/permissions';
import { env } from '@/config/env';
import { useAuth } from '@/services/auth/auth-context';
import type { UserRole } from '@/types/auth';

interface PermissionGateProps {
  permission?: Permission | string;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({
  permission,
  permissions = permission ? [permission as Permission] : [],
  requireAll = false,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { hasPermission: check } = useAuth();

  if (permissions.length === 0) {
    return children;
  }

  const allowed = requireAll
    ? permissions.every((p) => check(p))
    : permissions.some((p) => check(p));

  return allowed ? children : fallback;
}

interface RoleGateProps {
  role: UserRole;
  fallback?: ReactNode;
  children: ReactNode;
}

export function RoleGate({ role, fallback = null, children }: RoleGateProps) {
  const { activeRole } = useAuth();

  if (activeRole === role || env.isDev) {
    return children;
  }

  return fallback;
}

interface FeatureGateProps {
  flag: FeatureFlag;
  fallback?: ReactNode;
  children: ReactNode;
}

export function FeatureGate({
  flag,
  fallback = null,
  children,
}: FeatureGateProps) {
  if (isFeatureEnabled(flag)) {
    return children;
  }

  return fallback;
}

interface AuthorizedProps {
  permission?: Permission | string;
  permissions?: Permission[];
  role?: UserRole;
  requireAll?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

/** Declarative wrapper combining permission and role checks for UI elements. */
export function Authorized({
  permission,
  permissions,
  role,
  requireAll,
  fallback = null,
  children,
}: AuthorizedProps) {
  const inner = (
    <PermissionGate
      permission={permission}
      permissions={permissions}
      requireAll={requireAll}
      fallback={fallback}
    >
      {children}
    </PermissionGate>
  );

  if (!role) {
    return inner;
  }

  return (
    <RoleGate role={role} fallback={fallback}>
      {inner}
    </RoleGate>
  );
}
