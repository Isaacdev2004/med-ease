export type BedStatus =
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'cleaning'
  | 'maintenance'
  | 'blocked';

export type BedAssignmentStatus = 'assigned' | 'released' | 'transferred';

export interface Bed {
  id: string;
  facilityId: string;
  facilityName: string;
  label: string;
  ward: string;
  roomLabel: string;
  bedType: string;
  status: BedStatus;
  patientId?: string;
  patientName?: string;
  reservedUntil?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BedAssignment {
  id: string;
  bedId: string;
  patientId: string;
  patientName: string;
  status: BedAssignmentStatus;
  assignedAt: string;
  releasedAt?: string;
  notes?: string;
}

export interface BedFilters {
  facilityId?: string;
  ward?: string;
  status?: BedStatus;
  patientId?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface BedListResult {
  items: Bed[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BedBoardSummary {
  facilityId?: string;
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  cleaning: number;
  maintenance: number;
  blocked: number;
  occupancyPercent: number;
}

export interface BedBoardResult {
  summary: BedBoardSummary;
  beds: Bed[];
}

export interface CreateBedInput {
  facilityId: string;
  facilityName: string;
  label: string;
  ward: string;
  roomLabel: string;
  bedType?: string;
  notes?: string;
}

export interface AssignBedInput {
  patientId: string;
  patientName?: string;
  notes?: string;
}

export interface ReserveBedInput {
  reservedUntil?: string;
  notes?: string;
}

export interface UpdateBedStatusInput {
  status: Exclude<BedStatus, 'occupied'>;
  notes?: string;
}
