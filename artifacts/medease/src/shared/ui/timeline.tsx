import * as React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string;
  status: 'completed' | 'current' | 'upcoming' | 'error';
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div
      className={cn(
        'relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent',
        className,
      )}
    >
      {items.map((item) => {
        const isCompleted = item.status === 'completed';
        const isCurrent = item.status === 'current';
        const isError = item.status === 'error';
        const isUpcoming = item.status === 'upcoming';

        return (
          <div
            key={item.id}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            {/* Icon */}
            <div
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors',
                isCompleted ? 'border-primary text-primary' : '',
                isCurrent
                  ? 'border-primary bg-primary text-primary-foreground'
                  : '',
                isError ? 'border-destructive text-destructive' : '',
                isUpcoming ? 'border-muted text-muted-foreground' : '',
              )}
            >
              {isCompleted && <CheckCircle2 className="w-5 h-5" />}
              {isCurrent && <Circle className="w-4 h-4 fill-current" />}
              {isError && <AlertCircle className="w-5 h-5" />}
              {isUpcoming && <Clock className="w-5 h-5" />}
            </div>

            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm transition-all hover-elevate">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                <h4
                  className={cn(
                    'font-semibold text-base',
                    isCurrent ? 'text-primary' : 'text-foreground',
                  )}
                >
                  {item.title}
                </h4>
                {item.date && (
                  <time className="text-xs font-mono text-muted-foreground mt-1 sm:mt-0">
                    {item.date}
                  </time>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
