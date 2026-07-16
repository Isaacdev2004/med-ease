import { z } from 'zod';

import {
  emailField,
  passwordField,
  phoneField,
  requiredString,
} from '@/shared/forms/zod-messages';

export const loginSchema = z.object({
  email: emailField(),
  password: requiredString('Password'),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: requiredString('First name'),
    lastName: requiredString('Last name'),
    email: emailField(),
    role: z.enum(['patient', 'professional', 'facility'], {
      required_error: 'Please select a role.',
    }),
    password: passwordField(),
    confirmPassword: requiredString('Password confirmation'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField(),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const emergencyContactSchema = z.object({
  name: requiredString('Contact name'),
  relationship: requiredString('Relationship'),
  phone: phoneField(),
  email: emailField().optional().or(z.literal('')),
});

export type EmergencyContactFormValues = z.infer<typeof emergencyContactSchema>;
