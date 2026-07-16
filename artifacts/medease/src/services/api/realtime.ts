import type { QueryClient, QueryKey } from '@tanstack/react-query';

export type RealtimeEventHandler<T = unknown> = (payload: T) => void;

export interface RealtimeSubscription {
  unsubscribe: () => void;
}

/**
 * Supabase Realtime stub — merges events into React Query cache instead of refetching.
 * Replace implementation when Supabase client is connected.
 */
export function subscribeToRealtimeChannel<T>({
  channel,
  queryClient,
  queryKey,
  merge,
}: {
  channel: string;
  queryClient: QueryClient;
  queryKey: QueryKey;
  merge: (current: T | undefined, event: T) => T;
}): RealtimeSubscription {
  if (import.meta.env.DEV) {
    console.info('[realtime-stub] subscribed', channel);
  }

  void queryClient;
  void queryKey;
  void merge;

  return {
    unsubscribe() {
      if (import.meta.env.DEV) {
        console.info('[realtime-stub] unsubscribed', channel);
      }
    },
  };
}

export function mergeListItem<T extends { id: string }>(
  current: T[] | undefined,
  item: T,
): T[] {
  const list = current ?? [];
  const index = list.findIndex((entry) => entry.id === item.id);
  if (index === -1) return [item, ...list];
  const next = [...list];
  next[index] = item;
  return next;
}

export function mergeCounter(
  current: number | undefined,
  delta: number,
): number {
  return (current ?? 0) + delta;
}
