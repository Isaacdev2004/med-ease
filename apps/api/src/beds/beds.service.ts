import { Injectable } from '@nestjs/common';

import type {
  AssignBedInput,
  BedFilters,
  CreateBedInput,
  ReserveBedInput,
  UpdateBedStatusInput,
} from '@medease/beds-contract';

import { BedsRepository } from './beds.repository';

@Injectable()
export class BedsService {
  constructor(private readonly repository: BedsRepository) {}

  search(filters?: BedFilters) {
    return this.repository.search(filters);
  }

  getAll(filters?: BedFilters) {
    return this.repository.getAll(filters);
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  getBoard(filters?: BedFilters) {
    return this.repository.getBoard(filters);
  }

  create(input: CreateBedInput) {
    return this.repository.create(input);
  }

  assign(bedId: string, input: AssignBedInput) {
    return this.repository.assign(bedId, input);
  }

  release(bedId: string, notes?: string) {
    return this.repository.release(bedId, notes);
  }

  reserve(bedId: string, input?: ReserveBedInput) {
    return this.repository.reserve(bedId, input);
  }

  updateStatus(bedId: string, input: UpdateBedStatusInput) {
    return this.repository.updateStatus(bedId, input);
  }

  getAssignments(bedId: string) {
    return this.repository.getAssignments(bedId);
  }
}
