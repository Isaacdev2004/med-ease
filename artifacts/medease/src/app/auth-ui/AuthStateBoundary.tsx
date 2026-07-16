import type { ReactNode } from 'react';

import { OfflineBanner } from '@/shared/notifications/SystemBanner';
import { useAuth } from '@/services/auth/auth-context';

interface AuthStateBoundaryProps {
  children: ReactNode;
}

/** Global auth-state overlays that do not block public routes. */
export function AuthStateBoundary({ children }: AuthStateBoundaryProps) {
  const { isOffline } = useAuth();

  return (
    <>
      {isOffline ? <OfflineBanner /> : null}
      {children}
    </>
  );
}
