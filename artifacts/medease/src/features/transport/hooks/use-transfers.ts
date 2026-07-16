import { useQuery } from '@tanstack/react-query';

import { transportQueries } from '@/features/transport/queries/transport.queries';

export function useTransfers(filters?: Record<string, unknown>) {
  return useQuery(transportQueries.pending(filters));
}
