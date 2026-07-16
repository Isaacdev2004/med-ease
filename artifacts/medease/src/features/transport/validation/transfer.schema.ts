import { z } from 'zod';

import {
  futureDateField,
  phoneField,
  requiredString,
} from '@/shared/forms/zod-messages';

export const transferRequestSchema = z.object({
  patientName: requiredString('Patient name'),
  patientId: requiredString('Patient ID'),
  originFacility: requiredString('Origin facility'),
  destinationFacility: requiredString('Destination facility'),
  urgency: z.enum(['routine', 'urgent', 'critical'], {
    required_error: 'Please select an urgency level.',
  }),
  clinicalSummary: requiredString('Clinical summary'),
  contactPhone: phoneField(),
  requestedDate: futureDateField('Requested transfer date'),
  referralDocument: z
    .custom<FileList | File | null | undefined>()
    .optional()
    .nullable(),
});

export type TransferRequestFormValues = z.infer<typeof transferRequestSchema>;

export const transferWizardSteps = [
  { id: 'patient', title: 'Patient', description: 'Identify the patient' },
  { id: 'facilities', title: 'Facilities', description: 'Origin and destination' },
  { id: 'clinical', title: 'Clinical', description: 'Summary and urgency' },
  { id: 'review', title: 'Review', description: 'Confirm and submit' },
] as const;

export const transferStepFields: (keyof TransferRequestFormValues)[][] = [
  ['patientName', 'patientId', 'contactPhone'],
  ['originFacility', 'destinationFacility', 'requestedDate'],
  ['urgency', 'clinicalSummary', 'referralDocument'],
  [],
];
