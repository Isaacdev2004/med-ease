import { BedDouble } from 'lucide-react';

import { StatusBadge } from '@/shared/components/StatusBadge';
import type { HealthcareStatus } from '@/config/design-tokens';
import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export type BedStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

const bedStatusMap: Record<BedStatus, HealthcareStatus> = {
  available: 'stable',
  occupied: 'critical',
  reserved: 'pending',
  maintenance: 'observation',
};

export interface BedStatusCardProps {
  label: string;
  ward: string;
  status: BedStatus;
  patientName?: string;
  className?: string;
}

export function BedStatusCard({
  label,
  ward,
  status,
  patientName,
  className,
}: BedStatusCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4 flex items-start gap-3">
        <div className="rounded-full bg-muted p-2">
          <BedDouble
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold">{label}</h4>
            <StatusBadge status={bedStatusMap[status]} label={status} />
          </div>
          <p className="text-sm text-muted-foreground">{ward}</p>
          {patientName ? (
            <p className="text-xs text-muted-foreground mt-1">{patientName}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
