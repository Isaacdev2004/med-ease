import { useApiAuth } from '@/services/auth/auth-service';
import { getPatientIdForUser } from '@/services/laboratory/mock-data';
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
import { resolveClinicalPatientId } from '@/services/patients/resolve-patient-id';
import { buildAnalytics } from '@/services/laboratory/analytics';
import {
  getUnacknowledgedAlerts,
  sortAlertsByDate,
} from '@/services/laboratory/alerts';
import type {
  CancelLabOrderInput,
  CollectSpecimenInput,
  CreateLabOrderInput,
  LabOrderFilters,
  LabResultFilters,
  LaboratoryDashboard,
  ReleaseResultInput,
  VerifyResultInput,
  ApproveResultInput,
  UploadResultInput,
  ExportResultInput,
  ShareResultInput,
} from '@/services/laboratory/types';

const DELAY = useApiAuth ? 0 : 250;

async function delay() {
  if (DELAY <= 0) return;
  await new Promise((r) => setTimeout(r, DELAY));
}

async function buildLiveDashboard(
  patientId?: string,
): Promise<LaboratoryDashboard> {
  const [orders, results, specimens] = await Promise.all([
    laboratoryRepository.getAllOrders(patientId ? { patientId } : undefined),
    laboratoryRepository.getAllResults(patientId ? { patientId } : undefined),
    laboratoryRepository.getSpecimens(undefined, patientId),
  ]);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  ).length;
  const pendingCollection = orders.filter((o) =>
    ['pending', 'scheduled'].includes(o.status),
  ).length;
  const collectedSamples = orders.filter((o) => o.status === 'collected').length;
  const inProcessing = orders.filter((o) => o.status === 'in_progress').length;
  const resultsReady = results.filter((r) => r.status === 'released').length;
  const criticalResults = results.filter((r) =>
    r.title?.toLowerCase().includes('critical'),
  ).length;
  const rejectedSamples = specimens.filter((s) => s.status === 'rejected').length;
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length;

  return {
    patientId,
    todayOrders,
    pendingCollection,
    collectedSamples,
    inProcessing,
    resultsReady,
    criticalResults,
    rejectedSamples,
    cancelledOrders,
    averageTurnaroundHours: 0,
    recentActivity: [],
    kpis: [
      { label: 'Orders today', value: todayOrders },
      { label: 'Pending', value: pendingCollection },
      { label: 'Critical', value: criticalResults },
    ],
    chartData: [
      { label: 'Pending', value: pendingCollection },
      { label: 'In progress', value: inProcessing },
      { label: 'Ready', value: resultsReady },
      { label: 'Cancelled', value: cancelledOrders },
    ],
  };
}

export const laboratoryService = {
  async resolvePatientId(userId: string, explicitId?: string) {
    await delay();
    return resolveClinicalPatientId(userId, {
      explicitId,
      demoFallback: getPatientIdForUser,
    });
  },

  async getDashboard(patientId?: string) {
    await delay();
    if (useApiAuth) return buildLiveDashboard(patientId);
    const { buildDashboard } = await import('@/services/laboratory/mock-data');
    return buildDashboard(patientId);
  },

  async searchOrders(filters?: LabOrderFilters) {
    await delay();
    return laboratoryRepository.listOrders(filters);
  },

  async getAllOrders(filters?: LabOrderFilters) {
    await delay();
    return sortOrdersByDate(await laboratoryRepository.getAllOrders(filters));
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
    return sortResultsByDate(await laboratoryRepository.getAllResults(filters));
  },

  async getResult(id: string) {
    await delay();
    const report = await laboratoryRepository.getResult(id);
    if (!report) return null;
    return {
      report,
      observations: await laboratoryRepository.getObservationsForReport(id),
    };
  },

  async getPatientLaboratory(patientId: string) {
    await delay();
    const orders = sortOrdersByDate(
      await laboratoryRepository.getAllOrders({ patientId }),
    );
    const results = sortResultsByDate(
      await laboratoryRepository.getAllResults({ patientId }),
    );
    const observations = await laboratoryRepository.getObservations(patientId);
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
    if (useApiAuth) {
      // Trends require observation time series — return empty until live obs API lands.
      return [];
    }
    const { buildTrends } = await import('@/services/laboratory/mock-data');
    return buildTrends(patientId);
  },

  async getAlerts(patientId?: string) {
    await delay();
    return sortAlertsByDate(await laboratoryRepository.getAlerts(patientId));
  },

  async getCriticalResults(patientId?: string) {
    await delay();
    return sortAlertsByDate(
      await laboratoryRepository.getCriticalAlerts(patientId),
    );
  },

  async getUnacknowledgedAlerts(patientId?: string) {
    await delay();
    return getUnacknowledgedAlerts(
      await laboratoryRepository.getAlerts(patientId),
    );
  },

  async getSpecimens(orderId?: string, patientId?: string) {
    await delay();
    return sortSpecimensByDate(
      await laboratoryRepository.getSpecimens(orderId, patientId),
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
    const catalog = await laboratoryRepository.getTestCatalog();
    return catalog.map((t) => ({
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
    if (useApiAuth) return [];
    const { buildTrends } = await import('@/services/laboratory/mock-data');
    const trends = buildTrends(patientId);
    return testId ? trends.filter((t) => t.testId === testId) : trends;
  },
};
