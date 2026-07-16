import { Spinner } from '@/shared/ui/spinner';

interface AuthLoadingScreenProps {
  label?: string;
}

export function AuthLoadingScreen({
  label = 'Loading',
}: AuthLoadingScreenProps) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner className="h-8 w-8" />
      <p className="text-sm text-muted-foreground">{label}…</p>
    </div>
  );
}
