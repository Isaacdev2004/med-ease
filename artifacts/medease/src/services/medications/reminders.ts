import type {
  MedicationReminder,
  PatientMedication,
} from '@/services/medications/types';

export function buildDoseReminders(
  medication: PatientMedication,
): MedicationReminder[] {
  const slots = medication.frequency.includes('Twice')
    ? [
        { hour: 8, label: 'Morning' },
        { hour: 20, label: 'Evening' },
      ]
    : [{ hour: 8, label: 'Morning' }];

  return slots.map((slot, i) => {
    const due = new Date();
    due.setHours(slot.hour, 0, 0, 0);
    return {
      id: `rem-dose-${medication.id}-${i}`,
      medicationId: medication.id,
      patientId: medication.patientId,
      type: 'dose' as const,
      channel: 'in_app' as const,
      title: `${slot.label} dose — ${medication.name}`,
      message: `Take ${medication.dose}`,
      dueAt: due.toISOString(),
      active: medication.status === 'active',
    };
  });
}

export function buildRefillReminder(
  medication: PatientMedication,
): MedicationReminder | null {
  if (
    (medication.refillsRemaining ?? 0) <= 1 &&
    medication.status === 'active'
  ) {
    return {
      id: `rem-refill-${medication.id}`,
      medicationId: medication.id,
      patientId: medication.patientId,
      type: 'refill',
      channel: 'push',
      title: 'Refill needed',
      message: `${medication.name} has ${medication.refillsRemaining} refills remaining.`,
      dueAt: new Date().toISOString(),
      active: true,
    };
  }
  return null;
}
