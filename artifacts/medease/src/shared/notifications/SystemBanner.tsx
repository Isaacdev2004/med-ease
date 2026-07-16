import type { ReactNode } from 'react';
import { AlertTriangle, Info, Shield, WifiOff, X } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

type SystemBannerVariant = 'offline' | 'maintenance' | 'emergency' | 'security' | 'info';

interface SystemBannerProps {
  variant: SystemBannerVariant;
  title: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<SystemBannerVariant, string> = {
  offline: 'border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100',
  maintenance: 'border-blue-500/30 bg-blue-500/10 text-blue-950 dark:text-blue-100',
  emergency: 'border-destructive/40 bg-destructive/10 text-destructive',
  security: 'border-orange-500/30 bg-orange-500/10 text-orange-950 dark:text-orange-100',
  info: 'border-border bg-muted/50 text-foreground',
};

const VARIANT_ICONS: Record<SystemBannerVariant, typeof Info> = {
  offline: WifiOff,
  maintenance: Info,
  emergency: AlertTriangle,
  security: Shield,
  info: Info,
};

export function SystemBanner({
  variant,
  title,
  message,
  dismissible,
  onDismiss,
  action,
  className,
}: SystemBannerProps) {
  const Icon = VARIANT_ICONS[variant];

  return (
    <div
      className={cn(
        'sticky top-0 z-[60] flex items-start gap-3 border-b px-4 py-3',
        VARIANT_STYLES[variant],
        className,
      )}
      role={variant === 'emergency' ? 'alert' : 'status'}
      aria-live={variant === 'emergency' ? 'assertive' : 'polite'}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        {message ? <p className="text-sm opacity-90 mt-0.5">{message}</p> : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
      {dismissible ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onDismiss}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

/** Offline banner — re-export pattern aligned with Doc 03.10. */
export function OfflineBanner() {
  return (
    <SystemBanner
      variant="offline"
      title="You are offline"
      message="Cached data remains available. Notification actions will sync when you reconnect."
    />
  );
}
