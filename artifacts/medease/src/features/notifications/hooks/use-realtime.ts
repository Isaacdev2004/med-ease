import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { startNotificationRealtime } from '@/services/notifications/realtime.service';
import { useAuth } from '@/services/auth/auth-context';

/** Subscribes to Supabase-ready realtime channels and merges cache updates. */
export function useRealtime() {
  const queryClient = useQueryClient();
  const { user, organization, isAuthenticated, isOffline } = useAuth();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !organization?.id) return;

    setConnected(true);
    const subscription = startNotificationRealtime({
      queryClient,
      userId: user.id,
      organizationId: organization.id,
      enabled: !isOffline,
    });

    return () => {
      setConnected(false);
      subscription.unsubscribe();
    };
  }, [isAuthenticated, isOffline, organization?.id, queryClient, user?.id]);

  return { connected: connected && !isOffline, offline: isOffline };
}
