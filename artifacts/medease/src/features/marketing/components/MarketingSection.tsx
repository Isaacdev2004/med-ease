import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface MarketingSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'muted' | 'accent';
}

export function MarketingSection({
  id,
  title,
  subtitle,
  children,
  className,
  tone = 'default',
}: MarketingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-20 md:py-28',
        tone === 'muted' && 'bg-muted/30 border-y',
        tone === 'accent' && 'bg-sidebar border-y',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {title ? (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
