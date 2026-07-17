import type {
  AdministerInput,
  CreatePrescriptionInput,
  DispenseInput,
  DoseLog,
  LogDoseInput,
  MedicationFilters,
  PatientMedication,
  Prescription,
  RefillRequest,
  RefillRequestInput,
} from '@/services/medications/types';
import {
  MOCK_ADMINISTRATIONS,
  MOCK_COURSES,
  MOCK_DISPENSES,
  MOCK_DOSE_LOGS,
  MOCK_INTERACTIONS,
  MOCK_MEDICATIONS,
  MOCK_PHARMACY_QUEUE,
  MOCK_PRESCRIPTIONS,
  MOCK_REFILL_REQUESTS,
  MOCK_REMINDERS,
  MOCK_SCHEDULE,
  buildMedicationEducation,
  buildTimeline,
  generatePrescription,
  prescriptionToPatientMedication,
} from '@/services/medications/mock-data';
import { buildRefillRequest } from '@/services/medications/refill';

function matchesFilters(
  med: PatientMedication,
  filters: MedicationFilters,
): boolean {
  if (filters.patientId && med.patientId !== filters.patientId) return false;
  if (filters.status && med.status !== filters.status) return false;
  if (
    filters.physician &&
    !med.prescribingPhysician.includes(filters.physician)
  )
    return false;
  if (filters.pharmacy && med.dispensingPharmacy !== filters.pharmacy)
    return false;
  if (filters.condition && med.condition !== filters.condition) return false;
  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (
      !`${med.name} ${med.genericName} ${med.prescribingPhysician}`
        .toLowerCase()
        .includes(q)
    )
      return false;
  }
  return true;
}

class MedicationRepository {
  private prescriptions: Prescription[] = [...MOCK_PRESCRIPTIONS];
  private medications: PatientMedication[] = [...MOCK_MEDICATIONS];
  private schedule = [...MOCK_SCHEDULE];
  private logs: DoseLog[] = [...MOCK_DOSE_LOGS];
  private refills: RefillRequest[] = [...MOCK_REFILL_REQUESTS];
  private administrations = [...MOCK_ADMINISTRATIONS];
  private dispenses = [...MOCK_DISPENSES];
  private courses = [...MOCK_COURSES];
  private favorites = new Set<string>(
    MOCK_MEDICATIONS.filter((_, i) => i % 19 === 0).map((m) => m.id),
  );

  listMedications(filters?: MedicationFilters) {
    const filtered = this.medications.filter((m) =>
      matchesFilters(m, filters ?? {}),
    );
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 25;
    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }

  getAllMedications(filters?: MedicationFilters) {
    return this.medications.filter((m) => matchesFilters(m, filters ?? {}));
  }

  getMedication(id: string) {
    return this.medications.find((m) => m.id === id) ?? null;
  }

  getPrescription(id: string) {
    return this.prescriptions.find((p) => p.id === id) ?? null;
  }

  listPrescriptions(filters?: MedicationFilters) {
    return this.prescriptions.filter(
      (p) => !filters?.patientId || p.patientId === filters.patientId,
    );
  }

  getSchedule(patientId?: string) {
    return patientId
      ? this.schedule.filter((s) => s.patientId === patientId)
      : this.schedule;
  }

  getLogs(patientId?: string) {
    return patientId
      ? this.logs.filter((l) => l.patientId === patientId)
      : this.logs;
  }

  getReminders(patientId?: string) {
    return patientId
      ? MOCK_REMINDERS.filter((r) => r.patientId === patientId)
      : MOCK_REMINDERS;
  }

  getRefills(patientId?: string) {
    return patientId
      ? this.refills.filter((r) => r.patientId === patientId)
      : this.refills;
  }

  getInteractions(patientId?: string) {
    return patientId
      ? MOCK_INTERACTIONS.filter((i) => i.patientId === patientId)
      : MOCK_INTERACTIONS;
  }

  getAdministrations(patientId?: string) {
    return patientId
      ? this.administrations.filter((a) => a.patientId === patientId)
      : this.administrations;
  }

  getDispenses(patientId?: string) {
    return patientId
      ? this.dispenses.filter((d) => d.patientId === patientId)
      : this.dispenses;
  }

  getCourses(patientId?: string) {
    return patientId
      ? this.courses.filter((c) => c.patientId === patientId)
      : this.courses;
  }

  getEducation(medicationId: string) {
    return buildMedicationEducation(medicationId);
  }

  getFavorites(patientId?: string) {
    return this.medications.filter((m) => {
      if (!this.favorites.has(m.id)) return false;
      if (patientId && m.patientId !== patientId) return false;
      return true;
    });
  }

  toggleFavorite(medicationId: string) {
    if (this.favorites.has(medicationId)) {
      this.favorites.delete(medicationId);
      return false;
    }
    this.favorites.add(medicationId);
    return true;
  }

  getTimeline(patientId: string) {
    return buildTimeline(patientId);
  }

  getPharmacyQueue(pharmacyId?: string) {
    return pharmacyId
      ? MOCK_PHARMACY_QUEUE.filter((q) => q.pharmacyId === pharmacyId)
      : MOCK_PHARMACY_QUEUE;
  }

  createPrescription(input: CreatePrescriptionInput): Prescription {
    const idx = this.prescriptions.length;
    const rx = generatePrescription(
      idx,
      parseInt(input.patientId.replace(/\D/g, ''), 10) - 1,
    );
    const created: Prescription = {
      ...rx,
      id: `rx-${String(idx + 1).padStart(4, '0')}`,
      patientId: input.patientId,
      medication: {
        ...rx.medication,
        name: input.medicationName,
        genericName: input.genericName,
        strength: input.strength,
        controlledSubstance: input.controlledSubstance ?? false,
      },
      dose: input.dose,
      frequency: input.frequency,
      route: input.route,
      durationDays: input.durationDays,
      instructions: input.instructions,
      refillCount: input.refillCount ?? 3,
      refillsRemaining: input.refillCount ?? 3,
      diagnosisCode: input.diagnosisCode,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.prescriptions.unshift(created);
    this.medications.unshift(prescriptionToPatientMedication(created));
    return created;
  }

  cancelPrescription(id: string): Prescription {
    const idx = this.prescriptions.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Prescription not found');
    this.prescriptions[idx] = {
      ...this.prescriptions[idx]!,
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
    };
    const medIdx = this.medications.findIndex((m) => m.prescriptionId === id);
    if (medIdx >= 0)
      this.medications[medIdx] = {
        ...this.medications[medIdx]!,
        status: 'cancelled',
      };
    return this.prescriptions[idx]!;
  }

  renewPrescription(id: string): Prescription {
    const rx = this.getPrescription(id);
    if (!rx) throw new Error('Prescription not found');
    const renewed = {
      ...rx,
      status: 'renewed' as const,
      refillsRemaining: rx.refillCount,
      expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const idx = this.prescriptions.findIndex((p) => p.id === id);
    this.prescriptions[idx] = renewed;
    return renewed;
  }

  dispense(input: DispenseInput) {
    const rx = this.getPrescription(input.prescriptionId);
    if (!rx) return null;
    const pharmacy = rx.dispensingPharmacy ?? 'Pharmacy';
    const record = {
      id: `disp-${Date.now()}`,
      prescriptionId: input.prescriptionId,
      patientId: rx.patientId,
      medicationName: rx.medication.name,
      pharmacyId: input.pharmacyId,
      pharmacyName: pharmacy,
      quantity: input.quantity,
      unit: 'tablets',
      dispensedAt: new Date().toISOString(),
      dispensedBy: input.dispensedBy,
      status: 'dispensed' as const,
    };
    this.dispenses.unshift(record);
    return record;
  }

  administer(input: AdministerInput) {
    const med = this.getMedication(input.medicationId);
    if (!med) return null;
    const record = {
      id: `adm-${Date.now()}`,
      medicationId: input.medicationId,
      patientId: input.patientId,
      prescriptionId: med.prescriptionId,
      medicationName: med.name,
      dose: input.dose,
      route: med.route,
      administeredAt: new Date().toISOString(),
      administeredBy: input.administeredBy,
      status: 'completed' as const,
      notes: input.notes,
    };
    this.administrations.unshift(record);
    return record;
  }

  logDose(input: LogDoseInput): DoseLog {
    const log: DoseLog = {
      id: `log-${Date.now()}`,
      ...input,
      loggedAt: new Date().toISOString(),
    };
    this.logs.unshift(log);
    if (input.scheduledDoseId) {
      const doseIdx = this.schedule.findIndex(
        (d) => d.id === input.scheduledDoseId,
      );
      if (doseIdx >= 0) {
        this.schedule[doseIdx] = {
          ...this.schedule[doseIdx]!,
          status:
            input.status === 'taken'
              ? 'taken'
              : input.status === 'late'
                ? 'late'
                : 'skipped',
        };
      }
    }
    return log;
  }

  requestRefill(input: RefillRequestInput): RefillRequest {
    const rx = this.getPrescription(input.prescriptionId);
    const med = this.medications.find(
      (m) => m.prescriptionId === input.prescriptionId,
    );
    const request = buildRefillRequest(
      input,
      med?.name ?? rx?.medication.name ?? 'Medication',
      rx?.patientName ?? 'Patient',
      med?.refillsRemaining,
    );
    this.refills.unshift(request);
    return request;
  }

  approveRefill(id: string): RefillRequest {
    const idx = this.refills.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Refill not found');
    this.refills[idx] = { ...this.refills[idx]!, status: 'approved' };
    return this.refills[idx]!;
  }

  rejectRefill(id: string): RefillRequest {
    const idx = this.refills.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Refill not found');
    this.refills[idx] = { ...this.refills[idx]!, status: 'rejected' };
    return this.refills[idx]!;
  }

  pauseMedication(medicationId: string): PatientMedication {
    const idx = this.medications.findIndex((m) => m.id === medicationId);
    if (idx === -1) throw new Error('Medication not found');
    this.medications[idx] = { ...this.medications[idx]!, status: 'paused' };
    return this.medications[idx]!;
  }

  resumeMedication(medicationId: string): PatientMedication {
    const idx = this.medications.findIndex((m) => m.id === medicationId);
    if (idx === -1) throw new Error('Medication not found');
    this.medications[idx] = { ...this.medications[idx]!, status: 'active' };
    return this.medications[idx]!;
  }

  completeCourse(medicationId: string): PatientMedication {
    const idx = this.medications.findIndex((m) => m.id === medicationId);
    if (idx === -1) throw new Error('Medication not found');
    this.medications[idx] = { ...this.medications[idx]!, status: 'completed' };
    const courseIdx = this.courses.findIndex(
      (c) => c.medicationId === medicationId,
    );
    if (courseIdx >= 0) {
      this.courses[courseIdx] = {
        ...this.courses[courseIdx]!,
        status: 'completed',
        completedDoses: this.courses[courseIdx]!.totalDoses,
      };
    }
    return this.medications[idx]!;
  }

  stopMedication(medicationId: string): PatientMedication {
    return this.pauseMedication(medicationId);
  }

  markReminderDone(reminderId: string) {
    const reminder = MOCK_REMINDERS.find((r) => r.id === reminderId);
    if (reminder) reminder.active = false;
    return reminder ?? null;
  }

  exportMedications(patientId: string, format: 'pdf' | 'fhir' | 'csv') {
    return {
      id: `exp-${Date.now()}`,
      patientId,
      format,
      exportedAt: new Date().toISOString(),
    };
  }

  shareMedication(medicationId: string, sharedWith: string) {
    return {
      id: `share-${Date.now()}`,
      medicationId,
      sharedWith,
      sharedAt: new Date().toISOString(),
    };
  }

  search(query: string, patientId?: string) {
    const q = query.toLowerCase();
    const meds = this.getAllMedications(
      patientId ? { patientId } : undefined,
    ).filter((m) => `${m.name} ${m.genericName}`.toLowerCase().includes(q));
    const rx = this.listPrescriptions(
      patientId ? { patientId } : undefined,
    ).filter((p) =>
      `${p.medication.name} ${p.prescriptionNumber}`.toLowerCase().includes(q),
    );
    return { medications: meds.slice(0, 20), prescriptions: rx.slice(0, 20) };
  }
}

export const medicationRepository = new MedicationRepository();
