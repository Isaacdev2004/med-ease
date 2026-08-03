import { Injectable } from '@nestjs/common';

import type {
  AdmissionFilters,
  AssignAdmissionBedInput,
  CompleteTransferInput,
  CreateAdmissionInput,
  CreateTransferInput,
  TransferFilters,
  TriageAdmissionInput,
} from '@medease/admissions-contract';

import { AdmissionsRepository } from './admissions.repository';

@Injectable()
export class AdmissionsService {
  constructor(private readonly repository: AdmissionsRepository) {}

  search(filters?: AdmissionFilters) {
    return this.repository.search(filters);
  }

  getAll(filters?: AdmissionFilters) {
    return this.repository.getAll(filters);
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  getBoard(filters?: AdmissionFilters) {
    return this.repository.getBoard(filters);
  }

  create(input: CreateAdmissionInput) {
    return this.repository.create(input);
  }

  triage(id: string, input?: TriageAdmissionInput) {
    return this.repository.triage(id, input);
  }

  assignBed(id: string, input: AssignAdmissionBedInput) {
    return this.repository.assignBed(id, input);
  }

  admit(id: string, notes?: string) {
    return this.repository.admit(id, notes);
  }

  cancel(id: string, notes?: string) {
    return this.repository.cancel(id, notes);
  }

  discharge(id: string, notes?: string) {
    return this.repository.discharge(id, notes);
  }

  searchTransfers(filters?: TransferFilters) {
    return this.repository.searchTransfers(filters);
  }

  getAllTransfers(filters?: TransferFilters) {
    return this.repository.getAllTransfers(filters);
  }

  getTransfer(id: string) {
    return this.repository.getTransfer(id);
  }

  createTransfer(input: CreateTransferInput) {
    return this.repository.createTransfer(input);
  }

  approveTransfer(id: string, notes?: string) {
    return this.repository.approveTransfer(id, notes);
  }

  startTransfer(id: string, notes?: string) {
    return this.repository.startTransfer(id, notes);
  }

  completeTransfer(id: string, input?: CompleteTransferInput) {
    return this.repository.completeTransfer(id, input);
  }

  cancelTransfer(id: string, notes?: string) {
    return this.repository.cancelTransfer(id, notes);
  }
}
