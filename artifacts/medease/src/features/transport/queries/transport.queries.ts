import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { transportService } from '@/features/transport/services/transport.service';

export const transportQueries = {
  pending: (filters?: Record<string, unknown>) => ({
    queryKey: queryKeys.transfers.list(filters),
    queryFn: () =>
      transportService.listPending(
        filters?.status ? { status: String(filters.status) } : undefined,
      ),
    staleTime: CACHE_TIMES.dashboard,
  }),
};
