import type {
  DoseLog,
  MedicationFilters,
  MedicationListResult,
  MedicationReminder,
  MedicationSearchResult,
  PatientMedication,
  Prescription,
  RefillRequest,
  ScheduledDose,
} from '@medease/medications-contract';
import type { QueryParams } from '@workspace/repository-transport';

export function filtersToQuery(
  filters?: MedicationFilters & { patientId?: string; q?: string },
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    patientId: filters.patientId,
    status: filters.status,
    physician: filters.physician,
    pharmacy: filters.pharmacy,
    condition: filters.condition,
    q: filters.q,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function mapMedication(dto: unknown): PatientMedication {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    name: asString(row.name),
    genericName: asString(row.genericName),
    brandName: asOptionalString(row.brandName),
    strength: asString(row.strength),
    medicationClass: asString(row.medicationClass),
    medicationType: asString(row.medicationType),
    manufacturer: asOptionalString(row.manufacturer),
    controlledSubstance: asBoolean(row.controlledSubstance),
    libraryMedicationId: asOptionalString(row.libraryMedicationId),
    prescriptionId: asString(row.prescriptionId),
    patientId: asString(row.patientId),
    status: asString(row.status, 'active') as PatientMedication['status'],
    dose: asString(row.dose),
    frequency: asString(row.frequency),
    route: asString(row.route, 'oral') as PatientMedication['route'],
    startDate: asString(row.startDate),
    endDate: asOptionalString(row.endDate),
    remainingDays: asOptionalNumber(row.remainingDays),
    instructions: asString(row.instructions),
    warnings: asStringArray(row.warnings),
    contraindications: asStringArray(row.contraindications),
    sideEffects: asStringArray(row.sideEffects),
    storage: asOptionalString(row.storage),
    prescribingPhysician: asString(row.prescribingPhysician),
    dispensingPharmacy: asOptionalString(row.dispensingPharmacy),
    refillCount: asNumber(row.refillCount),
    refillsRemaining: asNumber(row.refillsRemaining),
    adherencePercent: asNumber(row.adherencePercent, 100),
    condition: asOptionalString(row.condition),
    carePlanId: asOptionalString(row.carePlanId),
  };
}

export function mapPrescription(dto: unknown): Prescription {
  const row = asRecord(dto);
  const medication = asRecord(row.medication);
  return {
    id: asString(row.id),
    prescriptionNumber: asString(row.prescriptionNumber),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    medication: {
      id: asString(medication.id, asString(row.id)),
      name: asString(medication.name),
      genericName: asString(medication.genericName),
      brandName: asOptionalString(medication.brandName),
      strength: asString(medication.strength),
      medicationClass: asString(medication.medicationClass),
      medicationType: asString(medication.medicationType),
      manufacturer: asOptionalString(medication.manufacturer),
      controlledSubstance: asBoolean(medication.controlledSubstance),
    },
    dose: asString(row.dose),
    frequency: asString(row.frequency),
    route: asString(row.route, 'oral') as Prescription['route'],
    durationDays: asNumber(row.durationDays),
    startDate: asString(row.startDate),
    endDate: asOptionalString(row.endDate),
    validityDays: asNumber(row.validityDays, 90),
    expiresAt: asString(row.expiresAt),
    status: asString(row.status, 'active') as Prescription['status'],
    refillCount: asNumber(row.refillCount),
    refillsRemaining: asNumber(row.refillsRemaining),
    prescribingPhysician: asString(row.prescribingPhysician),
    prescribingPhysicianId: asString(row.prescribingPhysicianId),
    dispensingPharmacy: asOptionalString(row.dispensingPharmacy),
    dispensingPharmacyId: asOptionalString(row.dispensingPharmacyId),
    instructions: asString(row.instructions),
    warnings: asStringArray(row.warnings),
    contraindications: asStringArray(row.contraindications),
    isRecurring: asBoolean(row.isRecurring),
    carePlanId: asOptionalString(row.carePlanId),
    diagnosisCode: asOptionalString(row.diagnosisCode),
    appointmentId: asOptionalString(row.appointmentId),
    facilityId: asOptionalString(row.facilityId),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapScheduledDose(dto: unknown): ScheduledDose {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    medicationId: asString(row.medicationId),
    patientId: asString(row.patientId),
    medicationName: asString(row.medicationName),
    scheduledAt: asString(row.scheduledAt),
    slot: asString(row.slot, 'custom') as ScheduledDose['slot'],
    dose: asString(row.dose),
    status: asString(row.status, 'pending') as ScheduledDose['status'],
    instructions: asOptionalString(row.instructions),
  };
}

export function mapDoseLog(dto: unknown): DoseLog {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    medicationId: asString(row.medicationId),
    patientId: asString(row.patientId),
    scheduledDoseId: asOptionalString(row.scheduledDoseId),
    status: asString(row.status, 'taken') as DoseLog['status'],
    loggedAt: asString(row.loggedAt),
    notes: asOptionalString(row.notes),
    symptoms: asOptionalString(row.symptoms),
    sideEffects: asOptionalString(row.sideEffects),
    mood: asOptionalString(row.mood),
    painScore: asOptionalNumber(row.painScore),
    bloodSugar: asOptionalNumber(row.bloodSugar),
    bloodPressure: asOptionalString(row.bloodPressure),
    temperature: asOptionalNumber(row.temperature),
    weight: asOptionalNumber(row.weight),
  };
}

export function mapReminder(dto: unknown): MedicationReminder {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    medicationId: asString(row.medicationId),
    patientId: asString(row.patientId),
    type: asString(row.type, 'dose') as MedicationReminder['type'],
    channel: asString(row.channel, 'in_app') as MedicationReminder['channel'],
    title: asString(row.title),
    message: asString(row.message),
    dueAt: asString(row.dueAt),
    active: asBoolean(row.active, true),
  };
}

export function mapRefill(dto: unknown): RefillRequest {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    prescriptionId: asString(row.prescriptionId),
    medicationId: asString(row.medicationId),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    medicationName: asString(row.medicationName),
    pharmacyId: asString(row.pharmacyId),
    pharmacyName: asString(row.pharmacyName),
    status: asString(row.status, 'pending') as RefillRequest['status'],
    remainingTablets: asOptionalNumber(row.remainingTablets),
    daysLeft: asOptionalNumber(row.daysLeft),
    requestedAt: asString(row.requestedAt),
    expectedDate: asOptionalString(row.expectedDate),
    autoRefill: asBoolean(row.autoRefill),
  };
}

export function mapPaginatedMedications(dto: unknown): MedicationListResult {
  const row = asRecord(dto);
  return {
    items: mapArray(row.items, mapMedication),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapSearchResult(dto: unknown): MedicationSearchResult {
  const row = asRecord(dto);
  return {
    medications: mapArray(row.medications, mapMedication),
    prescriptions: mapArray(row.prescriptions, mapPrescription),
  };
}

export function mapArray<T>(
  dto: unknown,
  mapper: (item: unknown) => T,
): T[] {
  return Array.isArray(dto) ? dto.map(mapper) : [];
}
