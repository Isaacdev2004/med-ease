import type {
  ApproveReportInput,
  CancelRadiologyOrderInput,
  CompleteAcquisitionInput,
  CompleteInterpretationInput,
  CreateRadiologyOrderInput,
  DiagnosticReport,
  ImagingDevice,
  Radiologist,
  RadiologyOrder,
  RadiologyStudy,
  ReportFilters,
  ReportListResult,
  StudyFilters,
  StudyListResult,
} from './radiology.types';

export interface RadiologyRepositoryContract {
  searchStudies(filters?: StudyFilters): Promise<StudyListResult>;
  getAllStudies(filters?: StudyFilters): Promise<RadiologyStudy[]>;
  getStudy(id: string): Promise<RadiologyStudy>;

  createOrder(input: CreateRadiologyOrderInput): Promise<RadiologyOrder>;
  cancelOrder(input: CancelRadiologyOrderInput): Promise<RadiologyOrder>;
  completeAcquisition(
    input: CompleteAcquisitionInput,
  ): Promise<RadiologyStudy>;

  searchReports(filters?: ReportFilters): Promise<ReportListResult>;
  getAllReports(filters?: ReportFilters): Promise<DiagnosticReport[]>;
  getReport(id: string): Promise<DiagnosticReport>;
  getReportByStudy(studyId: string): Promise<DiagnosticReport>;
  getPendingReports(patientId?: string): Promise<DiagnosticReport[]>;
  getCriticalReports(patientId?: string): Promise<DiagnosticReport[]>;

  completeInterpretation(
    input: CompleteInterpretationInput,
  ): Promise<DiagnosticReport>;
  approveReport(input: ApproveReportInput): Promise<DiagnosticReport>;
  archiveStudy(id: string): Promise<RadiologyStudy>;

  getDevices(facilityId?: string): Promise<ImagingDevice[]>;
  getRadiologists(): Promise<Radiologist[]>;
}
