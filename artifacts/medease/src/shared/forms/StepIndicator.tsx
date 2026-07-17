import { Check } from 'lucide-react';

import { Progress } from '@/shared/ui/progress';
import { cn } from '@/shared/lib/utils';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: WizardStep[];
  currentStep: number;
  className?: string;
}

/** Multi-step wizard progress with titles and completion state. */
export function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <nav aria-label="Form progress" className={cn('space-y-4', className)}>
      <Progress value={progress} className="h-1.5" aria-hidden="true" />
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <li
              key={step.id}
              className={cn(
                'rounded-lg border p-3 transition-colors',
                active && 'border-primary bg-primary/5',
                completed && 'border-emerald-500/40 bg-emerald-500/5',
              )}
              aria-current={active ? 'step' : undefined}
            >
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                    active && 'bg-primary text-primary-foreground',
                    completed && 'bg-emerald-600 text-white',
                    !active && !completed && 'bg-muted text-muted-foreground',
                  )}
                >
                  {completed ? (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  {step.description ? (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {step.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
