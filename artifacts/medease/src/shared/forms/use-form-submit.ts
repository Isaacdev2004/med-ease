import { useState } from 'react';

import { appToast } from '@/services/api/toast';
import { toFriendlyErrorMessage } from '@/shared/forms/map-server-errors';

interface UseFormSubmitOptions<T> {
  onSubmit: (values: T) => Promise<void>;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

/** Standard submission flow: validate → submit → loading → toast → callback. */
export function useFormSubmit<T>({
  onSubmit,
  successMessage = 'Changes saved successfully.',
  errorMessage = 'Unable to save your changes. Please try again.',
  onSuccess,
}: UseFormSubmitOptions<T>) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: T) => {
    setSubmitting(true);
    try {
      await onSubmit(values);
      appToast.success({ title: successMessage });
      onSuccess?.();
    } catch (error) {
      appToast.error({
        title: errorMessage,
        description: toFriendlyErrorMessage(error, errorMessage),
      });
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, handleSubmit };
}
