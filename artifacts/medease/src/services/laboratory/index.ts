export { laboratoryService } from '@/services/laboratory/laboratory.service';
export { laboratoryOfflineQueue } from '@/services/laboratory/offline-sync';
export {
  LAB_TEST_CATALOG,
  computeResultFlag,
  getReferenceRange,
} from '@/services/laboratory/reference-ranges';
export {
  categorizeOrders,
  sortOrdersByDate,
} from '@/services/laboratory/orders';
export {
  getCriticalObservations,
  flagSeverity,
} from '@/services/laboratory/results';
export { alertSeverityColor } from '@/services/laboratory/alerts';
export {
  toFhirServiceRequest,
  toFhirDiagnosticReport,
  toFhirObservation,
} from '@/services/laboratory/mapper';
export { laboratoryRepository } from '@/services/laboratory/repository';
export {
  MOCK_LAB_ORDERS,
  MOCK_LAB_REPORTS,
  MOCK_LAB_OBSERVATIONS,
  MOCK_SPECIMENS,
  MOCK_LAB_ALERTS,
  MOCK_MICROBIOLOGY,
  MOCK_PATHOLOGY,
  MOCK_BLOOD_BANK,
  MOCK_INSTRUMENTS,
  MOCK_TECHNOLOGISTS,
  MOCK_QUALITY_CONTROL,
  buildDashboard,
  buildTrends,
  buildAnalytics,
  buildLabTimeline,
  buildQualityDashboard,
  generateLabOrder,
} from '@/services/laboratory/mock-data';
export type {
  LabOrder,
  LabObservation,
  LabDiagnosticReport,
  SpecimenRecord,
  LabAlert,
  LabTimelineEntry,
  LaboratoryDashboard,
  LabTrendSeries,
  LaboratoryAnalytics,
  LabOrderFilters,
  LabResultFilters,
  LabTestDefinition,
  CreateLabOrderInput,
  CancelLabOrderInput,
  VerifyResultInput,
  ReleaseResultInput,
  ApproveResultInput,
  UploadResultInput,
  ExportResultInput,
  ShareResultInput,
  CollectSpecimenInput,
  MicrobiologyResult,
  PathologyResult,
  BloodBankRecord,
  QualityDashboard,
  LaboratoryInstrument,
  Technologist,
  LabCategory,
  LabOrderStatus,
  LabResultStatus,
  ResultFlag,
} from '@/services/laboratory/types';
export { AUTH_USER_PATIENT_MAP } from '@/services/laboratory/types';
