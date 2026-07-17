import { z } from 'zod';

import {
  dateField,
  emailField,
  phoneField,
  requiredString,
} from '@/shared/forms/zod-messages';

export const patientProfileSchema = z.object({
  firstName: requiredString('First name'),
  lastName: requiredString('Last name'),
  dateOfBirth: dateField('Date of birth'),
  gender: z.enum(['female', 'male', 'other', 'prefer_not_to_say'], {
    required_error: 'Please select a gender.',
  }),
  nationality: requiredString('Nationality'),
  email: emailField(),
  phone: phoneField(),
  address: requiredString('Address'),
});

export type PatientProfileFormValues = z.infer<typeof patientProfileSchema>;

export const patientRegistrationSchema = patientProfileSchema.extend({
  emergencyContactName: requiredString('Emergency contact name'),
  emergencyContactPhone: phoneField(),
  insuranceProvider: z.string().trim().optional(),
  consentAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the consent agreement.' }),
  }),
});

export type PatientRegistrationFormValues = z.infer<
  typeof patientRegistrationSchema
>;
