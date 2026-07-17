import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

interface ErrorViewProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  supportAction?: ReactNode;
  className?: string;
}

/** Friendly error state — never expose technical messages. */
export function ErrorView({
  title = 'Something went wrong',
  description = 'We could not load this content. Please try again.',
  onRetry,
  supportAction,
  className,
}: ErrorViewProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center',
        className,
      )}
      role="alert"
    >
      <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {onRetry ? (
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
        {supportAction}
      </div>
    </div>
  );
}
