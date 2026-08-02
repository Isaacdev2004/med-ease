import { httpTransport } from '@workspace/repository-transport';
import type {
  CreatePrescriptionInput,
  LogDoseInput,
  MedicationFilters,
  MedicationsRepositoryContract,
  RefillRequestInput,
} from '@medease/medications-contract';

import {
  filtersToQuery,
  mapArray,
  mapDoseLog,
  mapMedication,
  mapPaginatedMedications,
  mapPrescription,
  mapRefill,
  mapReminder,
  mapScheduledDose,
  mapSearchResult,
} from '@/services/medications/dto-mappers';

const BASE = '/api/medications';

class MedicationsHttpRepository implements MedicationsRepositoryContract {
  private readonly transport = httpTransport;

  async listMedications(filters?: MedicationFilters) {
    const dto = await this.transport.get(BASE, {
      query: filtersToQuery(filters),
    });
    return mapPaginatedMedications(dto);
  }

  async getAllMedications(filters?: MedicationFilters) {
    const dto = await this.transport.get(`${BASE}/all`, {
      query: filtersToQuery(filters),
    });
    return mapArray(dto, mapMedication);
  }

  async getMedication(id: string) {
    const dto = await this.transport.get(`${BASE}/${id}`);
    return mapMedication(dto);
  }

  async listPrescriptions(filters?: MedicationFilters) {
    const dto = await this.transport.get(`${BASE}/prescriptions`, {
      query: filtersToQuery(filters),
    });
    return mapArray(dto, mapPrescription);
  }

  async getPrescription(id: string) {
    const dto = await this.transport.get(`${BASE}/prescriptions/${id}`);
    return mapPrescription(dto);
  }

  async getSchedule(patientId?: string) {
    const dto = await this.transport.get(`${BASE}/schedule`, {
      query: filtersToQuery({ patientId }),
    });
    return mapArray(dto, mapScheduledDose);
  }

  async getLogs(patientId?: string) {
    const dto = await this.transport.get(`${BASE}/logs`, {
      query: filtersToQuery({ patientId }),
    });
    return mapArray(dto, mapDoseLog);
  }

  async getReminders(patientId?: string) {
    const dto = await this.transport.get(`${BASE}/reminders`, {
      query: filtersToQuery({ patientId }),
    });
    return mapArray(dto, mapReminder);
  }

  async getRefills(patientId?: string) {
    const dto = await this.transport.get(`${BASE}/refills`, {
      query: filtersToQuery({ patientId }),
    });
    return mapArray(dto, mapRefill);
  }

  async createPrescription(input: CreatePrescriptionInput) {
    const dto = await this.transport.post(`${BASE}/prescriptions`, {
      body: input,
    });
    return mapPrescription(dto);
  }

  async cancelPrescription(id: string) {
    const dto = await this.transport.post(
      `${BASE}/prescriptions/${id}/cancel`,
    );
    return mapPrescription(dto);
  }

  async renewPrescription(id: string) {
    const dto = await this.transport.post(`${BASE}/prescriptions/${id}/renew`);
    return mapPrescription(dto);
  }

  async logDose(input: LogDoseInput) {
    const dto = await this.transport.post(`${BASE}/doses/log`, { body: input });
    return mapDoseLog(dto);
  }

  async requestRefill(input: RefillRequestInput) {
    const dto = await this.transport.post(`${BASE}/refills`, { body: input });
    return mapRefill(dto);
  }

  async approveRefill(id: string) {
    const dto = await this.transport.post(`${BASE}/refills/${id}/approve`);
    return mapRefill(dto);
  }

  async rejectRefill(id: string) {
    const dto = await this.transport.post(`${BASE}/refills/${id}/reject`);
    return mapRefill(dto);
  }

  async pauseMedication(medicationId: string) {
    const dto = await this.transport.post(`${BASE}/${medicationId}/pause`);
    return mapMedication(dto);
  }

  async resumeMedication(medicationId: string) {
    const dto = await this.transport.post(`${BASE}/${medicationId}/resume`);
    return mapMedication(dto);
  }

  async completeCourse(medicationId: string) {
    const dto = await this.transport.post(`${BASE}/${medicationId}/complete`);
    return mapMedication(dto);
  }

  async markReminderDone(reminderId: string) {
    const dto = await this.transport.post(
      `${BASE}/reminders/${reminderId}/done`,
    );
    return mapReminder(dto);
  }

  async search(query: string, patientId?: string) {
    const dto = await this.transport.get(`${BASE}/search`, {
      query: filtersToQuery({ q: query, patientId }),
    });
    return mapSearchResult(dto);
  }

  // Compatibility methods used by the mock-era service layer (pharmacy / favorites)
  getPharmacyQueue() {
    return Promise.resolve([]);
  }

  getAdministrations() {
    return Promise.resolve([]);
  }

  getDispenses() {
    return Promise.resolve([]);
  }

  getCourses() {
    return Promise.resolve([]);
  }

  getEducation(medicationId: string) {
    return Promise.resolve({
      medicationId,
      title: 'Medication information',
      summary: 'Follow the prescribed dose and schedule.',
      instructions: [] as string[],
      sideEffects: [] as string[],
      storage: 'Store as directed on the label.',
      whenToCall: [] as string[],
    });
  }

  getFavorites() {
    return Promise.resolve([]);
  }

  toggleFavorite(_medicationId: string) {
    return Promise.resolve(false);
  }

  getTimeline() {
    return Promise.resolve([]);
  }

  dispense() {
    return Promise.resolve(null);
  }

  administer() {
    return Promise.resolve(null);
  }

  stopMedication(medicationId: string) {
    return this.pauseMedication(medicationId);
  }

  exportMedications(patientId: string, format: 'pdf' | 'fhir' | 'csv') {
    return Promise.resolve({
      id: `exp-${Date.now()}`,
      patientId,
      format,
      exportedAt: new Date().toISOString(),
    });
  }

  shareMedication(medicationId: string, sharedWith: string) {
    return Promise.resolve({
      id: `share-${Date.now()}`,
      medicationId,
      sharedWith,
      sharedAt: new Date().toISOString(),
    });
  }

  getInteractions() {
    return Promise.resolve([]);
  }
}

export const medicationHttpRepository = new MedicationsHttpRepository();
