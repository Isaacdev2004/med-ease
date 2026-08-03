import type {
  AssignBedInput,
  Bed,
  BedBoardResult,
  BedFilters,
  BedsRepositoryContract,
  CreateBedInput,
  ReserveBedInput,
  UpdateBedStatusInput,
} from '@medease/beds-contract';

import { DEMO_FACILITY_PARIS } from '@/services/beds/types';

const DEMO_PATIENT = '01930000-0000-7000-8000-000000000301';

function nowIso() {
  return new Date().toISOString();
}

function seedBeds(): Bed[] {
  const base = [
    {
      label: 'ICU-3-01',
      ward: 'ICU-3',
      roomLabel: 'ICU-3',
      bedType: 'Critical care',
      status: 'occupied' as const,
      patientId: DEMO_PATIENT,
      patientName: 'Sarah Jenkins',
    },
    {
      label: 'ICU-3-02',
      ward: 'ICU-3',
      roomLabel: 'ICU-3',
      bedType: 'Critical care',
      status: 'available' as const,
    },
    {
      label: 'MS2B-14',
      ward: 'Med-Surg 2B',
      roomLabel: '2B-14',
      bedType: 'Standard',
      status: 'occupied' as const,
      patientName: 'James Wilson',
      patientId: '01930000-0000-7000-8000-000000000302',
    },
    {
      label: 'MS2B-15',
      ward: 'Med-Surg 2B',
      roomLabel: '2B-15',
      bedType: 'Standard',
      status: 'cleaning' as const,
    },
    {
      label: 'PED-08',
      ward: 'Pediatrics',
      roomLabel: 'PED-08',
      bedType: 'Pediatric',
      status: 'reserved' as const,
    },
    {
      label: 'MAT-03',
      ward: 'Maternity',
      roomLabel: 'MAT-03',
      bedType: 'Maternity',
      status: 'available' as const,
    },
    {
      label: 'SUR-11',
      ward: 'Surgical',
      roomLabel: 'SUR-11',
      bedType: 'Surgical',
      status: 'maintenance' as const,
    },
    {
      label: 'ER-04',
      ward: 'Emergency',
      roomLabel: 'ER-04',
      bedType: 'Emergency',
      status: 'available' as const,
    },
  ];

  return base.map((row, index) => ({
    id: `01930000-0000-7000-8000-0000000009${String(index + 1).padStart(2, '0')}`,
    facilityId: DEMO_FACILITY_PARIS,
    facilityName: 'Pitié-Salpêtrière',
    label: row.label,
    ward: row.ward,
    roomLabel: row.roomLabel,
    bedType: row.bedType,
    status: row.status,
    patientId: row.patientId,
    patientName: row.patientName,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }));
}

function matches(bed: Bed, filters: BedFilters = {}) {
  if (filters.facilityId && bed.facilityId !== filters.facilityId) return false;
  if (filters.ward && !bed.ward.toLowerCase().includes(filters.ward.toLowerCase()))
    return false;
  if (filters.status && bed.status !== filters.status) return false;
  if (filters.patientId && bed.patientId !== filters.patientId) return false;
  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (
      !`${bed.label} ${bed.ward} ${bed.roomLabel} ${bed.patientName ?? ''} ${bed.facilityName}`
        .toLowerCase()
        .includes(q)
    ) {
      return false;
    }
  }
  return true;
}

class BedsMockRepository implements BedsRepositoryContract {
  private beds: Bed[] = seedBeds();
  private assignments: Array<{
    id: string;
    bedId: string;
    patientId: string;
    patientName: string;
    status: 'assigned' | 'released' | 'transferred';
    assignedAt: string;
    releasedAt?: string;
    notes?: string;
  }> = [];

  async search(filters: BedFilters = {}) {
    const filtered = this.beds.filter((b) => matches(b, filters));
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 25;
    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }

  async getAll(filters: BedFilters = {}) {
    return this.beds.filter((b) => matches(b, filters));
  }

  async getById(id: string) {
    const bed = this.beds.find((b) => b.id === id);
    if (!bed) throw new Error('Bed not found');
    return bed;
  }

  async getBoard(filters: BedFilters = {}): Promise<BedBoardResult> {
    const beds = await this.getAll(filters);
    const summary = {
      facilityId: filters.facilityId,
      total: beds.length,
      available: beds.filter((b) => b.status === 'available').length,
      occupied: beds.filter((b) => b.status === 'occupied').length,
      reserved: beds.filter((b) => b.status === 'reserved').length,
      cleaning: beds.filter((b) => b.status === 'cleaning').length,
      maintenance: beds.filter((b) => b.status === 'maintenance').length,
      blocked: beds.filter((b) => b.status === 'blocked').length,
      occupancyPercent: 0,
    };
    summary.occupancyPercent =
      summary.total === 0
        ? 0
        : Math.round((summary.occupied / summary.total) * 1000) / 10;
    return { summary, beds };
  }

  async create(input: CreateBedInput) {
    const bed: Bed = {
      id: `bed-${Date.now()}`,
      facilityId: input.facilityId,
      facilityName: input.facilityName,
      label: input.label,
      ward: input.ward,
      roomLabel: input.roomLabel,
      bedType: input.bedType ?? 'standard',
      status: 'available',
      notes: input.notes,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.beds.unshift(bed);
    return bed;
  }

  async assign(bedId: string, input: AssignBedInput) {
    const idx = this.beds.findIndex((b) => b.id === bedId);
    if (idx < 0) throw new Error('Bed not found');
    const bed = this.beds[idx]!;
    if (bed.status === 'occupied') throw new Error('Bed is already occupied');
    const updated: Bed = {
      ...bed,
      status: 'occupied',
      patientId: input.patientId,
      patientName: input.patientName ?? 'Patient',
      notes: input.notes ?? bed.notes,
      updatedAt: nowIso(),
    };
    this.beds[idx] = updated;
    this.assignments.unshift({
      id: `asg-${Date.now()}`,
      bedId,
      patientId: input.patientId,
      patientName: updated.patientName!,
      status: 'assigned',
      assignedAt: nowIso(),
      notes: input.notes,
    });
    return updated;
  }

  async release(bedId: string, notes?: string) {
    const idx = this.beds.findIndex((b) => b.id === bedId);
    if (idx < 0) throw new Error('Bed not found');
    const bed = this.beds[idx]!;
    this.assignments = this.assignments.map((a) =>
      a.bedId === bedId && a.status === 'assigned'
        ? { ...a, status: 'released' as const, releasedAt: nowIso(), notes }
        : a,
    );
    const updated: Bed = {
      ...bed,
      status: 'cleaning',
      patientId: undefined,
      patientName: undefined,
      notes: notes ?? bed.notes,
      updatedAt: nowIso(),
    };
    this.beds[idx] = updated;
    return updated;
  }

  async reserve(bedId: string, input: ReserveBedInput = {}) {
    const idx = this.beds.findIndex((b) => b.id === bedId);
    if (idx < 0) throw new Error('Bed not found');
    const bed = this.beds[idx]!;
    const updated: Bed = {
      ...bed,
      status: 'reserved',
      reservedUntil: input.reservedUntil,
      notes: input.notes ?? bed.notes,
      updatedAt: nowIso(),
    };
    this.beds[idx] = updated;
    return updated;
  }

  async updateStatus(bedId: string, input: UpdateBedStatusInput) {
    const idx = this.beds.findIndex((b) => b.id === bedId);
    if (idx < 0) throw new Error('Bed not found');
    const bed = this.beds[idx]!;
    const clearPatient =
      input.status === 'available' || input.status === 'cleaning';
    const updated: Bed = {
      ...bed,
      status: input.status,
      patientId: clearPatient ? undefined : bed.patientId,
      patientName: clearPatient ? undefined : bed.patientName,
      notes: input.notes ?? bed.notes,
      updatedAt: nowIso(),
    };
    this.beds[idx] = updated;
    return updated;
  }

  async getAssignments(bedId: string) {
    return this.assignments.filter((a) => a.bedId === bedId);
  }
}

export const bedsMockRepository = new BedsMockRepository();
