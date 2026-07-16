import { z } from 'zod';

import { requiredString } from '@/shared/forms/zod-messages';
import type { WizardStep } from '@/shared/forms/StepIndicator';

export const bookingWizardSteps: WizardStep[] = [
  { id: 'patient', title: 'Patient', description: 'Select patient' },
  { id: 'service', title: 'Service', description: 'Choose service type' },
  { id: 'specialty', title: 'Specialty', description: 'Medical specialty' },
  { id: 'provider', title: 'Provider', description: 'Healthcare provider' },
  { id: 'facility', title: 'Facility', description: 'Location' },
  { id: 'date', title: 'Date', description: 'Preferred date' },
  { id: 'time', title: 'Time', description: 'Available slot' },
  { id: 'confirm', title: 'Confirm', description: 'Review details' },
  { id: 'success', title: 'Success', description: 'Booking complete' },
];

export const bookingSchema = z.object({
  patientId: requiredString('Patient'),
  serviceType: requiredString('Service'),
  specialty: requiredString('Specialty'),
  providerId: requiredString('Provider'),
  facilityId: requiredString('Facility'),
  date: requiredString('Date'),
  scheduledAt: requiredString('Time slot'),
  visitType: z.enum(['in_person', 'telemedicine', 'home_care', 'laboratory', 'radiology', 'pharmacy', 'follow_up']),
  reason: requiredString('Reason for visit'),
  insurance: z.string().optional(),
  notes: z.string().optional(),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const bookingStepFields: Record<number, (keyof BookingFormValues)[]> = {
  0: ['patientId'],
  1: ['serviceType'],
  2: ['specialty', 'visitType'],
  3: ['providerId'],
  4: ['facilityId'],
  5: ['date'],
  6: ['scheduledAt'],
  7: ['reason', 'insurance', 'notes'],
};
