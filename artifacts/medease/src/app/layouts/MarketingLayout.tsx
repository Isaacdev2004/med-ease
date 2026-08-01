import type { ReactNode } from 'react';

import { MarketingCtaProvider } from '@/features/marketing/components/MarketingCtaProvider';
import { MarketingFooter } from '@/features/marketing/components/MarketingFooter';
import { MarketingHeader } from '@/features/marketing/components/MarketingHeader';

interface MarketingLayoutProps {
  children: ReactNode;
}

/** Public website layout — marketing pages without dashboard shell. */
export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <MarketingCtaProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <MarketingHeader />
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <MarketingFooter />
      </div>
    </MarketingCtaProvider>
  );
}
