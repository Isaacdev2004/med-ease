import type {
  ProviderAvailability,
  TimeSlot,
} from '@/services/appointments/types';
import { FACILITIES, PROVIDERS } from '@/services/appointments/mock-data';

function buildSlots(
  date: string,
  providerId: string,
  facilityId: string,
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const base = new Date(date);
  for (let hour = 8; hour < 17; hour++) {
    for (const minute of [0, 30]) {
      const start = new Date(base);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start.getTime() + 30 * 60_000);
      const id = `slot-${providerId}-${start.toISOString()}`;
      slots.push({
        id,
        start: start.toISOString(),
        end: end.toISOString(),
        available: (hour + minute) % 3 !== 0,
        providerId,
        facilityId,
      });
    }
  }
  return slots;
}

export function getProviderAvailability(
  providerId: string,
  facilityId: string,
  date: string,
): ProviderAvailability | null {
  const provider = PROVIDERS.find((p) => p.id === providerId);
  if (!provider) return null;
  const slots = buildSlots(date, providerId, facilityId);
  const blockedSlots = slots.filter((_, i) => i % 7 === 0).map((s) => s.id);
  return {
    providerId,
    providerName: provider.fullName,
    specialty: provider.specialty,
    facilityId,
    date,
    slots,
    blockedSlots,
  };
}

export function getAllProviderAvailability(
  date: string,
  facilityId?: string,
): ProviderAvailability[] {
  return PROVIDERS.flatMap((provider) => {
    const facilities = facilityId
      ? FACILITIES.filter((f) => f.id === facilityId)
      : FACILITIES.slice(0, 2);
    return facilities.map((f) =>
      getProviderAvailability(provider.id, f.id, date)!,
    );
  });
}

export function getAvailableSlots(
  providerId: string,
  facilityId: string,
  date: string,
): TimeSlot[] {
  const availability = getProviderAvailability(providerId, facilityId, date);
  return (
    availability?.slots.filter(
      (s) => s.available && !availability.blockedSlots.includes(s.id),
    ) ?? []
  );
}
