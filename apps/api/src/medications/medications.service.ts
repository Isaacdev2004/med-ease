import { Injectable } from '@nestjs/common';

import type {
  CreatePrescriptionInput,
  LogDoseInput,
  MedicationFilters,
  RefillRequestInput,
} from '@medease/medications-contract';

import { MedicationsRepository } from './medications.repository';

@Injectable()
export class MedicationsService {
  constructor(private readonly repository: MedicationsRepository) {}

  listMedications(filters?: MedicationFilters) {
    return this.repository.listMedications(filters);
  }

  getAllMedications(filters?: MedicationFilters) {
    return this.repository.getAllMedications(filters);
  }

  getMedication(id: string) {
    return this.repository.getMedication(id);
  }

  listPrescriptions(filters?: MedicationFilters) {
    return this.repository.listPrescriptions(filters);
  }

  getPrescription(id: string) {
    return this.repository.getPrescription(id);
  }

  getSchedule(patientId?: string) {
    return this.repository.getSchedule(patientId);
  }

  getLogs(patientId?: string) {
    return this.repository.getLogs(patientId);
  }

  getReminders(patientId?: string) {
    return this.repository.getReminders(patientId);
  }

  getRefills(patientId?: string) {
    return this.repository.getRefills(patientId);
  }

  createPrescription(input: CreatePrescriptionInput) {
    return this.repository.createPrescription(input);
  }

  cancelPrescription(id: string) {
    return this.repository.cancelPrescription(id);
  }

  renewPrescription(id: string) {
    return this.repository.renewPrescription(id);
  }

  logDose(input: LogDoseInput) {
    return this.repository.logDose(input);
  }

  requestRefill(input: RefillRequestInput) {
    return this.repository.requestRefill(input);
  }

  approveRefill(id: string) {
    return this.repository.approveRefill(id);
  }

  rejectRefill(id: string) {
    return this.repository.rejectRefill(id);
  }

  pauseMedication(medicationId: string) {
    return this.repository.pauseMedication(medicationId);
  }

  resumeMedication(medicationId: string) {
    return this.repository.resumeMedication(medicationId);
  }

  completeCourse(medicationId: string) {
    return this.repository.completeCourse(medicationId);
  }

  markReminderDone(reminderId: string) {
    return this.repository.markReminderDone(reminderId);
  }

  search(query: string, patientId?: string) {
    return this.repository.search(query, patientId);
  }
}
