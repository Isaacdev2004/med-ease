import { buildAnalytics } from '@/services/laboratory/analytics';
import {
  getUnacknowledgedAlerts,
  sortAlertsByDate,
} from '@/services/laboratory/alerts';
import {
  getPatientIdForUser,
  buildDashboard,
  buildTrends,
} from '@/services/laboratory/mock-data';
import {
  sortOrdersByDate,
  categorizeOrders,
} from '@/services/laboratory/orders';
import { laboratoryRepository } from '@/services/laboratory/repository';
import {
  getCriticalObservations,
  sortResultsByDate,
} from '@/services/laboratory/results';
import { sortSpecimensByDate } from '@/services/laboratory/specimens';
import type {
  CancelLabOrderInput,
  CollectSpecimenInput,
  CreateLabOrderInput,
  LabOrderFilters,
  LabResultFilters,
  ReleaseResultInput,
  VerifyResultInput,
  ApproveResultInput,
  UploadResultInput,
  ExportResultInput,
  ShareResultInput,
} from '@/services/laboratory/types';

const DELAY = 250;

async function delay() {
  await new Promise((r) => setTimeout(r, DELAY));
}

export const laboratoryService = {
  async resolvePatientId(userId: string) {
    await delay();
    return getPatientIdForUser(userId);
  },

  async getDashboard(patientId?: string) {
    await delay();
    return buildDashboard(patientId);
  },

  async searchOrders(filters?: LabOrderFilters) {
    await delay();
    return laboratoryRepository.listOrders(filters);
  },

  async getAllOrders(filters?: LabOrderFilters) {
    await delay();
    return sortOrdersByDate(laboratoryRepository.getAllOrders(filters));
  },

  async getOrder(id: string) {
    await delay();
    return laboratoryRepository.getOrder(id);
  },

  async createOrder(input: CreateLabOrderInput) {
    await delay();
    return laboratoryRepository.createOrder(input);
  },

  async cancelOrder(input: CancelLabOrderInput) {
    await delay();
    return laboratoryRepository.cancelOrder(input);
  },

  async searchResults(filters?: LabResultFilters) {
    await delay();
    return laboratoryRepository.listResults(filters);
  },

  async getAllResults(filters?: LabResultFilters) {
    await delay();
    return sortResultsByDate(laboratoryRepository.getAllResults(filters));
  },

  async getResult(id: string) {
    await delay();
    const report = laboratoryRepository.getResult(id);
    if (!report) return null;
    return {
      report,
      observations: laboratoryRepository.getObservationsForReport(id),
    };
  },

  async getPatientLaboratory(patientId: string) {
    await delay();
    const orders = sortOrdersByDate(
      laboratoryRepository.getAllOrders({ patientId }),
    );
    const results = sortResultsByDate(
      laboratoryRepository.getAllResults({ patientId }),
    );
    const observations = laboratoryRepository.getObservations(patientId);
    return {
      orders,
      results,
      observations,
      categorized: categorizeOrders(orders),
      critical: getCriticalObservations(observations),
    };
  },

  async getTimeline(patientId: string) {
    await delay();
    return laboratoryRepository.getTimeline(patientId);
  },

  async getTrends(patientId: string) {
    await delay();
    return buildTrends(patientId);
  },

  async getAlerts(patientId?: string) {
    await delay();
    return sortAlertsByDate(laboratoryRepository.getAlerts(patientId));
  },

  async getCriticalResults(patientId?: string) {
    await delay();
    return sortAlertsByDate(laboratoryRepository.getCriticalAlerts(patientId));
  },

  async getUnacknowledgedAlerts(patientId?: string) {
    await delay();
    return getUnacknowledgedAlerts(laboratoryRepository.getAlerts(patientId));
  },

  async getSpecimens(orderId?: string, patientId?: string) {
    await delay();
    return sortSpecimensByDate(
      laboratoryRepository.getSpecimens(orderId, patientId),
    );
  },

  async collectSpecimen(input: CollectSpecimenInput) {
    await delay();
    return laboratoryRepository.collectSpecimen(input);
  },

  async verifyResult(input: VerifyResultInput) {
    await delay();
    return laboratoryRepository.verifyResult(input);
  },

  async releaseResult(input: ReleaseResultInput) {
    await delay();
    return laboratoryRepository.releaseResult(input);
  },

  async getAnalytics() {
    await delay();
    return buildAnalytics();
  },

  async search(query: string, patientId?: string) {
    await delay();
    return laboratoryRepository.search(query, patientId);
  },

  async getTestCatalog() {
    await delay();
    return laboratoryRepository.getTestCatalog();
  },

  async getReferenceRanges() {
    await delay();
    return laboratoryRepository.getTestCatalog().map((t) => ({
      testId: t.id,
      name: t.name,
      referenceRange: t.referenceRange,
      criticalRange: t.criticalRange,
      units: t.units,
    }));
  },

  async getPendingResults(patientId?: string) {
    await delay();
    return laboratoryRepository.getPendingResults(patientId);
  },

  async getMicrobiology(patientId?: string) {
    await delay();
    return laboratoryRepository.getMicrobiology(patientId);
  },

  async getPathology(patientId?: string) {
    await delay();
    return laboratoryRepository.getPathology(patientId);
  },

  async getBloodBank(patientId?: string) {
    await delay();
    return laboratoryRepository.getBloodBank(patientId);
  },

  async getInstruments() {
    await delay();
    return laboratoryRepository.getInstruments();
  },

  async getTechnologists() {
    await delay();
    return laboratoryRepository.getTechnologists();
  },

  async getQualityControl() {
    await delay();
    return laboratoryRepository.getQualityControl();
  },

  async getQualityDashboard() {
    await delay();
    return laboratoryRepository.getQualityDashboard();
  },

  async getFavorites(patientId?: string) {
    await delay();
    return laboratoryRepository.getFavorites(patientId);
  },

  async toggleFavorite(reportId: string) {
    await delay();
    return laboratoryRepository.toggleFavorite(reportId);
  },

  async approveResult(input: ApproveResultInput) {
    await delay();
    return laboratoryRepository.approveResult(input);
  },

  async uploadResult(input: UploadResultInput) {
    await delay();
    return laboratoryRepository.uploadResult(input);
  },

  async exportResult(input: ExportResultInput, exportedBy?: string) {
    await delay();
    return laboratoryRepository.exportResult(input, exportedBy);
  },

  async shareResult(input: ShareResultInput) {
    await delay();
    return laboratoryRepository.shareResult(input);
  },

  async getTrendAnalysis(patientId: string, testId?: string) {
    await delay();
    const trends = buildTrends(patientId);
    return testId ? trends.filter((t) => t.testId === testId) : trends;
  },
};
