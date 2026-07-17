import { Redirect } from 'wouter';
import type { ReactNode } from 'react';

import { ROUTES, type PortalId } from '@/config/routes';
import { env } from '@/config/env';
import { trackAuthEvent } from '@/services/auth/audit-events';
import { useAuth } from '@/services/auth/auth-context';
import type { UserRole } from '@/types/auth';

interface RoleGuardProps {
  portalId: PortalId;
  children: ReactNode;
}

/** Requires an allowed role for the portal. */
export function RoleGuard({ portalId, children }: RoleGuardProps) {
  const { canAccessPortal, activeRole } = useAuth();

  if (env.isDev || canAccessPortal(portalId)) {
    return children;
  }

  trackAuthEvent('route_denied', {
    portal: portalId,
    role: activeRole ?? 'none',
  });
  return <Redirect to={ROUTES.forbidden} />;
}

interface RoleGateGuardProps {
  role: UserRole;
  children: ReactNode;
}

/** Requires a specific role. */
export function RoleRequiredGuard({ role, children }: RoleGateGuardProps) {
  const { activeRole } = useAuth();

  if (activeRole === role || env.isDev) {
    return children;
  }

  trackAuthEvent('route_denied', {
    requiredRole: role,
    role: activeRole ?? 'none',
  });
  return <Redirect to={ROUTES.forbidden} />;
}
