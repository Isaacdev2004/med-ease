import type { ReactNode } from 'react';
import { MapPin, Phone } from 'lucide-react';

import { StatusBadge } from '@/shared/components/StatusBadge';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/card';
import type { HealthcareStatus } from '@/config/design-tokens';
import { cn } from '@/shared/lib/utils';

interface DirectoryCardProps {
  name: string;
  subtitle?: string;
  type: 'professional' | 'facility' | 'pharmacy' | 'transport';
  status?: HealthcareStatus;
  location?: string;
  specialization?: string;
  availability?: string;
  phone?: string;
  actions?: ReactNode;
  className?: string;
}

const TYPE_LABELS: Record<DirectoryCardProps['type'], string> = {
  professional: 'Healthcare Professional',
  facility: 'Facility',
  pharmacy: 'Pharmacy',
  transport: 'Transport Provider',
};

/** Directory card for professionals, facilities, pharmacies, and transport providers. */
export function DirectoryCard({
  name,
  subtitle,
  type,
  status = 'stable',
  location,
  specialization,
  availability,
  phone,
  actions,
  className,
}: DirectoryCardProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold leading-tight">{name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {TYPE_LABELS[type]}
              </p>
            </div>
            <StatusBadge status={status} />
          </div>
          {subtitle ? (
            <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {specialization ? (
          <p>
            <span className="text-muted-foreground">Specialization: </span>
            {specialization}
          </p>
        ) : null}
        {location ? (
          <p className="flex items-center gap-2">
            <MapPin
              className="h-4 w-4 text-muted-foreground shrink-0"
              aria-hidden="true"
            />
            {location}
          </p>
        ) : null}
        {availability ? (
          <p>
            <span className="text-muted-foreground">Availability: </span>
            {availability}
          </p>
        ) : null}
        {phone ? (
          <p className="flex items-center gap-2">
            <Phone
              className="h-4 w-4 text-muted-foreground shrink-0"
              aria-hidden="true"
            />
            {phone}
          </p>
        ) : null}
      </CardContent>
      {actions ? <CardFooter className="gap-2">{actions}</CardFooter> : null}
    </Card>
  );
}
