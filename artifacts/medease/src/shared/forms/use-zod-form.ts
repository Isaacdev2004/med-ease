import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type DefaultValues, type FieldValues, type UseFormReturn } from 'react-hook-form';
import type { ZodType } from 'zod';

/** Creates a React Hook Form instance with Zod validation — standard for all Med-ease forms. */
export function useZodForm<T extends FieldValues>(
  schema: ZodType<T>,
  defaultValues?: DefaultValues<T>,
): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  });
}
