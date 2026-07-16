import type { ReactNode } from 'react';

import { TYPOGRAPHY } from '@/config/design-tokens';
import { cn } from '@/shared/lib/utils';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/** Grouped form section with consistent heading hierarchy. */
export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <fieldset className={cn('space-y-4 rounded-lg border p-4', className)}>
      <legend className="px-1">
        <span className={TYPOGRAPHY.h4}>{title}</span>
        {description ? (
          <p className="text-sm text-muted-foreground font-normal mt-1">{description}</p>
        ) : null}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}
