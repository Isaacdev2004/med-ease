import type { Prisma } from '@medease/prisma';
import type {
  DoseLog,
  DoseLogStatus,
  MedicationReminder,
  MedicationRoute,
  MedicationStatus,
  PatientMedication,
  Prescription,
  PrescriptionStatus,
  RefillRequest,
  RefillStatus,
  ScheduleSlot,
  ScheduledDose,
  ScheduledDoseStatus,
} from '@medease/medications-contract';

import { toDateOnlyIso } from '../medications.helpers';

export function mapMedicationStatus(status: string): MedicationStatus {
  switch (status) {
    case 'active':
    case 'completed':
    case 'paused':
    case 'cancelled':
    case 'future':
      return status;
    default:
      return 'active';
  }
}

export function mapPrescriptionStatus(status: string): PrescriptionStatus {
  switch (status) {
    case 'draft':
    case 'active':
    case 'expired':
    case 'cancelled':
    case 'renewed':
    case 'pending':
    case 'completed':
    case 'on_hold':
      return status;
    default:
      return 'active';
  }
}

export function mapRoute(route: string): MedicationRoute {
  switch (route) {
    case 'oral':
    case 'topical':
    case 'injection':
    case 'inhalation':
    case 'sublingual':
    case 'other':
      return route;
    default:
      return 'oral';
  }
}

export function mapSlot(slot: string): ScheduleSlot {
  switch (slot) {
    case 'morning':
    case 'afternoon':
    case 'evening':
    case 'night':
    case 'custom':
    case 'prn':
      return slot;
    default:
      return 'custom';
  }
}

export function mapScheduledDoseStatus(status: string): ScheduledDoseStatus {
  switch (status) {
    case 'pending':
    case 'taken':
    case 'missed':
    case 'late':
    case 'skipped':
      return status;
    default:
      return 'pending';
  }
}

export function mapDoseLogStatus(status: string): DoseLogStatus {
  switch (status) {
    case 'taken':
    case 'skipped':
    case 'late':
    case 'partial':
    case 'vomited':
    case 'rescheduled':
      return status;
    default:
      return 'taken';
  }
}

export function mapRefillStatus(status: string): RefillStatus {
  switch (status) {
    case 'pending':
    case 'approved':
    case 'rejected':
    case 'dispensed':
    case 'partial':
      return status;
    default:
      return 'pending';
  }
}

export function mapPrescription(
  row: Prisma.PrescriptionGetPayload<object>,
): Prescription {
  return {
    id: row.id,
    prescriptionNumber: row.prescriptionNumber,
    patientId: row.patientId,
    patientName: row.patientName,
    medication: {
      id: row.id,
      name: row.medicationName,
      genericName: row.genericName,
      brandName: row.brandName ?? undefined,
      strength: row.strength,
      medicationClass: row.medicationClass,
      medicationType: row.medicationType,
      manufacturer: row.manufacturer ?? undefined,
      controlledSubstance: row.controlledSubstance,
    },
    dose: row.dose,
    frequency: row.frequency,
    route: mapRoute(row.route),
    durationDays: row.durationDays,
    startDate: toDateOnlyIso(row.startDate),
    endDate: row.endDate ? toDateOnlyIso(row.endDate) : undefined,
    validityDays: row.validityDays,
    expiresAt: row.expiresAt.toISOString(),
    status: mapPrescriptionStatus(row.status),
    refillCount: row.refillCount,
    refillsRemaining: row.refillsRemaining,
    prescribingPhysician: row.prescribingPhysician,
    prescribingPhysicianId: row.prescribingPhysicianId,
    dispensingPharmacy: row.dispensingPharmacy ?? undefined,
    dispensingPharmacyId: row.dispensingPharmacyId ?? undefined,
    instructions: row.instructions,
    warnings: row.warnings ?? [],
    contraindications: row.contraindications ?? [],
    isRecurring: row.isRecurring,
    carePlanId: row.carePlanId ?? undefined,
    diagnosisCode: row.diagnosisCode ?? undefined,
    appointmentId: row.appointmentId ?? undefined,
    facilityId: row.facilityId ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapPatientMedication(
  row: Prisma.PatientMedicationGetPayload<object>,
): PatientMedication {
  return {
    id: row.id,
    name: row.name,
    genericName: row.genericName,
    brandName: row.brandName ?? undefined,
    strength: row.strength,
    medicationClass: row.medicationClass,
    medicationType: row.medicationType,
    manufacturer: row.manufacturer ?? undefined,
    controlledSubstance: row.controlledSubstance,
    libraryMedicationId: row.libraryMedicationId ?? undefined,
    prescriptionId: row.prescriptionId,
    patientId: row.patientId,
    status: mapMedicationStatus(row.status),
    dose: row.dose,
    frequency: row.frequency,
    route: mapRoute(row.route),
    startDate: toDateOnlyIso(row.startDate),
    endDate: row.endDate ? toDateOnlyIso(row.endDate) : undefined,
    remainingDays: row.remainingDays ?? undefined,
    instructions: row.instructions,
    warnings: row.warnings ?? [],
    contraindications: row.contraindications ?? [],
    sideEffects: row.sideEffects ?? [],
    storage: row.storage ?? undefined,
    prescribingPhysician: row.prescribingPhysician,
    dispensingPharmacy: row.dispensingPharmacy ?? undefined,
    refillCount: row.refillCount,
    refillsRemaining: row.refillsRemaining,
    adherencePercent: row.adherencePercent,
    condition: row.condition ?? undefined,
    carePlanId: row.carePlanId ?? undefined,
  };
}

export function mapScheduledDose(
  row: Prisma.MedicationDoseGetPayload<object>,
): ScheduledDose {
  return {
    id: row.id,
    medicationId: row.medicationId,
    patientId: row.patientId,
    medicationName: row.medicationName,
    scheduledAt: row.scheduledAt.toISOString(),
    slot: mapSlot(row.slot),
    dose: row.dose,
    status: mapScheduledDoseStatus(row.status),
    instructions: row.instructions ?? undefined,
  };
}

export function mapDoseLog(row: Prisma.DoseLogGetPayload<object>): DoseLog {
  return {
    id: row.id,
    medicationId: row.medicationId,
    patientId: row.patientId,
    scheduledDoseId: row.scheduledDoseId ?? undefined,
    status: mapDoseLogStatus(row.status),
    loggedAt: row.loggedAt.toISOString(),
    notes: row.notes ?? undefined,
    symptoms: row.symptoms ?? undefined,
    sideEffects: row.sideEffects ?? undefined,
    mood: row.mood ?? undefined,
    painScore: row.painScore ?? undefined,
    bloodSugar: row.bloodSugar ?? undefined,
    bloodPressure: row.bloodPressure ?? undefined,
    temperature: row.temperature ?? undefined,
    weight: row.weight ?? undefined,
  };
}

export function mapReminder(
  row: Prisma.MedicationReminderGetPayload<object>,
): MedicationReminder {
  const type = row.type as MedicationReminder['type'];
  const channel = row.channel as MedicationReminder['channel'];
  return {
    id: row.id,
    medicationId: row.medicationId,
    patientId: row.patientId,
    type: ['dose', 'refill', 'expiration', 'follow_up', 'caregiver'].includes(
      type,
    )
      ? type
      : 'dose',
    channel: ['push', 'email', 'sms', 'in_app'].includes(channel)
      ? channel
      : 'in_app',
    title: row.title,
    message: row.message,
    dueAt: row.dueAt.toISOString(),
    active: row.active,
  };
}

export function mapRefillRequest(
  row: Prisma.RefillRequestGetPayload<object>,
): RefillRequest {
  return {
    id: row.id,
    prescriptionId: row.prescriptionId,
    medicationId: row.medicationId,
    patientId: row.patientId,
    patientName: row.patientName,
    medicationName: row.medicationName,
    pharmacyId: row.pharmacyId,
    pharmacyName: row.pharmacyName,
    status: mapRefillStatus(row.status),
    remainingTablets: row.remainingTablets ?? undefined,
    daysLeft: row.daysLeft ?? undefined,
    requestedAt: row.requestedAt.toISOString(),
    expectedDate: row.expectedDate
      ? toDateOnlyIso(row.expectedDate)
      : undefined,
    autoRefill: row.autoRefill,
  };
}
