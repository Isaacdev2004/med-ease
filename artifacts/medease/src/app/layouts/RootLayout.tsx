import type { ReactNode } from 'react';

import { RouteErrorBoundary } from '@/app/error-boundaries/RouteErrorBoundary';

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Root layout — application bootstrap frame.
 * Providers live in AppProviders; this adds accessibility landmarks and global boundaries.
 */
export function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:m-4 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <RouteErrorBoundary moduleName="Application">
        {children}
      </RouteErrorBoundary>
    </>
  );
}
