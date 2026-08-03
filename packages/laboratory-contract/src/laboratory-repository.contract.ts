import type {
  ApproveResultInput,
  CancelLabOrderInput,
  CollectSpecimenInput,
  CreateLabOrderInput,
  LabDiagnosticReport,
  LabOrder,
  LabOrderFilters,
  LabOrderListResult,
  LabResultDetail,
  LabResultFilters,
  LabResultListResult,
  LabTestDefinition,
  ReleaseResultInput,
  SpecimenRecord,
  UploadResultInput,
  VerifyResultInput,
} from './laboratory.types';

export interface LaboratoryRepositoryContract {
  searchOrders(filters?: LabOrderFilters): Promise<LabOrderListResult>;
  getAllOrders(filters?: LabOrderFilters): Promise<LabOrder[]>;
  getOrder(id: string): Promise<LabOrder>;
  createOrder(input: CreateLabOrderInput): Promise<LabOrder>;
  cancelOrder(input: CancelLabOrderInput): Promise<LabOrder>;
  collectSpecimen(input: CollectSpecimenInput): Promise<SpecimenRecord>;

  searchResults(filters?: LabResultFilters): Promise<LabResultListResult>;
  getAllResults(filters?: LabResultFilters): Promise<LabDiagnosticReport[]>;
  getResult(id: string): Promise<LabResultDetail>;
  getPendingResults(patientId?: string): Promise<LabDiagnosticReport[]>;
  uploadResult(input: UploadResultInput): Promise<LabResultDetail>;
  verifyResult(input: VerifyResultInput): Promise<LabDiagnosticReport>;
  approveResult(input: ApproveResultInput): Promise<LabDiagnosticReport>;
  releaseResult(input: ReleaseResultInput): Promise<LabDiagnosticReport>;

  getSpecimens(orderId?: string, patientId?: string): Promise<SpecimenRecord[]>;
  getCatalog(): Promise<LabTestDefinition[]>;
}
