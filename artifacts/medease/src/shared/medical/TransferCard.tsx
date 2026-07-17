import { Ambulance, Building2 } from 'lucide-react';

import { StatusBadge } from '@/shared/components/StatusBadge';
import type { HealthcareStatus } from '@/config/design-tokens';
import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export interface TransferCardProps {
  patientName: string;
  fromFacility: string;
  toFacility: string;
  status?: HealthcareStatus;
  scheduledAt?: string;
  className?: string;
}

export function TransferCard({
  patientName,
  fromFacility,
  toFacility,
  status = 'transferred',
  scheduledAt,
  className,
}: TransferCardProps) {
  return (
    <Card className={cn('overflow-hidden hover-elevate', className)}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold">{patientName}</h4>
          <StatusBadge status={status} />
        </div>
        <div className="text-sm space-y-2">
          <p className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            From: {fromFacility}
          </p>
          <p className="flex items-center gap-2 text-muted-foreground">
            <Ambulance className="h-4 w-4" aria-hidden="true" />
            To: {toFacility}
          </p>
        </div>
        {scheduledAt ? (
          <p className="text-xs text-muted-foreground">
            Scheduled {scheduledAt}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
