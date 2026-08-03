import { httpTransport } from '@workspace/repository-transport';
import type {
  AddAnnotationInput,
  AddMeasurementInput,
  ApproveReportInput,
  CompleteInterpretationInput,
  CreateRadiologyOrderInput,
  ImageExport,
  StudyFilters,
} from '@/services/radiology/types';
import {
  mapDiagnosticReport,
  mapDiagnosticReportArray,
  mapImagingDeviceArray,
  mapPaginatedStudies,
  mapRadiologistArray,
  mapRadiologyOrder,
  mapRadiologyStudy,
  mapRadiologyStudyArray,
  studyFiltersToQuery,
} from '@/services/radiology/dto-mappers';
import { radiologyMockRepository } from '@/services/radiology/repository.mock';

const BASE = '/api/radiology';

class RadiologyHttpRepository {
  private readonly transport = httpTransport;
  private readonly mock = radiologyMockRepository;

  async listStudies(filters?: StudyFilters) {
    return mapPaginatedStudies(
      await this.transport.get(`${BASE}/studies`, {
        query: studyFiltersToQuery(filters),
      }),
    );
  }

  async getAllStudies(filters?: StudyFilters) {
    return mapRadiologyStudyArray(
      await this.transport.get(`${BASE}/studies/all`, {
        query: studyFiltersToQuery(filters),
      }),
    );
  }

  async getStudy(id: string) {
    try {
      return mapRadiologyStudy(
        await this.transport.get(`${BASE}/studies/${id}`),
      );
    } catch {
      return null;
    }
  }

  async getReport(id: string) {
    try {
      return mapDiagnosticReport(
        await this.transport.get(`${BASE}/reports/${id}`),
      );
    } catch {
      return null;
    }
  }

  async getReportByStudy(studyId: string) {
    try {
      return mapDiagnosticReport(
        await this.transport.get(`${BASE}/reports/by-study/${studyId}`),
      );
    } catch {
      return null;
    }
  }

  async getAllReports(patientId?: string) {
    return mapDiagnosticReportArray(
      await this.transport.get(`${BASE}/reports/all`, {
        query: studyFiltersToQuery({ patientId }),
      }),
    );
  }

  async getPendingReports() {
    return mapDiagnosticReportArray(
      await this.transport.get(`${BASE}/reports/pending`),
    );
  }

  async getCriticalReports(patientId?: string) {
    return mapDiagnosticReportArray(
      await this.transport.get(`${BASE}/reports/critical`, {
        query: studyFiltersToQuery({ patientId }),
      }),
    );
  }

  async getUnreadReports(patientId?: string) {
    const reports = await this.getAllReports(patientId);
    return reports.filter((r) => r.isUnread);
  }

  getTimeline(patientId: string) {
    return this.mock.getTimeline(patientId);
  }

  getComparison(studyId: string, comparisonStudyId: string) {
    return this.mock.getComparison(studyId, comparisonStudyId);
  }

  async getRadiologists() {
    return mapRadiologistArray(
      await this.transport.get(`${BASE}/radiologists`),
    );
  }

  async getDevices() {
    return mapImagingDeviceArray(await this.transport.get(`${BASE}/devices`));
  }

  getAnnotations(studyId: string) {
    return this.mock.getAnnotations(studyId);
  }

  getMeasurements(studyId: string) {
    return this.mock.getMeasurements(studyId);
  }

  getFavorites(patientId?: string) {
    return this.mock.getFavorites(patientId);
  }

  async createOrder(input: CreateRadiologyOrderInput) {
    return mapRadiologyOrder(
      await this.transport.post(`${BASE}/orders`, { body: input }),
    );
  }

  async completeInterpretation(input: CompleteInterpretationInput) {
    try {
      return mapDiagnosticReport(
        await this.transport.post(
          `${BASE}/reports/${input.reportId}/interpret`,
          {
            body: {
              findings: input.findings,
              impression: input.impression,
              recommendations: input.recommendations,
            },
          },
        ),
      );
    } catch {
      return null;
    }
  }

  async approveReport(input: ApproveReportInput) {
    try {
      return mapDiagnosticReport(
        await this.transport.post(
          `${BASE}/reports/${input.reportId}/approve`,
          {
            body: {
              radiologistId: input.radiologistId,
              radiologistName: input.radiologistName,
            },
          },
        ),
      );
    } catch {
      return null;
    }
  }

  addAnnotation(input: AddAnnotationInput) {
    return this.mock.addAnnotation(input);
  }

  deleteAnnotation(id: string) {
    return this.mock.deleteAnnotation(id);
  }

  addMeasurement(input: AddMeasurementInput) {
    return this.mock.addMeasurement(input);
  }

  toggleFavorite(studyId: string) {
    return this.mock.toggleFavorite(studyId);
  }

  shareStudy(studyId: string, sharedWith: string) {
    return this.mock.shareStudy(studyId, sharedWith);
  }

  exportStudy(studyId: string, format: ImageExport['format']) {
    return this.mock.exportStudy(studyId, format);
  }

  async archiveStudy(id: string) {
    try {
      return mapRadiologyStudy(
        await this.transport.post(`${BASE}/studies/${id}/archive`, {
          body: {},
        }),
      );
    } catch {
      return null;
    }
  }

  search(query: string, patientId?: string) {
    return this.mock.search(query, patientId);
  }
}

export const radiologyHttpRepository = new RadiologyHttpRepository();
