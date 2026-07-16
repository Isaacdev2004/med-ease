import {
  HEALTHCARE_STATUS_LABELS,
  HEALTHCARE_STATUS_VARIANT,
  type HealthcareStatus,
} from '@/config/design-tokens';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface StatusBadgeProps {
  status: HealthcareStatus;
  label?: string;
  className?: string;
}

/** Healthcare-aware status badge using theme tokens only. */
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Badge
      variant={HEALTHCARE_STATUS_VARIANT[status]}
      className={cn('uppercase text-[10px] tracking-wide', className)}
    >
      {label ?? HEALTHCARE_STATUS_LABELS[status]}
    </Badge>
  );
}
