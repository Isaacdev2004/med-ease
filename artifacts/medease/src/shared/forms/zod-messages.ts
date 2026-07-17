import { z } from 'zod';

/** Friendly, actionable Zod field helpers — never expose backend errors in UI. */
export const requiredString = (label: string) =>
  z.string().trim().min(1, `${label} is required.`);

export const emailField = () =>
  z
    .string()
    .trim()
    .min(1, 'Email address is required.')
    .email('Please enter a valid email address.');

export const passwordField = (minLength = 12) =>
  z
    .string()
    .min(minLength, `Password must be at least ${minLength} characters.`)
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must include a special character.',
    );

export const phoneField = () =>
  z
    .string()
    .trim()
    .min(1, 'Phone number is required.')
    .regex(/^[+]?[\d\s().-]{7,20}$/, 'Please enter a valid phone number.');

export const optionalPhoneField = () =>
  z
    .string()
    .trim()
    .regex(/^$|^[+]?[\d\s().-]{7,20}$/, 'Please enter a valid phone number.')
    .optional()
    .or(z.literal(''));

export const dateField = (label: string) =>
  z.coerce.date({
    required_error: `${label} is required.`,
    invalid_type_error: `Please enter a valid ${label.toLowerCase()}.`,
  });

export const futureDateField = (label: string) =>
  dateField(label).refine(
    (value) => value >= new Date(new Date().setHours(0, 0, 0, 0)),
    {
      message: `${label} must be today or in the future.`,
    },
  );

export const positiveNumberField = (label: string) =>
  z.coerce
    .number({
      required_error: `${label} is required.`,
      invalid_type_error: `Please enter a valid ${label.toLowerCase()}.`,
    })
    .positive(`${label} must be greater than zero.`);

export const fileUploadField = (options?: {
  maxSizeMb?: number;
  accept?: string[];
}) => {
  const maxSizeMb = options?.maxSizeMb ?? 10;
  const accept = options?.accept ?? [
    'application/pdf',
    'image/jpeg',
    'image/png',
  ];

  return z
    .custom<FileList | File | null | undefined>()
    .refine(
      (value) => {
        if (!value) return false;
        const file = value instanceof FileList ? value[0] : value;
        return Boolean(file);
      },
      { message: 'Please select a file to upload.' },
    )
    .refine(
      (value) => {
        const file = value instanceof FileList ? value[0] : value;
        if (!file) return true;
        return file.size <= maxSizeMb * 1024 * 1024;
      },
      { message: `File must be smaller than ${maxSizeMb} MB.` },
    )
    .refine(
      (value) => {
        const file = value instanceof FileList ? value[0] : value;
        if (!file) return true;
        return accept.includes(file.type);
      },
      { message: 'Unsupported file type. Use PDF, JPEG, or PNG.' },
    );
};
