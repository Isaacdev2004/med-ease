import { bedsRepository } from '@/services/beds/repository';
import type {
  AssignBedInput,
  BedFilters,
  CreateBedInput,
  ReserveBedInput,
  UpdateBedStatusInput,
} from '@/services/beds/types';

const DELAY = 200;
const delay = (ms = DELAY) => new Promise((r) => setTimeout(r, ms));

export const bedsService = {
  async search(filters?: BedFilters) {
    await delay();
    return bedsRepository.search(filters);
  },

  async list(filters?: BedFilters) {
    await delay();
    return bedsRepository.getAll(filters);
  },

  async getById(id: string) {
    await delay(100);
    return bedsRepository.getById(id);
  },

  async getBoard(filters?: BedFilters) {
    await delay();
    return bedsRepository.getBoard(filters);
  },

  async create(input: CreateBedInput) {
    await delay(250);
    return bedsRepository.create(input);
  },

  async assign(bedId: string, input: AssignBedInput) {
    await delay(250);
    return bedsRepository.assign(bedId, input);
  },

  async release(bedId: string, notes?: string) {
    await delay(200);
    return bedsRepository.release(bedId, notes);
  },

  async reserve(bedId: string, input?: ReserveBedInput) {
    await delay(200);
    return bedsRepository.reserve(bedId, input);
  },

  async updateStatus(bedId: string, input: UpdateBedStatusInput) {
    await delay(200);
    return bedsRepository.updateStatus(bedId, input);
  },

  async getAssignments(bedId: string) {
    await delay();
    return bedsRepository.getAssignments(bedId);
  },
};
