import { httpTransport } from '@workspace/repository-transport';
import type {
  ApproveResultInput,
  CancelLabOrderInput,
  CollectSpecimenInput,
  CreateLabOrderInput,
  ExportResultInput,
  LabOrderFilters,
  LabResultFilters,
  ReleaseResultInput,
  ShareResultInput,
  UploadResultInput,
  VerifyResultInput,
} from '@/services/laboratory/types';
import {
  labOrderFiltersToQuery,
  labResultFiltersToQuery,
  mapLabDiagnosticReport,
  mapLabDiagnosticReportArray,
  mapLabOrder,
  mapLabOrderArray,
  mapLabTestDefinitionArray,
  mapPaginatedLabOrders,
  mapPaginatedLabResults,
  mapResultDetail,
  mapSpecimenRecord,
  mapSpecimenRecordArray,
} from '@/services/laboratory/dto-mappers';
import { laboratoryMockRepository } from '@/services/laboratory/repository.mock';

const BASE = '/api/laboratory';

class LaboratoryHttpRepository {
  private readonly transport = httpTransport;
  private readonly mock = laboratoryMockRepository;

  async listOrders(filters?: LabOrderFilters) {
    return mapPaginatedLabOrders(
      await this.transport.get(`${BASE}/orders`, {
        query: labOrderFiltersToQuery(filters),
      }),
    );
  }

  async getAllOrders(filters?: LabOrderFilters) {
    return mapLabOrderArray(
      await this.transport.get(`${BASE}/orders/all`, {
        query: labOrderFiltersToQuery(filters),
      }),
    );
  }

  async getOrder(id: string) {
    try {
      return mapLabOrder(await this.transport.get(`${BASE}/orders/${id}`));
    } catch {
      return null;
    }
  }

  async createOrder(input: CreateLabOrderInput) {
    return mapLabOrder(
      await this.transport.post(`${BASE}/orders`, { body: input }),
    );
  }

  async cancelOrder(input: CancelLabOrderInput) {
    try {
      return mapLabOrder(
        await this.transport.post(`${BASE}/orders/${input.orderId}/cancel`, {
          body: { reason: input.reason },
        }),
      );
    } catch {
      return null;
    }
  }

  async listResults(filters?: LabResultFilters) {
    return mapPaginatedLabResults(
      await this.transport.get(`${BASE}/results`, {
        query: labResultFiltersToQuery(filters),
      }),
    );
  }

  async getAllResults(filters?: LabResultFilters) {
    return mapLabDiagnosticReportArray(
      await this.transport.get(`${BASE}/results/all`, {
        query: labResultFiltersToQuery(filters),
      }),
    );
  }

  async getResult(id: string) {
    try {
      const detail = mapResultDetail(
        await this.transport.get(`${BASE}/results/${id}`),
      );
      return detail.report;
    } catch {
      return null;
    }
  }

  async getObservationsForReport(reportId: string) {
    try {
      const detail = mapResultDetail(
        await this.transport.get(`${BASE}/results/${reportId}`),
      );
      return detail.observations;
    } catch {
      return this.mock.getObservationsForReport(reportId);
    }
  }

  async getPendingResults(patientId?: string) {
    return mapLabDiagnosticReportArray(
      await this.transport.get(`${BASE}/results/pending`, {
        query: labResultFiltersToQuery({ patientId }),
      }),
    );
  }

  async collectSpecimen(input: CollectSpecimenInput) {
    try {
      return mapSpecimenRecord(
        await this.transport.post(`${BASE}/orders/${input.orderId}/collect`, {
          body: {
            collectedBy: input.collectedBy,
            temperature: input.temperature,
          },
        }),
      );
    } catch {
      return null;
    }
  }

  async uploadResult(input: UploadResultInput) {
    try {
      return mapResultDetail(
        await this.transport.post(`${BASE}/orders/${input.orderId}/results`, {
          body: input,
        }),
      );
    } catch {
      return null;
    }
  }

  async verifyResult(input: VerifyResultInput) {
    try {
      return mapLabDiagnosticReport(
        await this.transport.post(
          `${BASE}/results/${input.reportId}/verify`,
          {
            body: {
              verifiedBy: input.verifiedBy,
              comments: input.comments,
            },
          },
        ),
      );
    } catch {
      return null;
    }
  }

  async approveResult(input: ApproveResultInput) {
    try {
      return mapLabDiagnosticReport(
        await this.transport.post(
          `${BASE}/results/${input.reportId}/approve`,
          {
            body: {
              approvedBy: input.approvedBy,
              digitalSignature: input.digitalSignature,
              comments: input.comments,
            },
          },
        ),
      );
    } catch {
      return null;
    }
  }

  async releaseResult(input: ReleaseResultInput) {
    try {
      return mapLabDiagnosticReport(
        await this.transport.post(
          `${BASE}/results/${input.reportId}/release`,
          {
            body: { comments: input.comments },
          },
        ),
      );
    } catch {
      return null;
    }
  }

  async getSpecimens(orderId?: string, patientId?: string) {
    return mapSpecimenRecordArray(
      await this.transport.get(`${BASE}/specimens`, {
        query: { orderId, patientId },
      }),
    );
  }

  async getTestCatalog() {
    return mapLabTestDefinitionArray(
      await this.transport.get(`${BASE}/catalog`),
    );
  }

  // MVP mock-only surfaces (hybrid, same pattern as care-plans goals)
  getObservations(patientId?: string) {
    return this.mock.getObservations(patientId);
  }

  getAlerts(patientId?: string) {
    return this.mock.getAlerts(patientId);
  }

  getCriticalAlerts(patientId?: string) {
    return this.mock.getCriticalAlerts(patientId);
  }

  getMicrobiology(patientId?: string) {
    return this.mock.getMicrobiology(patientId);
  }

  getPathology(patientId?: string) {
    return this.mock.getPathology(patientId);
  }

  getBloodBank(patientId?: string) {
    return this.mock.getBloodBank(patientId);
  }

  getInstruments() {
    return this.mock.getInstruments();
  }

  getTechnologists() {
    return this.mock.getTechnologists();
  }

  getQualityControl() {
    return this.mock.getQualityControl();
  }

  getQualityDashboard() {
    return this.mock.getQualityDashboard();
  }

  getFavorites(patientId?: string) {
    return this.mock.getFavorites(patientId);
  }

  toggleFavorite(reportId: string) {
    return this.mock.toggleFavorite(reportId);
  }

  exportResult(input: ExportResultInput, exportedBy?: string) {
    return this.mock.exportResult(input, exportedBy);
  }

  shareResult(input: ShareResultInput) {
    return this.mock.shareResult(input);
  }

  getTimeline(patientId: string) {
    return this.mock.getTimeline(patientId);
  }

  search(query: string, patientId?: string) {
    return this.mock.search(query, patientId);
  }
}

export const laboratoryHttpRepository = new LaboratoryHttpRepository();
