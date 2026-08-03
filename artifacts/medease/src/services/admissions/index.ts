import { admissionsRepository } from '@/services/admissions/repository';
import type {
  AdmissionFilters,
  AssignAdmissionBedInput,
  CompleteTransferInput,
  CreateAdmissionInput,
  CreateTransferInput,
  TransferFilters,
  TriageAdmissionInput,
} from '@/services/admissions/types';

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const admissionsService = {
  async getBoard(filters?: AdmissionFilters) {
    await delay();
    return admissionsRepository.getBoard(filters);
  },
  async list(filters?: AdmissionFilters) {
    await delay();
    return admissionsRepository.getAll(filters);
  },
  async triage(id: string, input?: TriageAdmissionInput) {
    await delay(200);
    return admissionsRepository.triage(id, input);
  },
  async assignBed(id: string, input: AssignAdmissionBedInput) {
    await delay(250);
    return admissionsRepository.assignBed(id, input);
  },
  async admit(id: string, notes?: string) {
    await delay(250);
    return admissionsRepository.admit(id, notes);
  },
  async create(input: CreateAdmissionInput) {
    await delay(250);
    return admissionsRepository.create(input);
  },
  async listTransfers(filters?: TransferFilters) {
    await delay();
    return admissionsRepository.getAllTransfers(filters);
  },
  async completeTransfer(id: string, input?: CompleteTransferInput) {
    await delay(250);
    return admissionsRepository.completeTransfer(id, input);
  },
  async cancelTransfer(id: string, notes?: string) {
    await delay(200);
    return admissionsRepository.cancelTransfer(id, notes);
  },
  async startTransfer(id: string, notes?: string) {
    await delay(200);
    return admissionsRepository.startTransfer(id, notes);
  },
  async createTransfer(input: CreateTransferInput) {
    await delay(250);
    return admissionsRepository.createTransfer(input);
  },
};
