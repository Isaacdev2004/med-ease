import type { BookAppointmentInput } from '@/services/appointments/types';
import { getAvailableSlots } from '@/services/appointments/availability';

export function validateBookingSlot(input: Pick<BookAppointmentInput, 'providerId' | 'facilityId' | 'scheduledAt'>): boolean {
  const date = input.scheduledAt.split('T')[0]!;
  const slots = getAvailableSlots(input.providerId, input.facilityId, date);
  const scheduled = new Date(input.scheduledAt).getTime();
  return slots.some((slot) => new Date(slot.start).getTime() === scheduled);
}

export function suggestNextAvailableSlot(
  providerId: string,
  facilityId: string,
  fromDate: string,
): string | null {
  for (let day = 0; day < 14; day++) {
    const d = new Date(fromDate);
    d.setDate(d.getDate() + day);
    const dateStr = d.toISOString().split('T')[0]!;
    const slot = getAvailableSlots(providerId, facilityId, dateStr)[0];
    if (slot) return slot.start;
  }
  return null;
}

export function computeEstimatedWait(queuePosition: number): number {
  return Math.max(5, queuePosition * 12);
}
