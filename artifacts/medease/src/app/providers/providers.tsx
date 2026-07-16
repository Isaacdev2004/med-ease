import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Router as WouterRouter } from 'wouter';

import { ApiProvider } from '@/app/providers/ApiProvider';
import { RealtimeProvider } from '@/app/providers/RealtimeProvider';
import { AuthStateBoundary } from '@/app/auth-ui/AuthStateBoundary';
import { RootLayout } from '@/app/layouts/RootLayout';
import { AppRouter } from '@/app/router/router';
import { env } from '@/config/env';
import '@/config/routes/index';
import { queryClient } from '@/services/api/query-client';
import { AuthProvider } from '@/services/auth/auth-context';
import { Toaster } from '@/shared/ui/toaster';
import { TooltipProvider } from '@/shared/ui/tooltip';

export function AppProviders() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ApiProvider>
            <RealtimeProvider>
              <AuthStateBoundary>
              <TooltipProvider>
                <RootLayout>
                  <WouterRouter base={env.baseUrl}>
                    <AppRouter />
                  </WouterRouter>
                </RootLayout>
                <Toaster />
              </TooltipProvider>
              </AuthStateBoundary>
            </RealtimeProvider>
          </ApiProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
