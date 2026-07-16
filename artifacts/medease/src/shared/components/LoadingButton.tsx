import type { CSSProperties } from 'react';
import { Loader2 } from 'lucide-react';

import { Button, type ButtonProps } from '@/shared/ui/button';
import { TOUCH_TARGET_MIN } from '@/config/design-tokens';
import { cn } from '@/shared/lib/utils';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingLabel?: string;
}

/** Button with loading state and minimum 44px touch target. */
export function LoadingButton({
  loading,
  loadingLabel = 'Loading',
  disabled,
  children,
  className,
  size,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn('min-h-[var(--touch-min)] min-w-[var(--touch-min)]', className)}
      size={size}
      style={{ '--touch-min': `${TOUCH_TARGET_MIN}px` } as CSSProperties}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
