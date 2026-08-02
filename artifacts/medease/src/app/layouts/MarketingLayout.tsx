import { useEffect, type ReactNode } from 'react';

import '@/styles/marketing.css';

import { MarketingCtaProvider } from '@/features/marketing/components/MarketingCtaProvider';
import { MarketingFooter } from '@/features/marketing/components/MarketingFooter';
import { MarketingHeader } from '@/features/marketing/components/MarketingHeader';

interface MarketingLayoutProps {
  children: ReactNode;
}

/** Public website layout — marketing pages without dashboard shell. */
export function MarketingLayout({ children }: MarketingLayoutProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    root.style.colorScheme = 'light';
  }, []);

  return (
    <MarketingCtaProvider>
      <div className="marketing-site light flex min-h-screen flex-col bg-background text-foreground">
        <MarketingHeader />
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <MarketingFooter />
      </div>
    </MarketingCtaProvider>
  );
}
