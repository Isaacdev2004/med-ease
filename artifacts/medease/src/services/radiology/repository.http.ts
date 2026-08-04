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

const BASE = '/api/radiology';

class RadiologyHttpRepository {
  private readonly transport = httpTransport;
  private readonly favorites = new Set<string>();

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

  async getTimeline(patientId: string) {
    const [studies, reports] = await Promise.all([
      this.getAllStudies({ patientId }),
      this.getAllReports(patientId),
    ]);
    return [
      ...studies.map((s) => ({
        id: `tl-study-${s.id}`,
        patientId,
        type: 'study' as const,
        title: `${s.modality} ${s.bodyPart}`,
        description: s.status,
        timestamp: s.studyDate || s.createdAt,
        studyId: s.id,
      })),
      ...reports.map((r) => ({
        id: `tl-report-${r.id}`,
        patientId,
        type: 'report' as const,
        title: r.title,
        description: r.status,
        timestamp: r.signedAt || r.createdAt,
        studyId: r.studyId,
        severity: r.isCritical ? ('critical' as const) : undefined,
      })),
    ].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  async getComparison(_studyId: string, _comparisonStudyId: string) {
    return null;
  }

  async getRadiologists() {
    return mapRadiologistArray(
      await this.transport.get(`${BASE}/radiologists`),
    );
  }

  async getDevices() {
    return mapImagingDeviceArray(await this.transport.get(`${BASE}/devices`));
  }

  async getAnnotations(_studyId: string) {
    return [];
  }

  async getMeasurements(_studyId: string) {
    return [];
  }

  async getFavorites(patientId?: string) {
    if (this.favorites.size === 0) return [];
    const studies = await this.getAllStudies(
      patientId ? { patientId } : undefined,
    );
    return studies.filter((s) => this.favorites.has(s.id));
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

  async addAnnotation(_input: AddAnnotationInput) {
    return null;
  }

  async deleteAnnotation(_id: string) {
    return false;
  }

  async addMeasurement(_input: AddMeasurementInput) {
    return null;
  }

  async toggleFavorite(studyId: string) {
    if (this.favorites.has(studyId)) {
      this.favorites.delete(studyId);
      return false;
    }
    this.favorites.add(studyId);
    return true;
  }

  async shareStudy(studyId: string, sharedWith: string) {
    const study = await this.getStudy(studyId);
    if (!study) return null;
    return {
      id: `share-${studyId}`,
      studyId,
      sharedWith,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };
  }

  async exportStudy(studyId: string, format: ImageExport['format']) {
    const study = await this.getStudy(studyId);
    if (!study) return null;
    return {
      id: `exp-${studyId}`,
      studyId,
      format,
      status: 'ready' as const,
      url: `${BASE}/studies/${studyId}/export.${format}`,
      createdAt: new Date().toISOString(),
    };
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

  async search(query: string, patientId?: string) {
    const q = query.toLowerCase();
    const [studies, reports] = await Promise.all([
      this.getAllStudies(patientId ? { patientId } : undefined),
      this.getAllReports(patientId),
    ]);
    return {
      studies: studies
        .filter((s) =>
          `${s.accessionNumber} ${s.modality} ${s.bodyPart}`
            .toLowerCase()
            .includes(q),
        )
        .slice(0, 15),
      reports: reports
        .filter((r) =>
          `${r.title} ${r.accessionNumber}`.toLowerCase().includes(q),
        )
        .slice(0, 15),
    };
  }
}

export const radiologyHttpRepository = new RadiologyHttpRepository();
