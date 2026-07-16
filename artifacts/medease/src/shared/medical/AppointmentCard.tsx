import type { ReactNode } from 'react';
import { Calendar, MapPin, Stethoscope } from 'lucide-react';

import { StatusBadge } from '@/shared/components/StatusBadge';
import type { HealthcareStatus } from '@/config/design-tokens';
import { Card, CardContent, CardFooter } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export interface AppointmentCardProps {
  providerName: string;
  specialty: string;
  scheduledAt: string;
  location: string;
  status?: HealthcareStatus;
  actions?: ReactNode;
  className?: string;
}

export function AppointmentCard({
  providerName,
  specialty,
  scheduledAt,
  location,
  status = 'pending',
  actions,
  className,
}: AppointmentCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold">{providerName}</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
              {specialty}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {scheduledAt}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {location}
        </p>
      </CardContent>
      {actions ? <CardFooter className="border-t py-3">{actions}</CardFooter> : null}
    </Card>
  );
}
