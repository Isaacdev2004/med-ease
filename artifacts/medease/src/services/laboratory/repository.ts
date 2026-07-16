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
  MOCK_BLOOD_BANK,
  MOCK_INSTRUMENTS,
  MOCK_LAB_ALERTS,
  MOCK_LAB_ORDERS,
  MOCK_LAB_OBSERVATIONS,
  MOCK_LAB_REPORTS,
  MOCK_MICROBIOLOGY,
  MOCK_PATHOLOGY,
  MOCK_QUALITY_CONTROL,
  MOCK_SPECIMENS,
  MOCK_TECHNOLOGISTS,
  buildLabTimeline,
  buildQualityDashboard,
  generateLabOrder,
} from '@/services/laboratory/mock-data';
import { LAB_TEST_CATALOG } from '@/services/laboratory/reference-ranges';
import { matchesOrderFilters } from '@/services/laboratory/orders';
import { getTestById, computeResultFlag } from '@/services/laboratory/reference-ranges';
import { matchesResultFilters } from '@/services/laboratory/results';

class LaboratoryRepository {
  private orders = [...MOCK_LAB_ORDERS];
  private reports = [...MOCK_LAB_REPORTS];
  private observations = [...MOCK_LAB_OBSERVATIONS];
  private specimens = [...MOCK_SPECIMENS];
  private alerts = [...MOCK_LAB_ALERTS];
  private favorites = new Set<string>(MOCK_LAB_REPORTS.filter((_, i) => i % 17 === 0).map((r) => r.id));
  private exports: { id: string; reportId: string; format: ExportResultInput['format']; exportedAt: string; exportedBy: string }[] = [];
  private shares: { id: string; reportId: string; sharedWith: string; sharedAt: string }[] = [];

  listOrders(filters?: LabOrderFilters) {
    const filtered = this.orders.filter((o) => matchesOrderFilters(o, filters ?? {}));
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 25;
    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize };
  }

  getAllOrders(filters?: LabOrderFilters) {
    return this.orders.filter((o) => matchesOrderFilters(o, filters ?? {}));
  }

  getOrder(id: string) {
    return this.orders.find((o) => o.id === id) ?? null;
  }

  listResults(filters?: LabResultFilters) {
    const filtered = this.reports.filter((r) =>
      matchesResultFilters(r, this.observations, filters ?? {}),
    );
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 25;
    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize };
  }

  getAllResults(filters?: LabResultFilters) {
    return this.reports.filter((r) => matchesResultFilters(r, this.observations, filters ?? {}));
  }

  getResult(id: string) {
    return this.reports.find((r) => r.id === id) ?? null;
  }

  getObservationsForReport(reportId: string) {
    return this.observations.filter((o) => o.reportId === reportId);
  }

  getObservations(patientId?: string) {
    return patientId ? this.observations.filter((o) => o.patientId === patientId) : this.observations;
  }

  getSpecimens(orderId?: string, patientId?: string) {
    return this.specimens.filter((s) => {
      if (orderId && s.orderId !== orderId) return false;
      if (patientId && s.patientId !== patientId) return false;
      return true;
    });
  }

  getAlerts(patientId?: string) {
    return patientId ? this.alerts.filter((a) => a.patientId === patientId) : this.alerts;
  }

  getCriticalAlerts(patientId?: string) {
    return this.getAlerts(patientId).filter((a) => a.severity === 'critical');
  }

  getPendingResults(patientId?: string) {
    return this.getAllResults(patientId ? { patientId } : undefined).filter((r) =>
      r.status === 'pending' || r.status === 'processing',
    );
  }

  getMicrobiology(patientId?: string) {
    return patientId
      ? MOCK_MICROBIOLOGY.filter((m) => m.patientId === patientId)
      : MOCK_MICROBIOLOGY;
  }

  getPathology(patientId?: string) {
    return patientId
      ? MOCK_PATHOLOGY.filter((p) => p.patientId === patientId)
      : MOCK_PATHOLOGY;
  }

  getBloodBank(patientId?: string) {
    return patientId
      ? MOCK_BLOOD_BANK.filter((b) => b.patientId === patientId)
      : MOCK_BLOOD_BANK;
  }

  getInstruments() {
    return MOCK_INSTRUMENTS;
  }

  getTechnologists() {
    return MOCK_TECHNOLOGISTS;
  }

  getQualityControl() {
    return MOCK_QUALITY_CONTROL;
  }

  getQualityDashboard() {
    return buildQualityDashboard();
  }

  getFavorites(patientId?: string) {
    const favIds = this.favorites;
    return this.reports.filter((r) => {
      if (!favIds.has(r.id)) return false;
      if (patientId && r.patientId !== patientId) return false;
      return true;
    });
  }

  toggleFavorite(reportId: string) {
    if (this.favorites.has(reportId)) {
      this.favorites.delete(reportId);
      return false;
    }
    this.favorites.add(reportId);
    return true;
  }

  approveResult(input: ApproveResultInput) {
    const idx = this.reports.findIndex((r) => r.id === input.reportId);
    if (idx < 0) return null;
    this.reports[idx] = {
      ...this.reports[idx]!,
      status: 'released',
      approvedBy: input.approvedBy,
      digitalSignature: input.digitalSignature ?? `SIG-${Date.now()}`,
      comments: input.comments ?? this.reports[idx]!.comments,
      releasedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.reports[idx]!;
  }

  uploadResult(input: UploadResultInput) {
    const order = this.getOrder(input.orderId);
    if (!order) return null;
    const reportId = `rep-upload-${Date.now()}`;
    const obs = input.observations.map((o, i) => {
      const test = getTestById(o.testId);
      return {
        id: `obs-${reportId}-${i}`,
        reportId,
        orderId: order.id,
        patientId: order.patientId,
        testId: o.testId,
        testName: test?.name ?? o.testId,
        loincCode: test?.loincCode ?? '',
        category: test?.category ?? input.category,
        value: o.value,
        numericValue: o.numericValue,
        unit: test?.units ?? '',
        referenceRange: test?.referenceRange ?? '',
        flag: test ? computeResultFlag(test, o.numericValue ?? 0) : 'normal',
        interpretation: o.interpretation,
        collectedAt: order.collectedAt ?? new Date().toISOString(),
        resultedAt: new Date().toISOString(),
      };
    });
    this.observations.push(...obs);
    const report = {
      id: reportId,
      orderId: order.id,
      patientId: order.patientId,
      patientName: order.patientName,
      reportNumber: `RPT-${Date.now().toString().slice(-6)}`,
      status: 'processing' as const,
      category: input.category,
      title: input.title,
      observationIds: obs.map((o) => o.id),
      technologistId: input.technologistId,
      technologistName: input.technologistName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.reports.unshift(report);
    return { report, observations: obs };
  }

  exportResult(input: ExportResultInput, exportedBy = 'system') {
    const report = this.getResult(input.reportId);
    if (!report) return null;
    const record = {
      id: `exp-${Date.now()}`,
      reportId: input.reportId,
      format: input.format,
      exportedAt: new Date().toISOString(),
      exportedBy,
    };
    this.exports.unshift(record);
    return record;
  }

  shareResult(input: ShareResultInput) {
    const report = this.getResult(input.reportId);
    if (!report) return null;
    const record = {
      id: `share-${Date.now()}`,
      reportId: input.reportId,
      sharedWith: input.sharedWith,
      sharedAt: new Date().toISOString(),
    };
    this.shares.unshift(record);
    return record;
  }

  getTimeline(patientId: string) {
    return buildLabTimeline(patientId);
  }

  getTestCatalog() {
    return LAB_TEST_CATALOG;
  }

  createOrder(input: CreateLabOrderInput) {
    const idx = this.orders.length;
    const base = generateLabOrder(idx);
    const testNames = input.testIds.map((id) => getTestById(id)?.name ?? id);
    const created = {
      ...base,
      ...input,
      testNames,
      id: `lo-new-${Date.now()}`,
      orderNumber: `LAB-${Date.now().toString().slice(-6)}`,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.unshift(created);
    return created;
  }

  cancelOrder(input: CancelLabOrderInput) {
    const idx = this.orders.findIndex((o) => o.id === input.orderId);
    if (idx < 0) return null;
    this.orders[idx] = {
      ...this.orders[idx]!,
      status: 'cancelled',
      notes: input.reason ?? this.orders[idx]!.notes,
      updatedAt: new Date().toISOString(),
    };
    return this.orders[idx]!;
  }

  verifyResult(input: VerifyResultInput) {
    const idx = this.reports.findIndex((r) => r.id === input.reportId);
    if (idx < 0) return null;
    this.reports[idx] = {
      ...this.reports[idx]!,
      status: 'verified',
      verifiedBy: input.verifiedBy,
      comments: input.comments ?? this.reports[idx]!.comments,
      updatedAt: new Date().toISOString(),
    };
    return this.reports[idx]!;
  }

  releaseResult(input: ReleaseResultInput) {
    const idx = this.reports.findIndex((r) => r.id === input.reportId);
    if (idx < 0) return null;
    this.reports[idx] = {
      ...this.reports[idx]!,
      status: 'released',
      releasedAt: new Date().toISOString(),
      comments: input.comments ?? this.reports[idx]!.comments,
      updatedAt: new Date().toISOString(),
    };
    return this.reports[idx]!;
  }

  collectSpecimen(input: CollectSpecimenInput) {
    const order = this.getOrder(input.orderId);
    if (!order) return null;
    const existing = this.specimens.find((s) => s.orderId === input.orderId);
    const now = new Date().toISOString();
    if (existing) {
      existing.status = 'collected';
      existing.collectedBy = input.collectedBy;
      existing.collectedAt = now;
      existing.temperature = input.temperature ?? existing.temperature;
      existing.updatedAt = now;
      return existing;
    }
    const test = getTestById(order.testIds[0]!)!;
    const spec = {
      id: `spec-new-${Date.now()}`,
      orderId: order.id,
      patientId: order.patientId,
      barcode: `BC-${order.orderNumber.slice(4)}`,
      qrCode: `QR-${order.id}`,
      specimenType: test.specimenType,
      status: 'collected' as const,
      collectedBy: input.collectedBy,
      collectedAt: now,
      temperature: input.temperature ?? '2–8°C',
      chainOfCustody: [{ id: 'c1', timestamp: now, status: 'collected' as const, actor: input.collectedBy }],
      createdAt: now,
      updatedAt: now,
    };
    this.specimens.unshift(spec);
    const oIdx = this.orders.findIndex((o) => o.id === input.orderId);
    if (oIdx >= 0) {
      this.orders[oIdx] = { ...this.orders[oIdx]!, status: 'collected', collectedAt: now, updatedAt: now };
    }
    return spec;
  }

  search(query: string, patientId?: string) {
    const q = query.toLowerCase();
    const orders = this.getAllOrders(patientId ? { patientId } : undefined).filter((o) =>
      `${o.orderNumber} ${o.testNames.join(' ')}`.toLowerCase().includes(q),
    );
    const results = this.getAllResults(patientId ? { patientId } : undefined).filter((r) =>
      `${r.title} ${r.reportNumber}`.toLowerCase().includes(q),
    );
    return { orders: orders.slice(0, 20), results: results.slice(0, 20) };
  }
}

export const laboratoryRepository = new LaboratoryRepository();
