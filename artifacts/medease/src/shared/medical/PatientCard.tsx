import { User } from 'lucide-react';

import { StatusBadge } from '@/shared/components/StatusBadge';
import type { HealthcareStatus } from '@/config/design-tokens';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Card, CardContent } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';

export interface PatientCardProps {
  fullName: string;
  mrn?: string;
  age?: number;
  gender?: string;
  status?: HealthcareStatus;
  subtitle?: string;
  className?: string;
}

export function PatientCard({
  fullName,
  mrn,
  age,
  gender,
  status = 'stable',
  subtitle,
  className,
}: PatientCardProps) {
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <Card
      className={cn(
        'overflow-hidden hover-elevate transition-all duration-200',
        className,
      )}
    >
      <CardContent className="p-4 flex gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-semibold truncate">{fullName}</h4>
            <StatusBadge status={status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {[mrn && `MRN ${mrn}`, age && `${age}y`, gender]
              .filter(Boolean)
              .join(' • ')}
          </p>
          {subtitle ? (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <User className="h-3 w-3" aria-hidden="true" />
              {subtitle}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
