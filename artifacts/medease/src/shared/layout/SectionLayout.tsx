import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface SectionLayoutProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionLayout({
  title,
  description,
  actions,
  children,
  className,
}: SectionLayoutProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            ) : null}
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex gap-2">{actions}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
