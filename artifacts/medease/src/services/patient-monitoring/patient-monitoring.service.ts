import { computeMonitoringAnalytics } from '@/services/patient-monitoring/analytics';
import { getPatientIdForUser } from '@/services/patient-monitoring/mock-data';
import { patientMonitoringRepository } from '@/services/patient-monitoring/repository';
import type {
  AssignDeviceInput,
  CreateObservationInput,
  EnrollRPMInput,
  MonitoringFilters,
  UpdateObservationInput,
} from '@/services/patient-monitoring/types';

const DELAY = 250;

async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const patientMonitoringService = {
  async resolvePatientId(userId: string, explicitId?: string) {
    await delay(50);
    return explicitId ?? getPatientIdForUser(userId);
  },

  async getDashboard(patientId?: string) {
    await delay();
    return patientMonitoringRepository.getDashboard(patientId);
  },

  async getVitalSigns(filters?: MonitoringFilters) {
    await delay();
    return patientMonitoringRepository.listVitals(filters);
  },

  async getObservations(filters?: MonitoringFilters) {
    await delay();
    return patientMonitoringRepository.listObservations(filters);
  },

  async getObservation(id: string) {
    await delay();
    return patientMonitoringRepository.getObservation(id);
  },

  async createObservation(input: CreateObservationInput) {
    await delay();
    return patientMonitoringRepository.createObservation(input);
  },

  async updateObservation(input: UpdateObservationInput) {
    await delay();
    return patientMonitoringRepository.updateObservation(input);
  },

  async getAlerts(filters?: MonitoringFilters) {
    await delay();
    return patientMonitoringRepository.listAlerts(filters);
  },

  async resolveAlert(id: string, resolvedBy?: string) {
    await delay();
    return patientMonitoringRepository.resolveAlert(id, resolvedBy);
  },

  async dismissAlert(id: string) {
    await delay();
    return patientMonitoringRepository.dismissAlert(id);
  },

  async acknowledgeAlert(id: string, by: string) {
    await delay();
    return patientMonitoringRepository.acknowledgeAlert(id, by);
  },

  async getTimeline(patientId: string) {
    await delay();
    return patientMonitoringRepository.getTimeline(patientId);
  },

  async getDevices(patientId?: string) {
    await delay();
    return patientMonitoringRepository.listDevices(patientId);
  },

  async getDevice(id: string) {
    await delay();
    return patientMonitoringRepository.getDevice(id);
  },

  async assignDevice(input: AssignDeviceInput) {
    await delay();
    return patientMonitoringRepository.assignDevice(input);
  },

  async syncDevice(deviceId: string) {
    await delay();
    return patientMonitoringRepository.syncDevice(deviceId);
  },

  async getRPMPrograms(patientId?: string) {
    await delay();
    return patientMonitoringRepository.listRPMPrograms(patientId);
  },

  async enrollRPM(input: EnrollRPMInput) {
    await delay();
    return patientMonitoringRepository.enrollRPM(input);
  },

  async removeRPM(programId: string) {
    await delay();
    return patientMonitoringRepository.removeRPM(programId);
  },

  async getTrendAnalysis(patientId: string, metric?: string) {
    await delay();
    return patientMonitoringRepository.getTrendAnalysis(patientId, metric as Parameters<typeof patientMonitoringRepository.getTrendAnalysis>[1]);
  },

  async getEarlyWarningScores(patientId?: string) {
    await delay();
    return patientMonitoringRepository.getEarlyWarningScores(patientId);
  },

  async getSessions(patientId?: string) {
    await delay();
    return patientMonitoringRepository.getSessions(patientId);
  },

  async search(query: string, patientId?: string) {
    await delay();
    return patientMonitoringRepository.search(query, patientId);
  },

  async getHistory(patientId: string) {
    await delay();
    return patientMonitoringRepository.getHistory(patientId);
  },

  async getAnalytics() {
    await delay();
    return computeMonitoringAnalytics();
  },

  async getFavorites(patientId: string) {
    await delay();
    return patientMonitoringRepository.getFavorites(patientId);
  },

  async toggleFavorite(patientId: string, observationId: string) {
    await delay();
    return patientMonitoringRepository.toggleFavorite(patientId, observationId);
  },

  async exportObservations(patientId: string, format: 'pdf' | 'csv' | 'fhir') {
    await delay();
    return patientMonitoringRepository.exportObservations(patientId, format);
  },

  async shareObservations(patientId: string, sharedWith: string, observationIds: string[]) {
    await delay();
    return patientMonitoringRepository.shareObservations(patientId, sharedWith, observationIds);
  },
};
