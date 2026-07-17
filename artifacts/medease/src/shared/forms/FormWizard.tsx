import { useState } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

import { LoadingButton } from '@/shared/components/LoadingButton';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';
import { StepIndicator, type WizardStep } from '@/shared/forms/StepIndicator';
import { cn } from '@/shared/lib/utils';

interface FormWizardProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  steps: WizardStep[];
  renderStep: (stepIndex: number) => React.ReactNode;
  onComplete: (values: T) => void | Promise<void>;
  validateStep?: (stepIndex: number, values: T) => Promise<boolean> | boolean;
  submitting?: boolean;
  className?: string;
}

/** Multi-step form wizard with step indicator and review flow. */
export function FormWizard<T extends FieldValues>({
  form,
  steps,
  renderStep,
  onComplete,
  validateStep,
  submitting,
  className,
}: FormWizardProps<T>) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === steps.length - 1;

  async function goNext() {
    const valid = validateStep
      ? await validateStep(currentStep, form.getValues())
      : await form.trigger();

    if (!valid) return;

    if (isLastStep) {
      await onComplete(form.getValues());
      return;
    }

    setCurrentStep((step) => step + 1);
  }

  function goBack() {
    setCurrentStep((step) => Math.max(0, step - 1));
  }

  return (
    <Form {...form}>
      <div className={cn('space-y-8', className)}>
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="rounded-lg border p-6">{renderStep(currentStep)}</div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 0 || submitting}
          >
            Back
          </Button>
          <LoadingButton
            type="button"
            loading={submitting}
            onClick={() => void goNext()}
          >
            {isLastStep ? 'Submit' : 'Continue'}
          </LoadingButton>
        </div>
      </div>
    </Form>
  );
}
