import * as React from 'react';
import { Pill, Clock, Calendar, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { StatusDot } from '@/shared/medical/StatusDot';
import { cn } from '@/shared/lib/utils';

export interface MedicationProps {
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  status: 'active' | 'completed' | 'discontinued' | 'paused';
  nextDose?: string;
  refillsRemaining?: number;
  instructions?: string;
  className?: string;
}

export function MedicationCard({
  name,
  dosage,
  frequency,
  prescribedBy,
  status,
  nextDose,
  refillsRemaining,
  instructions,
  className,
}: MedicationProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden hover-elevate transition-all duration-300',
        className,
      )}
    >
      <div
        className={cn(
          'h-1 w-full',
          status === 'active'
            ? 'bg-primary'
            : status === 'completed'
              ? 'bg-success'
              : status === 'paused'
                ? 'bg-warning'
                : 'bg-muted',
        )}
      />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div
              className={cn(
                'p-3 rounded-full flex-shrink-0 mt-1',
                status === 'active'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-semibold text-base leading-none">{name}</h4>
                <Badge
                  variant={status === 'active' ? 'default' : 'secondary'}
                  className="text-xs h-5 px-1.5 uppercase"
                >
                  {status}
                </Badge>
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                {dosage}
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {instructions}
              </p>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1.5 h-3.5 w-3.5" />
                  {frequency}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1.5 h-3.5 w-3.5" />
                  Dr. {prescribedBy}
                </div>
              </div>
            </div>
          </div>
        </div>

        {status === 'active' && (
          <div className="mt-5 pt-4 border-t flex items-center justify-between text-sm">
            <div className="flex items-center font-medium text-primary">
              <StatusDot status="default" animate className="mr-2" />
              Next dose: {nextDose}
            </div>
            {refillsRemaining !== undefined && (
              <div
                className={cn(
                  'font-medium flex items-center',
                  refillsRemaining === 0
                    ? 'text-destructive'
                    : 'text-muted-foreground',
                )}
              >
                {refillsRemaining === 0 && (
                  <AlertCircle className="mr-1 h-3.5 w-3.5" />
                )}
                {refillsRemaining} refills left
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
