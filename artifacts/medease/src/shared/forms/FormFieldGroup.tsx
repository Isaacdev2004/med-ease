import type { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface FormFieldGroupProps {
  title?: string;
  description?: string;
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

/** Visually groups related inputs within a form section. */
export function FormFieldGroup({
  title,
  description,
  children,
  columns = 1,
  className,
}: FormFieldGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {title ? (
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          {description ? (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          'grid gap-4',
          columns === 2 && 'sm:grid-cols-2',
          columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {children}
      </div>
    </div>
  );
}
