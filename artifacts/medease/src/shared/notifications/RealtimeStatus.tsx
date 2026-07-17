import { Radio, Wifi, WifiOff } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface RealtimeStatusProps {
  connected: boolean;
  offline?: boolean;
  className?: string;
}

/** Realtime connection indicator for notification center. */
export function RealtimeStatus({
  connected,
  offline,
  className,
}: RealtimeStatusProps) {
  const Icon = offline ? WifiOff : connected ? Radio : Wifi;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        offline
          ? 'text-amber-700 dark:text-amber-300'
          : connected
            ? 'text-emerald-700 dark:text-emerald-300'
            : 'text-muted-foreground',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Icon
        className={cn('h-3.5 w-3.5', connected && !offline && 'animate-pulse')}
        aria-hidden="true"
      />
      {offline
        ? 'Offline — actions queued'
        : connected
          ? 'Live sync active'
          : 'Connecting…'}
    </div>
  );
}
