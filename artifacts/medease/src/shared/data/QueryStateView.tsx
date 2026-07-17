import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

import { getFriendlyQueryErrorMessage } from '@/services/api/query-errors';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { ListEmptyState } from '@/shared/data/ListEmptyState';

interface QueryStateViewProps<T> {
  query: UseQueryResult<T>;
  skeleton?: ReactNode;
  empty?: ReactNode;
  isEmpty?: (data: T) => boolean;
  children: (data: T) => ReactNode;
  loadingLabel?: string;
}

function DefaultSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

/** Standard loading / refreshing / empty / error / success states for server data. */
export function QueryStateView<T>({
  query,
  skeleton,
  empty,
  isEmpty,
  children,
  loadingLabel = 'Loading data',
}: QueryStateViewProps<T>) {
  const { isLoading, isFetching, isError, error, data, refetch, isSuccess } =
    query;

  if (isLoading) {
    return (
      <>
        <span className="sr-only">{loadingLabel}</span>
        {skeleton ?? <DefaultSkeleton />}
      </>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 text-center"
        role="alert"
      >
        <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
        <div>
          <p className="font-medium">Unable to load data</p>
          <p className="text-sm text-muted-foreground mt-1">
            {getFriendlyQueryErrorMessage(error)}
          </p>
        </div>
        <Button variant="outline" onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (isSuccess && data !== undefined && isEmpty?.(data)) {
    return (
      empty ?? (
        <ListEmptyState
          title="No records yet"
          description="There is nothing to show in this view."
        />
      )
    );
  }

  if (data === undefined) {
    return skeleton ?? <DefaultSkeleton />;
  }

  return (
    <div aria-busy={isFetching} aria-live="polite">
      {children(data)}
    </div>
  );
}
