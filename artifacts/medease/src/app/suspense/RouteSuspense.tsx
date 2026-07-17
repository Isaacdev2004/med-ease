import { Suspense, type ReactNode } from 'react';

import { Spinner } from '@/shared/ui/spinner';

interface RouteSuspenseProps {
  children: ReactNode;
  label?: string;
}

export function RouteSuspense({
  children,
  label = 'Loading',
}: RouteSuspenseProps) {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-6"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">{label}...</p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
