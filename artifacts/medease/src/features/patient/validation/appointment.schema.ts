import { z } from 'zod';

import { futureDateField, requiredString } from '@/shared/forms/zod-messages';

export const appointmentSchema = z.object({
  providerId: requiredString('Healthcare provider'),
  facilityId: requiredString('Facility'),
  scheduledAt: futureDateField('Appointment date'),
  reason: requiredString('Reason for visit'),
  notes: z.string().trim().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

export const rescheduleAppointmentSchema = z.object({
  appointmentId: requiredString('Appointment'),
  scheduledAt: futureDateField('New appointment date'),
  reason: z.string().trim().optional(),
});

export type RescheduleAppointmentFormValues = z.infer<
  typeof rescheduleAppointmentSchema
>;
