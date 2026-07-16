import type { FormEvent, ReactNode } from 'react';

import { TYPOGRAPHY } from '@/config/design-tokens';
import { cn } from '@/shared/lib/utils';

interface FormContainerProps {
  title?: string;
  description?: string;
  helpText?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
  headerExtra?: ReactNode;
  autosave?: ReactNode;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  className?: string;
  noValidate?: boolean;
}

/**
 * Standard form scaffold: header → sections → actions → help.
 * Page → FormContainer → FormSection → Field Groups → Fields
 */
export function FormContainer({
  title,
  description,
  helpText,
  primaryAction,
  secondaryAction,
  headerExtra,
  autosave,
  onSubmit,
  children,
  className,
  noValidate = true,
}: FormContainerProps) {
  return (
    <form
      className={cn('space-y-8', className)}
      onSubmit={onSubmit}
      noValidate={noValidate}
    >
      {(title || description || autosave || headerExtra) ? (
        <header className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              {title ? <h1 className={TYPOGRAPHY.h2}>{title}</h1> : null}
              {description ? (
                <p className="text-muted-foreground">{description}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              {autosave}
              {headerExtra}
            </div>
          </div>
        </header>
      ) : null}

      <div className="space-y-6">{children}</div>

      {(primaryAction || secondaryAction) ? (
        <footer className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between border-t pt-6">
          <div>{secondaryAction}</div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {primaryAction}
          </div>
        </footer>
      ) : null}

      {helpText ? (
        <aside className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          {helpText}
        </aside>
      ) : null}
    </form>
  );
}
