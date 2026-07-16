import type { ReactNode } from 'react';

import { useRealtime } from '@/features/notifications/hooks/use-realtime';

/** Starts Supabase-ready realtime subscriptions for authenticated users. */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  useRealtime();
  return children;
}
