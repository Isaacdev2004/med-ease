import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

/** Maps server field errors to React Hook Form — never show raw backend messages. */
export function mapServerErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  errors: Partial<Record<Path<T>, string>> | Record<string, string>,
) {
  for (const [field, message] of Object.entries(errors)) {
    if (!message) continue;
    form.setError(field as Path<T>, {
      type: 'server',
      message,
    });
  }
}

/** Converts unknown API errors into user-friendly messages. */
export function toFriendlyErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message && !error.message.includes('fetch')) {
    return error.message;
  }
  return fallback;
}
