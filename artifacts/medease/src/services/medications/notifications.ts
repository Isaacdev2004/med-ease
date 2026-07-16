import type {
  DrugInteraction,
  DoseLog,
  MedicationAdministration,
  MedicationDispense,
  Prescription,
  RefillRequest,
} from '@/services/medications/types';

type MedicationNotification = {
  id: string;
  title: string;
  message: string;
  type: 'medication';
  priority: 'low' | 'normal' | 'high' | 'urgent';
};

export function buildNewPrescriptionNotification(prescription: Prescription): MedicationNotification {
  return {
    id: `alert-rx-new-${prescription.id}`,
    title: 'New prescription issued',
    message: `${prescription.medication.name} (${prescription.dose}, ${prescription.frequency}) was prescribed.`,
    type: 'medication',
    priority: 'normal',
  };
}

export function buildRefillDueNotification(refill: RefillRequest): MedicationNotification {
  return {
    id: `alert-refill-due-${refill.id}`,
    title: 'Refill due soon',
    message: `${refill.medicationName} is running low. Request a refill at ${refill.pharmacyName}.`,
    type: 'medication',
    priority: 'normal',
  };
}

export function buildMissedDoseAlert(log: DoseLog): MedicationNotification {
  return {
    id: `alert-missed-${log.id}`,
    title: 'Missed medication dose',
    message: `A scheduled dose was not confirmed at ${new Date(log.loggedAt).toLocaleString()}.`,
    type: 'medication',
    priority: 'high',
  };
}

export function buildInteractionAlert(interaction: DrugInteraction): MedicationNotification {
  return {
    id: `alert-interaction-${interaction.id}`,
    title: 'Drug interaction detected',
    message: `${interaction.source} and ${interaction.target}: ${interaction.recommendation}`,
    type: 'medication',
    priority: interaction.severity === 'critical' || interaction.severity === 'high' ? 'urgent' : 'high',
  };
}

export function buildMedicationRecalledNotification(medicationName: string): MedicationNotification {
  return {
    id: `alert-recall-${medicationName.replace(/\s+/g, '-').toLowerCase()}`,
    title: 'Medication recall alert',
    message: `${medicationName} has been recalled. Contact your pharmacy or prescriber immediately.`,
    type: 'medication',
    priority: 'urgent',
  };
}

export function buildDispenseCompletedNotification(dispense: MedicationDispense): MedicationNotification {
  return {
    id: `alert-dispense-${dispense.id}`,
    title: 'Dispense completed',
    message: `${dispense.medicationName} (${dispense.quantity} ${dispense.unit}) ready at ${dispense.pharmacyName}.`,
    type: 'medication',
    priority: 'normal',
  };
}

export function buildCourseCompletedNotification(medicationName: string, patientId: string): MedicationNotification {
  return {
    id: `alert-course-${patientId}-${medicationName.replace(/\s+/g, '-').toLowerCase()}`,
    title: 'Medication course completed',
    message: `Your ${medicationName} treatment course has been completed.`,
    type: 'medication',
    priority: 'low',
  };
}

export function buildMedicationReminderNotification(medicationName: string, scheduledAt: string): MedicationNotification {
  return {
    id: `alert-reminder-${medicationName.replace(/\s+/g, '-').toLowerCase()}-${scheduledAt}`,
    title: 'Medication reminder',
    message: `Time to take ${medicationName}.`,
    type: 'medication',
    priority: 'normal',
  };
}

export function buildPrescriptionExpiredNotification(prescription: Prescription): MedicationNotification {
  return {
    id: `alert-rx-expired-${prescription.id}`,
    title: 'Prescription expired',
    message: `Your prescription for ${prescription.medication.name} has expired. Contact your prescriber for renewal.`,
    type: 'medication',
    priority: 'high',
  };
}

export function buildRefillApprovedNotification(refill: RefillRequest): MedicationNotification {
  return {
    id: `alert-refill-${refill.id}`,
    title: 'Refill approved',
    message: `${refill.medicationName} refill approved at ${refill.pharmacyName}.`,
    type: 'medication',
    priority: 'normal',
  };
}

export function buildAdministrationRecordedNotification(record: MedicationAdministration): MedicationNotification {
  return {
    id: `alert-admin-${record.id}`,
    title: 'Dose administered',
    message: `${record.medicationName} (${record.dose}) recorded at ${new Date(record.administeredAt).toLocaleString()}.`,
    type: 'medication',
    priority: 'low',
  };
}
