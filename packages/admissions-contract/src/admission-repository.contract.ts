import type {
  Admission,
  AdmissionBoardResult,
  AdmissionFilters,
  AdmissionListResult,
  AssignAdmissionBedInput,
  CompleteTransferInput,
  CreateAdmissionInput,
  CreateTransferInput,
  PatientTransfer,
  TransferFilters,
  TransferListResult,
  TriageAdmissionInput,
} from './admission.types';

export interface AdmissionsRepositoryContract {
  search(filters?: AdmissionFilters): Promise<AdmissionListResult>;
  getAll(filters?: AdmissionFilters): Promise<Admission[]>;
  getById(id: string): Promise<Admission>;
  getBoard(filters?: AdmissionFilters): Promise<AdmissionBoardResult>;
  create(input: CreateAdmissionInput): Promise<Admission>;
  triage(id: string, input?: TriageAdmissionInput): Promise<Admission>;
  assignBed(id: string, input: AssignAdmissionBedInput): Promise<Admission>;
  admit(id: string, notes?: string): Promise<Admission>;
  cancel(id: string, notes?: string): Promise<Admission>;
  discharge(id: string, notes?: string): Promise<Admission>;

  searchTransfers(filters?: TransferFilters): Promise<TransferListResult>;
  getAllTransfers(filters?: TransferFilters): Promise<PatientTransfer[]>;
  getTransfer(id: string): Promise<PatientTransfer>;
  createTransfer(input: CreateTransferInput): Promise<PatientTransfer>;
  approveTransfer(id: string, notes?: string): Promise<PatientTransfer>;
  startTransfer(id: string, notes?: string): Promise<PatientTransfer>;
  completeTransfer(
    id: string,
    input?: CompleteTransferInput,
  ): Promise<PatientTransfer>;
  cancelTransfer(id: string, notes?: string): Promise<PatientTransfer>;
}
