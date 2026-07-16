import type {
  AddAnnotationInput,
  AddMeasurementInput,
  ApproveReportInput,
  CompleteInterpretationInput,
  CreateRadiologyOrderInput,
  ImageAnnotation,
  ImageExport,
  ImageShare,
  Measurement,
  RadiologyOrder,
  RadiologyStudy,
  StudyFilters,
} from '@/services/radiology/types';
import {
  MOCK_DIAGNOSTIC_REPORTS,
  MOCK_IMAGING_DEVICES,
  MOCK_RADIOLOGISTS,
  MOCK_RADIOLOGY_STUDIES,
  buildComparison,
  buildStudyTimeline,
  generateRadiologyStudy,
} from '@/services/radiology/mock-data';
import { matchesStudyFilters } from '@/services/radiology/studies';

class RadiologyRepository {
  private studies = [...MOCK_RADIOLOGY_STUDIES];
  private reports = [...MOCK_DIAGNOSTIC_REPORTS];
  private annotations: ImageAnnotation[] = [];
  private measurements: Measurement[] = [];
  private favorites = new Set<string>();
  private exports: ImageExport[] = [];
  private shares: ImageShare[] = [];

  listStudies(filters?: StudyFilters) {
    const filtered = this.studies.filter((s) => matchesStudyFilters(s, filters ?? {}));
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 25;
    const start = (page - 1) * pageSize;
    return { items: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize };
  }

  getAllStudies(filters?: StudyFilters) {
    return this.studies.filter((s) => matchesStudyFilters(s, filters ?? {}));
  }

  getStudy(id: string) {
    return this.studies.find((s) => s.id === id) ?? null;
  }

  getReport(id: string) {
    return this.reports.find((r) => r.id === id) ?? null;
  }

  getReportByStudy(studyId: string) {
    return this.reports.find((r) => r.studyId === studyId) ?? null;
  }

  getAllReports(patientId?: string) {
    return patientId ? this.reports.filter((r) => r.patientId === patientId) : this.reports;
  }

  getPendingReports() {
    return this.reports.filter((r) => r.status === 'draft' || r.status === 'preliminary');
  }

  getCriticalReports(patientId?: string) {
    const reports = patientId ? this.reports.filter((r) => r.patientId === patientId) : this.reports;
    return reports.filter((r) => r.isCritical);
  }

  getUnreadReports(patientId?: string) {
    const reports = patientId ? this.reports.filter((r) => r.patientId === patientId) : this.reports;
    return reports.filter((r) => r.isUnread);
  }

  getTimeline(patientId: string) {
    return buildStudyTimeline(patientId);
  }

  getComparison(studyId: string, comparisonStudyId: string) {
    return buildComparison(studyId, comparisonStudyId);
  }

  getRadiologists() {
    return MOCK_RADIOLOGISTS;
  }

  getDevices() {
    return MOCK_IMAGING_DEVICES;
  }

  getAnnotations(studyId: string) {
    return this.annotations.filter((a) => a.studyId === studyId);
  }

  getMeasurements(studyId: string) {
    const fromReports = this.reports.flatMap((r) => r.measurements.filter((m) => m.studyId === studyId));
    return [...fromReports, ...this.measurements.filter((m) => m.studyId === studyId)];
  }

  getFavorites(patientId?: string) {
    const ids = [...this.favorites];
    return this.studies.filter((s) => ids.includes(s.id) && (!patientId || s.patientId === patientId));
  }

  createOrder(input: CreateRadiologyOrderInput): RadiologyOrder {
    const idx = this.studies.length;
    const study = generateRadiologyStudy(idx);
    const created: RadiologyStudy = {
      ...study,
      patientId: input.patientId,
      patientName: input.patientName,
      orderingPhysician: input.orderingPhysician,
      orderingPhysicianId: input.orderingPhysicianId,
      facilityId: input.facilityId,
      facilityName: input.facilityName,
      modality: input.modality,
      bodyPart: input.bodyPart,
      priority: input.priority,
      clinicalIndication: input.clinicalIndication,
      reason: input.reason,
      carePlanId: input.carePlanId,
      appointmentId: input.appointmentId,
      studyDate: input.scheduledAt ?? new Date().toISOString(),
      status: 'scheduled',
      id: `img-new-${Date.now()}`,
      accessionNumber: `ACC-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.studies.unshift(created);
    return {
      id: `ord-${created.id}`,
      studyId: created.id,
      patientId: input.patientId,
      orderingPhysician: input.orderingPhysician,
      clinicalIndication: input.clinicalIndication,
      modality: input.modality,
      bodyPart: input.bodyPart,
      priority: input.priority,
      status: 'scheduled',
      carePlanId: input.carePlanId,
      appointmentId: input.appointmentId,
      scheduledAt: input.scheduledAt,
      createdAt: created.createdAt,
    };
  }

  completeInterpretation(input: CompleteInterpretationInput) {
    const idx = this.reports.findIndex((r) => r.id === input.reportId);
    if (idx < 0) return null;
    this.reports[idx] = {
      ...this.reports[idx]!,
      findings: input.findings,
      impression: input.impression,
      recommendations: input.recommendations ?? this.reports[idx]!.recommendations,
      status: 'preliminary',
      updatedAt: new Date().toISOString(),
    };
    return this.reports[idx]!;
  }

  approveReport(input: ApproveReportInput) {
    const idx = this.reports.findIndex((r) => r.id === input.reportId);
    if (idx < 0) return null;
    this.reports[idx] = {
      ...this.reports[idx]!,
      status: 'final',
      radiologistId: input.radiologistId,
      radiologistName: input.radiologistName,
      signedAt: new Date().toISOString(),
      isUnread: false,
      updatedAt: new Date().toISOString(),
    };
    const sIdx = this.studies.findIndex((s) => s.id === this.reports[idx]!.studyId);
    if (sIdx >= 0) {
      this.studies[sIdx] = { ...this.studies[sIdx]!, status: 'final', updatedAt: new Date().toISOString() };
    }
    return this.reports[idx]!;
  }

  addAnnotation(input: AddAnnotationInput) {
    const annotation: ImageAnnotation = {
      id: `ann-${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.annotations.push(annotation);
    return annotation;
  }

  deleteAnnotation(id: string) {
    const idx = this.annotations.findIndex((a) => a.id === id);
    if (idx < 0) return false;
    this.annotations.splice(idx, 1);
    return true;
  }

  addMeasurement(input: AddMeasurementInput) {
    const measurement: Measurement = {
      id: `meas-${Date.now()}`,
      ...input,
      createdAt: new Date().toISOString(),
    };
    this.measurements.push(measurement);
    return measurement;
  }

  toggleFavorite(studyId: string) {
    if (this.favorites.has(studyId)) {
      this.favorites.delete(studyId);
      return false;
    }
    this.favorites.add(studyId);
    return true;
  }

  shareStudy(studyId: string, sharedWith: string) {
    const share: ImageShare = {
      id: `share-${Date.now()}`,
      studyId,
      sharedWith,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.shares.push(share);
    return share;
  }

  exportStudy(studyId: string, format: ImageExport['format']) {
    const exp: ImageExport = {
      id: `exp-${Date.now()}`,
      studyId,
      format,
      status: 'ready',
      url: `/api/imaging/export/${studyId}.${format}`,
      createdAt: new Date().toISOString(),
    };
    this.exports.push(exp);
    return exp;
  }

  archiveStudy(id: string) {
    const idx = this.studies.findIndex((s) => s.id === id);
    if (idx < 0) return null;
    this.studies[idx] = { ...this.studies[idx]!, status: 'cancelled', updatedAt: new Date().toISOString() };
    return this.studies[idx]!;
  }

  search(query: string, patientId?: string) {
    const q = query.toLowerCase();
    const studies = this.getAllStudies(patientId ? { patientId } : undefined).filter((s) =>
      `${s.accessionNumber} ${s.reason} ${s.modality}`.toLowerCase().includes(q),
    );
    const reports = this.getAllReports(patientId).filter((r) =>
      `${r.title} ${r.accessionNumber}`.toLowerCase().includes(q),
    );
    return { studies: studies.slice(0, 20), reports: reports.slice(0, 20) };
  }
}

export const radiologyRepository = new RadiologyRepository();
