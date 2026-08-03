export type {
  Admission,
  AdmissionBoardResult,
  AdmissionBoardSummary,
  AdmissionFilters,
  AdmissionListResult,
  AdmissionPriority,
  AdmissionStatus,
  AssignAdmissionBedInput,
  CompleteTransferInput,
  CreateAdmissionInput,
  CreateTransferInput,
  PatientTransfer,
  TransferFilters,
  TransferListResult,
  TransferStatus,
  TriageAdmissionInput,
} from '@medease/admissions-contract';

import type {
  Admission,
  AdmissionStatus,
  PatientTransfer,
  TransferStatus,
} from '@medease/admissions-contract';

export const DEMO_FACILITY_PARIS = '01930000-0000-7000-8000-000000000201';

export function toAdmissionRow(admission: Admission) {
  const uiStatus =
    admission.status === 'admitted'
      ? 'admitted'
      : admission.status === 'discharged'
        ? 'discharged'
        : 'pending';

  return {
    id: admission.id,
    patient: admission.patientName,
    mrn: admission.patientMrn,
    ward: admission.ward,
    admittedAt: (admission.admittedAt ?? admission.requestedAt).slice(0, 16).replace('T', ' '),
    status: uiStatus as 'pending' | 'admitted' | 'discharged',
    priority: (admission.priority === 'emergency'
      ? 'urgent'
      : admission.priority === 'urgent'
        ? 'urgent'
        : 'routine') as 'routine' | 'urgent',
    apiStatus: admission.status as AdmissionStatus,
    bedId: admission.bedId,
  };
}

export function toTransferRow(transfer: PatientTransfer) {
  const uiStatus =
    transfer.status === 'in_transit'
      ? 'in-transit'
      : transfer.status === 'completed'
        ? 'completed'
        : transfer.status === 'cancelled'
          ? 'cancelled'
          : 'requested';

  return {
    id: transfer.id,
    patient: transfer.patientName,
    fromWard: transfer.fromWard,
    toWard: transfer.toWard,
    requestedAt: transfer.requestedAt.slice(0, 16).replace('T', ' '),
    status: uiStatus as 'requested' | 'in-transit' | 'completed' | 'cancelled',
    apiStatus: transfer.status as TransferStatus,
  };
}
