import type { ReactNode } from 'react';

import { MarketingEyebrow } from '@/features/marketing/components/MarketingEyebrow';
import { cn } from '@/shared/lib/utils';

interface MarketingSectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'muted' | 'accent';
}

export function MarketingSection({
  id,
  title,
  subtitle,
  eyebrow,
  children,
  className,
  tone = 'default',
}: MarketingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-20 md:py-28',
        tone === 'muted' && 'bg-muted/40 border-y border-border/60',
        tone === 'accent' &&
          'border-y border-primary/10 bg-gradient-to-b from-accent/40 to-background',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(eyebrow || title || subtitle) && (
          <div className="mx-auto mb-12 max-w-3xl text-center">
            {eyebrow ? <MarketingEyebrow label={eyebrow} /> : null}
            {title ? (
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
