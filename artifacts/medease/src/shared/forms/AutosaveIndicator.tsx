import { Check, CloudOff, Loader2 } from 'lucide-react';

import type { AutosaveStatus } from '@/shared/forms/use-form-draft';
import { cn } from '@/shared/lib/utils';

interface AutosaveIndicatorProps {
  status: AutosaveStatus;
  className?: string;
}

const LABELS: Record<AutosaveStatus, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'Saved',
  error: 'Save failed',
};

/** Displays autosave status for long forms. */
export function AutosaveIndicator({ status, className }: AutosaveIndicatorProps) {
  if (status === 'idle') return null;

  return (
    <output
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground',
        status === 'error' && 'text-destructive',
        className,
      )}
      aria-live="polite"
    >
      {status === 'saving' ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
      ) : null}
      {status === 'saved' ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
      ) : null}
      {status === 'error' ? (
        <CloudOff className="h-3.5 w-3.5" aria-hidden="true" />
      ) : null}
      {LABELS[status]}
    </output>
  );
}
