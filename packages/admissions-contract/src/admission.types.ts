export type AdmissionStatus =
  | 'requested'
  | 'triaged'
  | 'bed_assigned'
  | 'admitted'
  | 'cancelled'
  | 'discharged';

export type AdmissionPriority = 'routine' | 'urgent' | 'emergency';

export type TransferStatus =
  | 'requested'
  | 'approved'
  | 'in_transit'
  | 'completed'
  | 'cancelled';

export interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  facilityId: string;
  facilityName: string;
  ward: string;
  bedId?: string;
  bedLabel?: string;
  status: AdmissionStatus;
  priority: AdmissionPriority;
  reason?: string;
  requestedAt: string;
  triagedAt?: string;
  admittedAt?: string;
  dischargedAt?: string;
  cancelledAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientTransfer {
  id: string;
  admissionId?: string;
  patientId: string;
  patientName: string;
  fromFacilityId: string;
  fromFacilityName: string;
  fromWard: string;
  fromBedId?: string;
  toFacilityId: string;
  toFacilityName: string;
  toWard: string;
  toBedId?: string;
  toBedLabel?: string;
  status: TransferStatus;
  reason?: string;
  requestedAt: string;
  approvedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionFilters {
  facilityId?: string;
  patientId?: string;
  status?: AdmissionStatus;
  priority?: AdmissionPriority;
  ward?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface TransferFilters {
  patientId?: string;
  status?: TransferStatus;
  fromFacilityId?: string;
  toFacilityId?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface AdmissionListResult {
  items: Admission[];
  total: number;
  page: number;
  pageSize: number;
}

export interface TransferListResult {
  items: PatientTransfer[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdmissionBoardSummary {
  facilityId?: string;
  total: number;
  pending: number;
  admitted: number;
  discharged: number;
  cancelled: number;
  urgent: number;
}

export interface AdmissionBoardResult {
  summary: AdmissionBoardSummary;
  admissions: Admission[];
}

export interface CreateAdmissionInput {
  patientId: string;
  facilityId: string;
  facilityName: string;
  ward: string;
  priority?: AdmissionPriority;
  reason?: string;
  notes?: string;
}

export interface TriageAdmissionInput {
  priority?: AdmissionPriority;
  ward?: string;
  notes?: string;
}

export interface AssignAdmissionBedInput {
  bedId: string;
  notes?: string;
}

export interface CreateTransferInput {
  patientId: string;
  admissionId?: string;
  fromFacilityId: string;
  fromFacilityName: string;
  fromWard: string;
  fromBedId?: string;
  toFacilityId: string;
  toFacilityName: string;
  toWard: string;
  toBedId?: string;
  reason?: string;
  notes?: string;
}

export interface CompleteTransferInput {
  toBedId?: string;
  notes?: string;
}
