import type {
  QueryClient,
  QueryKey,
  UseMutationOptions,
} from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { getFriendlyQueryErrorMessage } from '@/services/api/query-errors';

interface OptimisticMutationOptions<TData, TVariables, TContext> {
  queryClient: QueryClient;
  queryKey: QueryKey;
  /** Apply optimistic patch to cached data. */
  optimisticUpdate: (current: TData, variables: TVariables) => TData;
  /** Keys to invalidate on success — never invalidate entire cache. */
  invalidateKeys?: QueryKey[];
  entityLabel?: string;
  mutationOptions?: Omit<
    UseMutationOptions<TData, Error, TVariables, TContext>,
    'onMutate' | 'onError' | 'onSuccess' | 'onSettled'
  >;
}

export function createOptimisticMutationOptions<
  TData,
  TVariables,
  TContext = { previous?: TData },
>({
  queryClient,
  queryKey,
  optimisticUpdate,
  invalidateKeys = [],
  entityLabel = 'Record',
}: OptimisticMutationOptions<TData, TVariables, TContext>): Pick<
  UseMutationOptions<TData, Error, TVariables, TContext>,
  'onMutate' | 'onError' | 'onSuccess' | 'onSettled'
> {
  return {
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<TData>(queryKey);

      if (previous !== undefined) {
        queryClient.setQueryData<TData>(
          queryKey,
          optimisticUpdate(previous, variables),
        );
      }

      return { previous } as TContext;
    },
    onError: (error, _variables, context) => {
      const ctx = context as { previous?: TData } | undefined;
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
      appToast.mutationError(
        entityLabel,
        getFriendlyQueryErrorMessage(error),
      );
    },
    onSuccess: () => {
      appToast.mutationSuccess(entityLabel);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });
      for (const key of invalidateKeys) {
        await queryClient.invalidateQueries({ queryKey: key });
      }
    },
  };
}

/** Invalidate only affected query keys after a mutation. */
export async function invalidateQueries(
  queryClient: QueryClient,
  keys: QueryKey[],
): Promise<void> {
  await Promise.all(
    keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );
}
