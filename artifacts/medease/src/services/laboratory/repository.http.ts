import { httpTransport } from '@workspace/repository-transport';
import type {
  ApproveResultInput,
  BloodBankRecord,
  CancelLabOrderInput,
  CollectSpecimenInput,
  CreateLabOrderInput,
  ExportResultInput,
  LabAlert,
  LabObservation,
  LabOrderFilters,
  LabResultFilters,
  LabTimelineEntry,
  MicrobiologyResult,
  PathologyResult,
  QualityDashboard,
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

const BASE = '/api/laboratory';

function alertsFromObservations(observations: LabObservation[]): LabAlert[] {
  return observations
    .filter(
      (o) =>
        o.flag === 'critical_high' ||
        o.flag === 'critical_low' ||
        o.flag === 'high' ||
        o.flag === 'low' ||
        o.flag === 'abnormal',
    )
    .map((o) => {
      const critical =
        o.flag === 'critical_high' || o.flag === 'critical_low';
      return {
        id: `alert-${o.id}`,
        type: critical ? ('critical_result' as const) : ('abnormal_result' as const),
        severity: critical ? ('critical' as const) : ('warning' as const),
        patientId: o.patientId,
        orderId: o.orderId,
        reportId: o.reportId,
        observationId: o.id,
        title: `${o.testName} ${o.flag.replace('_', ' ')}`,
        message: o.interpretation ?? `${o.testName}: ${o.value} ${o.unit}`,
        acknowledged: false,
        createdAt: o.resultedAt ?? o.collectedAt,
      };
    });
}

class LaboratoryHttpRepository {
  private readonly transport = httpTransport;
  private readonly favorites = new Set<string>();

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
      return [];
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

  /** Live observations from report details — never mock demo rows. */
  async getObservations(patientId?: string): Promise<LabObservation[]> {
    const reports = await this.getAllResults(
      patientId ? { patientId } : undefined,
    );
    const batches = await Promise.all(
      reports.map((report) => this.getObservationsForReport(report.id)),
    );
    return batches.flat();
  }

  async getAlerts(patientId?: string): Promise<LabAlert[]> {
    return alertsFromObservations(await this.getObservations(patientId));
  }

  async getCriticalAlerts(patientId?: string): Promise<LabAlert[]> {
    return (await this.getAlerts(patientId)).filter(
      (a) => a.severity === 'critical',
    );
  }

  async getMicrobiology(patientId?: string): Promise<MicrobiologyResult[]> {
    const reports = await this.getAllResults({
      ...(patientId ? { patientId } : {}),
      category: 'microbiology',
    });
    return reports.map((report) => ({
      id: report.id,
      reportId: report.id,
      patientId: report.patientId,
      specimenType: report.title,
      status: report.status,
      cultures: [],
      comments: report.summary,
      finalizedAt: report.releasedAt,
      technologistName: report.technologistName,
    }));
  }

  async getPathology(patientId?: string): Promise<PathologyResult[]> {
    const reports = await this.getAllResults({
      ...(patientId ? { patientId } : {}),
      category: 'pathology',
    });
    return reports.map((report) => ({
      id: report.id,
      reportId: report.id,
      patientId: report.patientId,
      specimenSite: report.title,
      status: report.status,
      histology: [],
      macroscopic: report.summary,
      pathologistName: report.approvedBy,
      finalizedAt: report.releasedAt,
    }));
  }

  async getBloodBank(patientId?: string): Promise<BloodBankRecord[]> {
    const reports = await this.getAllResults({
      ...(patientId ? { patientId } : {}),
      category: 'blood_bank',
    });
    return reports.map((report) => ({
      id: report.id,
      patientId: report.patientId,
      orderId: report.orderId,
      component: 'RBC' as const,
      bloodGroup: 'Unknown',
      rhFactor: 'Positive' as const,
      crossMatchResult: 'pending' as const,
      status: report.status,
      collectedAt: report.createdAt,
      verifiedBy: report.verifiedBy,
    }));
  }

  /** No live instrument registry yet — empty, not demo fixtures. */
  async getInstruments() {
    return [];
  }

  async getTechnologists() {
    return [];
  }

  async getQualityControl() {
    return [];
  }

  async getQualityDashboard(): Promise<QualityDashboard> {
    const pending = await this.getPendingResults();
    return {
      qualityScore: 0,
      verificationRate: 0,
      rejectionRate: 0,
      pendingVerification: pending.length,
      instrumentUtilization: 0,
      recentQc: [],
      kpis: [
        { label: 'Pending verification', value: pending.length },
      ],
    };
  }

  async getFavorites(patientId?: string) {
    if (this.favorites.size === 0) return [];
    const reports = await this.getAllResults(
      patientId ? { patientId } : undefined,
    );
    return reports.filter((r) => this.favorites.has(r.id));
  }

  async toggleFavorite(reportId: string) {
    if (this.favorites.has(reportId)) {
      this.favorites.delete(reportId);
      return false;
    }
    this.favorites.add(reportId);
    return true;
  }

  async exportResult(input: ExportResultInput, exportedBy = 'system') {
    const report = await this.getResult(input.reportId);
    if (!report) return null;
    return {
      id: `exp-${report.id}`,
      reportId: input.reportId,
      format: input.format,
      exportedAt: new Date().toISOString(),
      exportedBy,
    };
  }

  async shareResult(input: ShareResultInput) {
    const report = await this.getResult(input.reportId);
    if (!report) return null;
    return {
      id: `share-${report.id}`,
      reportId: input.reportId,
      sharedWith: input.sharedWith,
      sharedAt: new Date().toISOString(),
    };
  }

  async getTimeline(patientId: string): Promise<LabTimelineEntry[]> {
    const [orders, results, alerts] = await Promise.all([
      this.getAllOrders({ patientId }),
      this.getAllResults({ patientId }),
      this.getAlerts(patientId),
    ]);
    const entries: LabTimelineEntry[] = [
      ...orders.map((o) => ({
        id: `tl-order-${o.id}`,
        patientId,
        type: 'order' as const,
        title: `Order ${o.orderNumber}`,
        description: o.testNames.join(', '),
        timestamp: o.createdAt,
        orderId: o.id,
      })),
      ...results.map((r) => ({
        id: `tl-result-${r.id}`,
        patientId,
        type: 'result' as const,
        title: r.title,
        description: r.status,
        timestamp: r.releasedAt ?? r.updatedAt,
        orderId: r.orderId,
        reportId: r.id,
      })),
      ...alerts.map((a) => ({
        id: `tl-${a.id}`,
        patientId,
        type: 'alert' as const,
        title: a.title,
        description: a.message,
        timestamp: a.createdAt,
        orderId: a.orderId,
        reportId: a.reportId,
        severity: a.severity,
      })),
    ];
    return entries.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  async search(query: string, patientId?: string) {
    const q = query.toLowerCase();
    const [orders, results] = await Promise.all([
      this.getAllOrders(patientId ? { patientId } : undefined),
      this.getAllResults(patientId ? { patientId } : undefined),
    ]);
    return {
      orders: orders
        .filter((o) =>
          `${o.orderNumber} ${o.testNames.join(' ')}`.toLowerCase().includes(q),
        )
        .slice(0, 15),
      results: results
        .filter((r) =>
          `${r.reportNumber} ${r.title}`.toLowerCase().includes(q),
        )
        .slice(0, 15),
    };
  }
}

export const laboratoryHttpRepository = new LaboratoryHttpRepository();
