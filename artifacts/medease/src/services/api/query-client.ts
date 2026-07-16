import {
  MutationCache,
  QueryCache,
  QueryClient,
  type QueryKey,
} from '@tanstack/react-query';

import { CACHE_TIMES } from '@/services/api/cache-config';
import {
  classifyQueryError,
  getFriendlyQueryErrorMessage,
  shouldRetryQuery,
} from '@/services/api/query-errors';
import { appToast } from '@/services/api/toast';

function handleGlobalQueryError(error: unknown, queryKey: QueryKey) {
  const kind = classifyQueryError(error);

  if (kind === 'permission') {
    appToast.permissionDenied();
    return;
  }

  if (import.meta.env.DEV) {
    console.error('[query-error]', queryKey, error);
  }
}

function handleGlobalMutationError(error: unknown) {
  const kind = classifyQueryError(error);

  if (kind === 'permission') {
    appToast.permissionDenied();
    return;
  }

  appToast.error({
    title: 'Action failed',
    description: getFriendlyQueryErrorMessage(error),
  });
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => handleGlobalQueryError(error, query.queryKey),
  }),
  mutationCache: new MutationCache({
    onError: (error) => handleGlobalMutationError(error),
  }),
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIMES.default,
      gcTime: CACHE_TIMES.reference,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
