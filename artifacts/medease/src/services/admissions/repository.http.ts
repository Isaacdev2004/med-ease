import { httpTransport } from '@workspace/repository-transport';
import type {
  AdmissionFilters,
  AdmissionsRepositoryContract,
  AssignAdmissionBedInput,
  CompleteTransferInput,
  CreateAdmissionInput,
  CreateTransferInput,
  TransferFilters,
  TriageAdmissionInput,
} from '@medease/admissions-contract';

import {
  admissionFiltersToQuery,
  mapAdmission,
  mapAdmissionArray,
  mapAdmissionBoard,
  mapPaginatedAdmissions,
  mapPaginatedTransfers,
  mapTransfer,
  mapTransferArray,
  transferFiltersToQuery,
} from '@/services/admissions/dto-mappers';

const ADMISSIONS = '/api/admissions';
const TRANSFERS = '/api/transfers';

class AdmissionsHttpRepository implements AdmissionsRepositoryContract {
  private readonly transport = httpTransport;

  async search(filters?: AdmissionFilters) {
    return mapPaginatedAdmissions(
      await this.transport.get(ADMISSIONS, {
        query: admissionFiltersToQuery(filters),
      }),
    );
  }

  async getAll(filters?: AdmissionFilters) {
    return mapAdmissionArray(
      await this.transport.get(`${ADMISSIONS}/all`, {
        query: admissionFiltersToQuery(filters),
      }),
    );
  }

  async getById(id: string) {
    return mapAdmission(await this.transport.get(`${ADMISSIONS}/${id}`));
  }

  async getBoard(filters?: AdmissionFilters) {
    return mapAdmissionBoard(
      await this.transport.get(`${ADMISSIONS}/board`, {
        query: admissionFiltersToQuery(filters),
      }),
    );
  }

  async create(input: CreateAdmissionInput) {
    return mapAdmission(
      await this.transport.post(ADMISSIONS, { body: input }),
    );
  }

  async triage(id: string, input: TriageAdmissionInput = {}) {
    return mapAdmission(
      await this.transport.post(`${ADMISSIONS}/${id}/triage`, { body: input }),
    );
  }

  async assignBed(id: string, input: AssignAdmissionBedInput) {
    return mapAdmission(
      await this.transport.post(`${ADMISSIONS}/${id}/assign-bed`, {
        body: input,
      }),
    );
  }

  async admit(id: string, notes?: string) {
    return mapAdmission(
      await this.transport.post(`${ADMISSIONS}/${id}/admit`, {
        body: { notes },
      }),
    );
  }

  async cancel(id: string, notes?: string) {
    return mapAdmission(
      await this.transport.post(`${ADMISSIONS}/${id}/cancel`, {
        body: { notes },
      }),
    );
  }

  async discharge(id: string, notes?: string) {
    return mapAdmission(
      await this.transport.post(`${ADMISSIONS}/${id}/discharge`, {
        body: { notes },
      }),
    );
  }

  async searchTransfers(filters?: TransferFilters) {
    return mapPaginatedTransfers(
      await this.transport.get(TRANSFERS, {
        query: transferFiltersToQuery(filters),
      }),
    );
  }

  async getAllTransfers(filters?: TransferFilters) {
    return mapTransferArray(
      await this.transport.get(`${TRANSFERS}/all`, {
        query: transferFiltersToQuery(filters),
      }),
    );
  }

  async getTransfer(id: string) {
    return mapTransfer(await this.transport.get(`${TRANSFERS}/${id}`));
  }

  async createTransfer(input: CreateTransferInput) {
    return mapTransfer(await this.transport.post(TRANSFERS, { body: input }));
  }

  async approveTransfer(id: string, notes?: string) {
    return mapTransfer(
      await this.transport.post(`${TRANSFERS}/${id}/approve`, {
        body: { notes },
      }),
    );
  }

  async startTransfer(id: string, notes?: string) {
    return mapTransfer(
      await this.transport.post(`${TRANSFERS}/${id}/start`, {
        body: { notes },
      }),
    );
  }

  async completeTransfer(id: string, input: CompleteTransferInput = {}) {
    return mapTransfer(
      await this.transport.post(`${TRANSFERS}/${id}/complete`, {
        body: input,
      }),
    );
  }

  async cancelTransfer(id: string, notes?: string) {
    return mapTransfer(
      await this.transport.post(`${TRANSFERS}/${id}/cancel`, {
        body: { notes },
      }),
    );
  }
}

export const admissionsHttpRepository = new AdmissionsHttpRepository();
