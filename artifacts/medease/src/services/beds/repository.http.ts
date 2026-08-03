import { httpTransport } from '@workspace/repository-transport';
import type {
  AssignBedInput,
  BedFilters,
  BedsRepositoryContract,
  CreateBedInput,
  ReserveBedInput,
  UpdateBedStatusInput,
} from '@medease/beds-contract';

import {
  filtersToQuery,
  mapArray,
  mapAssignments,
  mapBed,
  mapBoard,
  mapPaginated,
} from '@/services/beds/dto-mappers';

const BASE = '/api/beds';

class BedsHttpRepository implements BedsRepositoryContract {
  private readonly transport = httpTransport;

  async search(filters?: BedFilters) {
    const dto = await this.transport.get(BASE, {
      query: filtersToQuery(filters),
    });
    return mapPaginated(dto);
  }

  async getAll(filters?: BedFilters) {
    const dto = await this.transport.get(`${BASE}/all`, {
      query: filtersToQuery(filters),
    });
    return mapArray(dto);
  }

  async getById(id: string) {
    const dto = await this.transport.get(`${BASE}/${id}`);
    return mapBed(dto);
  }

  async getBoard(filters?: BedFilters) {
    const dto = await this.transport.get(`${BASE}/board`, {
      query: filtersToQuery(filters),
    });
    return mapBoard(dto);
  }

  async create(input: CreateBedInput) {
    const dto = await this.transport.post(BASE, { body: input });
    return mapBed(dto);
  }

  async assign(bedId: string, input: AssignBedInput) {
    const dto = await this.transport.post(`${BASE}/${bedId}/assign`, {
      body: input,
    });
    return mapBed(dto);
  }

  async release(bedId: string, notes?: string) {
    const dto = await this.transport.post(`${BASE}/${bedId}/release`, {
      body: { notes },
    });
    return mapBed(dto);
  }

  async reserve(bedId: string, input: ReserveBedInput = {}) {
    const dto = await this.transport.post(`${BASE}/${bedId}/reserve`, {
      body: input,
    });
    return mapBed(dto);
  }

  async updateStatus(bedId: string, input: UpdateBedStatusInput) {
    const dto = await this.transport.post(`${BASE}/${bedId}/status`, {
      body: input,
    });
    return mapBed(dto);
  }

  async getAssignments(bedId: string) {
    const dto = await this.transport.get(`${BASE}/${bedId}/assignments`);
    return mapAssignments(dto);
  }
}

export const bedsHttpRepository = new BedsHttpRepository();
