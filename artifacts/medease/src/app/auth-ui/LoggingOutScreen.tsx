import { Spinner } from '@/shared/ui/spinner';

export function LoggingOutScreen() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner className="h-8 w-8" />
      <p className="text-sm text-muted-foreground">Signing you out…</p>
    </div>
  );
}
