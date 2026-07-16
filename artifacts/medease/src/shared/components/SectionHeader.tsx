import type { ReactNode } from 'react';

import { TYPOGRAPHY } from '@/config/design-tokens';
import { cn } from '@/shared/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

/** Consistent section heading with optional description and actions. */
export function SectionHeader({
  title,
  description,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4',
        className,
      )}
    >
      <div>
        <h2 className={TYPOGRAPHY.h3}>{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
