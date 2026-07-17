import { buildAnalytics } from '@/services/radiology/analytics';
import {
  buildDashboard,
  getPatientIdForUser,
} from '@/services/radiology/mock-data';
import { radiologyRepository } from '@/services/radiology/repository';
import { sortStudiesByDate } from '@/services/radiology/studies';
import { createDefaultViewerState } from '@/services/radiology/viewer';
import type {
  AddAnnotationInput,
  AddMeasurementInput,
  ApproveReportInput,
  CompleteInterpretationInput,
  CreateRadiologyOrderInput,
  StudyFilters,
  StudyPermissions,
} from '@/services/radiology/types';

const DELAY = 250;

async function delay() {
  await new Promise((r) => setTimeout(r, DELAY));
}

export const radiologyService = {
  async resolvePatientId(userId: string) {
    await delay();
    return getPatientIdForUser(userId);
  },

  async getDashboard(patientId?: string) {
    await delay();
    return buildDashboard(patientId);
  },

  async searchStudies(filters?: StudyFilters) {
    await delay();
    return radiologyRepository.listStudies(filters);
  },

  async getAllStudies(filters?: StudyFilters) {
    await delay();
    return sortStudiesByDate(radiologyRepository.getAllStudies(filters));
  },

  async getStudy(id: string) {
    await delay();
    return radiologyRepository.getStudy(id);
  },

  async getReport(id: string) {
    await delay();
    return radiologyRepository.getReport(id);
  },

  async getReportByStudy(studyId: string) {
    await delay();
    return radiologyRepository.getReportByStudy(studyId);
  },

  async getPatientImaging(patientId: string) {
    await delay();
    const studies = sortStudiesByDate(
      radiologyRepository.getAllStudies({ patientId }),
    );
    const reports = radiologyRepository.getAllReports(patientId);
    return { studies, reports, critical: reports.filter((r) => r.isCritical) };
  },

  async getTimeline(patientId: string) {
    await delay();
    return radiologyRepository.getTimeline(patientId);
  },

  async getCriticalResults(patientId?: string) {
    await delay();
    return radiologyRepository.getCriticalReports(patientId);
  },

  async getPendingReports() {
    await delay();
    return radiologyRepository.getPendingReports();
  },

  async getUnreadReports(patientId?: string) {
    await delay();
    return radiologyRepository.getUnreadReports(patientId);
  },

  async getRadiologistDashboard(radiologistId?: string) {
    await delay();
    const studies = radiologyRepository.getAllStudies(
      radiologistId ? { radiologistId } : undefined,
    );
    return {
      activeStudies: studies.filter(
        (s) => s.status === 'pending_interpretation',
      ).length,
      pendingReports: radiologyRepository.getPendingReports().length,
      critical: radiologyRepository.getCriticalReports().length,
      studies: studies.slice(0, 10),
    };
  },

  async getFacilityImaging(facilityId?: string) {
    await delay();
    const studies = radiologyRepository.getAllStudies(
      facilityId ? { facilityId } : undefined,
    );
    return {
      studiesToday: studies.filter((_, i) => i % 40 === 0).length || 6,
      devices: radiologyRepository.getDevices(),
      pending: radiologyRepository.getPendingReports().length,
      studies: studies.slice(0, 12),
    };
  },

  async compareStudies(studyId: string, comparisonStudyId: string) {
    await delay();
    return radiologyRepository.getComparison(studyId, comparisonStudyId);
  },

  async getAnalytics() {
    await delay();
    return buildAnalytics();
  },

  async getImageViewerState(studyId: string) {
    await delay();
    const study = radiologyRepository.getStudy(studyId);
    if (!study) return null;
    return createDefaultViewerState(study);
  },

  async getAnnotations(studyId: string) {
    await delay();
    return radiologyRepository.getAnnotations(studyId);
  },

  async getMeasurements(studyId: string) {
    await delay();
    return radiologyRepository.getMeasurements(studyId);
  },

  async getFavorites(patientId?: string) {
    await delay();
    return radiologyRepository.getFavorites(patientId);
  },

  async getDevices() {
    await delay();
    return radiologyRepository.getDevices();
  },

  async getRadiologists() {
    await delay();
    return radiologyRepository.getRadiologists();
  },

  async createOrder(input: CreateRadiologyOrderInput) {
    await delay();
    return radiologyRepository.createOrder(input);
  },

  async completeInterpretation(input: CompleteInterpretationInput) {
    await delay();
    return radiologyRepository.completeInterpretation(input);
  },

  async approveReport(input: ApproveReportInput) {
    await delay();
    return radiologyRepository.approveReport(input);
  },

  async addAnnotation(input: AddAnnotationInput) {
    await delay();
    return radiologyRepository.addAnnotation(input);
  },

  async deleteAnnotation(id: string) {
    await delay();
    return radiologyRepository.deleteAnnotation(id);
  },

  async addMeasurement(input: AddMeasurementInput) {
    await delay();
    return radiologyRepository.addMeasurement(input);
  },

  async toggleFavorite(studyId: string) {
    await delay();
    return radiologyRepository.toggleFavorite(studyId);
  },

  async shareStudy(studyId: string, sharedWith: string) {
    await delay();
    return radiologyRepository.shareStudy(studyId, sharedWith);
  },

  async exportStudy(studyId: string, format: 'png' | 'jpeg' | 'pdf' | 'dicom') {
    await delay();
    return radiologyRepository.exportStudy(studyId, format);
  },

  async archiveStudy(id: string) {
    await delay();
    return radiologyRepository.archiveStudy(id);
  },

  async search(query: string, patientId?: string) {
    await delay();
    return radiologyRepository.search(query, patientId);
  },

  async getStudyPermissions(studyId: string): Promise<StudyPermissions> {
    await delay();
    void studyId;
    return {
      canView: true,
      canAnnotate: true,
      canMeasure: true,
      canExport: true,
      canShare: true,
      canReport: true,
    };
  },
};
