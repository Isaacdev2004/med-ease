import type { ReactNode } from 'react';

import { Spinner } from '@/shared/ui/spinner';
import { Skeleton } from '@/shared/ui/skeleton';
import { cn } from '@/shared/lib/utils';

interface LoadingViewProps {
  label?: string;
  variant?: 'spinner' | 'skeleton' | 'skeleton-table';
  className?: string;
  children?: ReactNode;
}

/** Standard loading states — skeleton preferred over spinners. */
export function LoadingView({
  label = 'Loading',
  variant = 'skeleton',
  className,
  children,
}: LoadingViewProps) {
  if (children) {
    return (
      <div
        className={cn('relative', className)}
        aria-busy="true"
        aria-live="polite"
      >
        <div className="opacity-50 pointer-events-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="h-6 w-6" />
        </div>
      </div>
    );
  }

  if (variant === 'spinner') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-3 py-12',
          className,
        )}
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Spinner className="h-8 w-8" />
        <span className="text-sm text-muted-foreground">{label}…</span>
      </div>
    );
  }

  if (variant === 'skeleton-table') {
    return (
      <div
        className={cn('space-y-2', className)}
        aria-busy="true"
        aria-live="polite"
      >
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div
      className={cn('space-y-3', className)}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">{label}</span>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
