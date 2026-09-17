import { Redirect } from 'wouter';
import type { ReactNode } from 'react';

import { ROUTES } from '@/config/routes';
import { useAuth } from '@/services/auth/auth-context';
import { absoluteAppPath } from '@/shared/hooks/use-portal-path';

interface OrganizationGuardProps {
  organizationId?: string;
  children: ReactNode;
}

/** Prevents cross-organization access at the UI layer. */
export function OrganizationGuard({
  organizationId,
  children,
}: OrganizationGuardProps) {
  const { organization } = useAuth();

  if (!organization) {
    return <Redirect to={absoluteAppPath(ROUTES.login)} />;
  }

  if (organizationId && organization.id !== organizationId) {
    return <Redirect to={absoluteAppPath(ROUTES.forbidden)} />;
  }

  return children;
}
