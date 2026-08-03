import type {
  AssignBedInput,
  Bed,
  BedAssignment,
  BedBoardResult,
  BedFilters,
  BedListResult,
  CreateBedInput,
  ReserveBedInput,
  UpdateBedStatusInput,
} from './bed.types';

export interface BedsRepositoryContract {
  search(filters?: BedFilters): Promise<BedListResult>;
  getAll(filters?: BedFilters): Promise<Bed[]>;
  getById(id: string): Promise<Bed>;
  getBoard(filters?: BedFilters): Promise<BedBoardResult>;
  create(input: CreateBedInput): Promise<Bed>;
  assign(bedId: string, input: AssignBedInput): Promise<Bed>;
  release(bedId: string, notes?: string): Promise<Bed>;
  reserve(bedId: string, input?: ReserveBedInput): Promise<Bed>;
  updateStatus(bedId: string, input: UpdateBedStatusInput): Promise<Bed>;
  getAssignments(bedId: string): Promise<BedAssignment[]>;
}
