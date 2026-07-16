import { useEffect } from 'react';

import { ROUTES } from '@/config/routes';
import { useAuth } from '@/services/auth/auth-context';
import { LoggingOutScreen } from '@/app/auth-ui/LoggingOutScreen';
import { Redirect } from 'wouter';

export default function Logout() {
  const { logout, authState } = useAuth();

  useEffect(() => {
    if (authState !== 'logging_out' && authState !== 'unauthenticated') {
      void logout();
    }
  }, [logout, authState]);

  if (authState === 'unauthenticated') {
    return <Redirect to={ROUTES.login} />;
  }

  return <LoggingOutScreen />;
}
