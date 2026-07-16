import { Redirect, useLocation } from 'wouter';
import type { ReactNode } from 'react';

import { AuthLoadingScreen } from '@/app/auth-ui/AuthLoadingScreen';
import { LoggingOutScreen } from '@/app/auth-ui/LoggingOutScreen';
import { ROUTES } from '@/config/routes';
import { getPortalLoginPathFromPathname } from '@/config/routes/portal-login';
import { useAuth } from '@/services/auth/auth-context';

interface AuthenticatedGuardProps {
  children: ReactNode;
}

/** Requires a valid authenticated session. */
export function AuthenticatedGuard({ children }: AuthenticatedGuardProps) {
  const [location] = useLocation();
  const { authState, isAuthenticated } = useAuth();

  if (authState === 'authenticating' || authState === 'refreshing') {
    return <AuthLoadingScreen label="Loading your session" />;
  }

  if (authState === 'logging_out') {
    return <LoggingOutScreen />;
  }

  if (authState === 'session_expired') {
    return <Redirect to={ROUTES.sessionExpired} />;
  }

  if (!isAuthenticated) {
    return <Redirect to={getPortalLoginPathFromPathname(location)} />;
  }

  return children;
}

interface PublicGuardProps {
  children: ReactNode;
}

/** Accessible to everyone — no session required. */
export function PublicGuard({ children }: PublicGuardProps) {
  const { authState } = useAuth();

  if (authState === 'authenticating') {
    return <AuthLoadingScreen label="Loading" />;
  }

  return children;
}

interface PublicOnlyGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

/** Redirects authenticated users away from public auth pages. */
export function PublicOnlyGuard({
  children,
  redirectTo,
}: PublicOnlyGuardProps) {
  const { isAuthenticated, defaultPortalPath, authState } = useAuth();

  if (authState === 'authenticating') {
    return <AuthLoadingScreen label="Loading" />;
  }

  if (isAuthenticated) {
    return <Redirect to={redirectTo ?? defaultPortalPath} />;
  }

  return children;
}
