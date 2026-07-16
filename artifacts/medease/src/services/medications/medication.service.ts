import { computeAdherence } from '@/services/medications/adherence';
import { computeMedicationAnalytics } from '@/services/medications/analytics';
import { checkMedicationInteractions } from '@/services/medications/interaction-engine';
import { getPatientIdForUser } from '@/services/medications/mock-data';
import { medicationRepository } from '@/services/medications/repository';
import {
  buildMedicationCalendar,
  getTodayDoses,
  getUpcomingDoses,
} from '@/services/medications/scheduler';
import type {
  CreatePrescriptionInput,
  LogDoseInput,
  MedicationDashboard,
  MedicationFilters,
  RefillRequestInput,
  DispenseInput,
  AdministerInput,
} from '@/services/medications/types';

const DELAY = 250;
const delay = (ms = DELAY) => new Promise((r) => setTimeout(r, ms));

export const medicationService = {
  async resolvePatientId(userId: string, explicitId?: string) {
    await delay(50);
    return explicitId ?? getPatientIdForUser(userId);
  },

  async searchMedications(filters?: MedicationFilters) {
    await delay();
    return medicationRepository.listMedications(filters);
  },

  async getMedications(filters?: MedicationFilters) {
    await delay();
    return medicationRepository.getAllMedications(filters);
  },

  async getMedication(id: string) {
    await delay(150);
    return medicationRepository.getMedication(id);
  },

  async getPrescription(id: string) {
    await delay(150);
    return medicationRepository.getPrescription(id);
  },

  async getPrescriptions(filters?: MedicationFilters) {
    await delay();
    return medicationRepository.listPrescriptions(filters);
  },

  async getTodayMedications(patientId: string) {
    await delay(100);
    return getTodayDoses(medicationRepository.getSchedule(patientId), patientId);
  },

  async getSchedule(patientId?: string) {
    await delay();
    return medicationRepository.getSchedule(patientId);
  },

  async getUpcomingMedications(patientId: string) {
    await delay();
    return getUpcomingDoses(medicationRepository.getSchedule(patientId), patientId);
  },

  async getHistory(patientId: string) {
    await delay();
    return medicationRepository.getLogs(patientId);
  },

  async getTimeline(patientId: string) {
    await delay();
    return medicationRepository.getTimeline(patientId);
  },

  async getReminders(patientId?: string) {
    await delay();
    return medicationRepository.getReminders(patientId);
  },

  async getRefills(patientId?: string) {
    await delay();
    return medicationRepository.getRefills(patientId);
  },

  async getInteractions(patientId: string) {
    await delay(150);
    const meds = medicationRepository.getAllMedications({ patientId });
    return checkMedicationInteractions(patientId, meds);
  },

  async getAdherence(patientId: string) {
    await delay();
    return computeAdherence(
      patientId,
      medicationRepository.getLogs(patientId),
      medicationRepository.getSchedule(patientId),
      medicationRepository.getAllMedications({ patientId }),
    );
  },

  async getDashboard(patientId: string): Promise<MedicationDashboard> {
    await delay();
    const today = await this.getTodayMedications(patientId);
    const meds = medicationRepository.getAllMedications({ patientId, status: 'active' });
    const adherence = await this.getAdherence(patientId);
    const interactions = await this.getInteractions(patientId);
    const refills = medicationRepository.getRefills(patientId).filter((r) => r.status === 'pending');
    const timeline = medicationRepository.getTimeline(patientId);

    return {
      patientId,
      todayTotal: today.length,
      taken: today.filter((d) => d.status === 'taken').length,
      pending: today.filter((d) => d.status === 'pending').length,
      missed: today.filter((d) => d.status === 'missed').length,
      upcoming: today.filter((d) => d.status === 'pending').length,
      refillAlerts: refills.length,
      interactionAlerts: interactions.filter((i) => i.active).length,
      prescriptionAlerts: meds.filter((m) => (m.remainingDays ?? 99) < 7).length,
      medicationScore: adherence.medicationScore,
      adherencePercent: adherence.compliancePercent,
      recentActivity: timeline.slice(0, 8),
    };
  },

  async getCalendar(patientId: string, referenceDate = new Date()) {
    await delay();
    return buildMedicationCalendar(medicationRepository.getSchedule(patientId), referenceDate);
  },

  async getAnalytics(filters?: MedicationFilters) {
    await delay();
    const prescriptions = medicationRepository.listPrescriptions(filters);
    const medications = medicationRepository.getAllMedications(filters);
    return computeMedicationAnalytics(prescriptions, medications);
  },

  async getPharmacyQueue(pharmacyId?: string) {
    await delay();
    return medicationRepository.getPharmacyQueue(pharmacyId);
  },

  async createPrescription(input: CreatePrescriptionInput) {
    await delay(300);
    return medicationRepository.createPrescription(input);
  },

  async cancelPrescription(id: string) {
    await delay(250);
    return medicationRepository.cancelPrescription(id);
  },

  async renewPrescription(id: string) {
    await delay(250);
    return medicationRepository.renewPrescription(id);
  },

  async logDose(input: LogDoseInput) {
    await delay(200);
    return medicationRepository.logDose(input);
  },

  async requestRefill(input: RefillRequestInput) {
    await delay(250);
    return medicationRepository.requestRefill(input);
  },

  async approveRefill(id: string) {
    await delay(200);
    return medicationRepository.approveRefill(id);
  },

  async rejectRefill(id: string) {
    await delay(200);
    return medicationRepository.rejectRefill(id);
  },

  async stopMedication(medicationId: string) {
    await delay(200);
    return medicationRepository.pauseMedication(medicationId);
  },

  async pauseMedication(medicationId: string) {
    await delay(200);
    return medicationRepository.pauseMedication(medicationId);
  },

  async resumeMedication(medicationId: string) {
    await delay(200);
    return medicationRepository.resumeMedication(medicationId);
  },

  async completeCourse(medicationId: string) {
    await delay(200);
    return medicationRepository.completeCourse(medicationId);
  },

  async dispense(input: DispenseInput) {
    await delay(250);
    return medicationRepository.dispense(input);
  },

  async administer(input: AdministerInput) {
    await delay(200);
    return medicationRepository.administer(input);
  },

  async getAdministrations(patientId?: string) {
    await delay();
    return medicationRepository.getAdministrations(patientId);
  },

  async getDispenses(patientId?: string) {
    await delay();
    return medicationRepository.getDispenses(patientId);
  },

  async getEducation(medicationId: string) {
    await delay(100);
    return medicationRepository.getEducation(medicationId);
  },

  async getFavorites(patientId?: string) {
    await delay();
    return medicationRepository.getFavorites(patientId);
  },

  async toggleFavorite(medicationId: string) {
    await delay(100);
    return medicationRepository.toggleFavorite(medicationId);
  },

  async markReminderDone(reminderId: string) {
    await delay(100);
    return medicationRepository.markReminderDone(reminderId);
  },

  async exportMedications(patientId: string, format: 'pdf' | 'fhir' | 'csv') {
    await delay(200);
    return medicationRepository.exportMedications(patientId, format);
  },

  async shareMedication(medicationId: string, sharedWith: string) {
    await delay(200);
    return medicationRepository.shareMedication(medicationId, sharedWith);
  },

  async searchMedicationsQuery(query: string, patientId?: string) {
    await delay();
    return medicationRepository.search(query, patientId);
  },
};
