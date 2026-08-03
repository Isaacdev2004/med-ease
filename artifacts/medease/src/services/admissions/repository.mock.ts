import type {
  Admission,
  AdmissionBoardResult,
  AdmissionFilters,
  AdmissionsRepositoryContract,
  AssignAdmissionBedInput,
  CompleteTransferInput,
  CreateAdmissionInput,
  CreateTransferInput,
  PatientTransfer,
  TransferFilters,
  TriageAdmissionInput,
} from '@medease/admissions-contract';

import { DEMO_FACILITY_PARIS } from '@/services/admissions/types';

const nowIso = () => new Date().toISOString();

function seedAdmissions(): Admission[] {
  return [
    {
      id: '01930000-0000-7000-8000-000000000a01',
      patientId: '01930000-0000-7000-8000-000000000303',
      patientName: 'Maria Lopez',
      patientMrn: 'MRN-33012',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      ward: 'Emergency',
      status: 'requested',
      priority: 'urgent',
      requestedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: '01930000-0000-7000-8000-000000000a02',
      patientId: '01930000-0000-7000-8000-000000000304',
      patientName: 'David Chen',
      patientMrn: 'MRN-44102',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      ward: 'ICU-3',
      bedId: '01930000-0000-7000-8000-000000000901',
      bedLabel: 'ICU-3-01',
      status: 'admitted',
      priority: 'urgent',
      requestedAt: nowIso(),
      admittedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: '01930000-0000-7000-8000-000000000a03',
      patientId: '01930000-0000-7000-8000-000000000302',
      patientName: 'James Wilson',
      patientMrn: 'MRN-20481',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      ward: 'Med-Surg 2B',
      status: 'triaged',
      priority: 'routine',
      requestedAt: nowIso(),
      triagedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: '01930000-0000-7000-8000-000000000a04',
      patientId: '01930000-0000-7000-8000-000000000305',
      patientName: 'Emily Rodriguez',
      patientMrn: 'MRN-55291',
      facilityId: DEMO_FACILITY_PARIS,
      facilityName: 'Pitié-Salpêtrière',
      ward: 'Pediatrics',
      status: 'discharged',
      priority: 'routine',
      requestedAt: nowIso(),
      admittedAt: nowIso(),
      dischargedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];
}

function seedTransfers(): PatientTransfer[] {
  return [
    {
      id: '01930000-0000-7000-8000-000000000b01',
      patientId: '01930000-0000-7000-8000-000000000301',
      patientName: 'Sarah Jenkins',
      fromFacilityId: DEMO_FACILITY_PARIS,
      fromFacilityName: 'Pitié-Salpêtrière',
      fromWard: 'Emergency',
      toFacilityId: DEMO_FACILITY_PARIS,
      toFacilityName: 'Pitié-Salpêtrière',
      toWard: 'ICU-3',
      status: 'in_transit',
      requestedAt: nowIso(),
      startedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: '01930000-0000-7000-8000-000000000b02',
      patientId: '01930000-0000-7000-8000-000000000302',
      patientName: 'James Wilson',
      fromFacilityId: DEMO_FACILITY_PARIS,
      fromFacilityName: 'Pitié-Salpêtrière',
      fromWard: 'Med-Surg 2B',
      toFacilityId: DEMO_FACILITY_PARIS,
      toFacilityName: 'Pitié-Salpêtrière',
      toWard: 'Rehab',
      status: 'requested',
      requestedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
    {
      id: '01930000-0000-7000-8000-000000000b03',
      patientId: '01930000-0000-7000-8000-000000000305',
      patientName: 'Emily Rodriguez',
      fromFacilityId: DEMO_FACILITY_PARIS,
      fromFacilityName: 'Pitié-Salpêtrière',
      fromWard: 'Pediatrics',
      toFacilityId: DEMO_FACILITY_PARIS,
      toFacilityName: 'Pitié-Salpêtrière',
      toWard: 'Observation',
      status: 'completed',
      requestedAt: nowIso(),
      completedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    },
  ];
}

class AdmissionsMockRepository implements AdmissionsRepositoryContract {
  private admissions = seedAdmissions();
  private transfers = seedTransfers();

  async search(filters: AdmissionFilters = {}) {
    const items = await this.getAll(filters);
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 25;
    const start = (page - 1) * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      total: items.length,
      page,
      pageSize,
    };
  }

  async getAll(filters: AdmissionFilters = {}) {
    return this.admissions.filter((a) => {
      if (filters.facilityId && a.facilityId !== filters.facilityId) return false;
      if (filters.status && a.status !== filters.status) return false;
      return true;
    });
  }

  async getById(id: string) {
    const row = this.admissions.find((a) => a.id === id);
    if (!row) throw new Error('Admission not found');
    return row;
  }

  async getBoard(filters: AdmissionFilters = {}): Promise<AdmissionBoardResult> {
    const admissions = await this.getAll(filters);
    const pending = admissions.filter((a) =>
      ['requested', 'triaged', 'bed_assigned'].includes(a.status),
    ).length;
    return {
      summary: {
        facilityId: filters.facilityId,
        total: admissions.length,
        pending,
        admitted: admissions.filter((a) => a.status === 'admitted').length,
        discharged: admissions.filter((a) => a.status === 'discharged').length,
        cancelled: admissions.filter((a) => a.status === 'cancelled').length,
        urgent: admissions.filter(
          (a) => a.priority === 'urgent' || a.priority === 'emergency',
        ).length,
      },
      admissions,
    };
  }

  async create(input: CreateAdmissionInput) {
    const row: Admission = {
      id: `adm-${Date.now()}`,
      patientId: input.patientId,
      patientName: 'Patient',
      patientMrn: 'MRN-TEMP',
      facilityId: input.facilityId,
      facilityName: input.facilityName,
      ward: input.ward,
      status: 'requested',
      priority: input.priority ?? 'routine',
      reason: input.reason,
      notes: input.notes,
      requestedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.admissions.unshift(row);
    return row;
  }

  async triage(id: string, input: TriageAdmissionInput = {}) {
    const idx = this.admissions.findIndex((a) => a.id === id);
    if (idx < 0) throw new Error('Admission not found');
    const current = this.admissions[idx]!;
    const updated: Admission = {
      ...current,
      status: 'triaged',
      priority: input.priority ?? current.priority,
      ward: input.ward ?? current.ward,
      notes: input.notes ?? current.notes,
      triagedAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.admissions[idx] = updated;
    return updated;
  }

  async assignBed(id: string, input: AssignAdmissionBedInput) {
    const idx = this.admissions.findIndex((a) => a.id === id);
    if (idx < 0) throw new Error('Admission not found');
    const current = this.admissions[idx]!;
    const updated: Admission = {
      ...current,
      status: 'bed_assigned',
      bedId: input.bedId,
      bedLabel: 'Assigned bed',
      notes: input.notes ?? current.notes,
      updatedAt: nowIso(),
    };
    this.admissions[idx] = updated;
    return updated;
  }

  async admit(id: string, notes?: string) {
    const idx = this.admissions.findIndex((a) => a.id === id);
    if (idx < 0) throw new Error('Admission not found');
    const current = this.admissions[idx]!;
    if (!current.bedId) throw new Error('Assign a bed before admitting');
    const updated: Admission = {
      ...current,
      status: 'admitted',
      admittedAt: nowIso(),
      notes: notes ?? current.notes,
      updatedAt: nowIso(),
    };
    this.admissions[idx] = updated;
    return updated;
  }

  async cancel(id: string, notes?: string) {
    const idx = this.admissions.findIndex((a) => a.id === id);
    if (idx < 0) throw new Error('Admission not found');
    const current = this.admissions[idx]!;
    const updated: Admission = {
      ...current,
      status: 'cancelled',
      cancelledAt: nowIso(),
      notes: notes ?? current.notes,
      updatedAt: nowIso(),
    };
    this.admissions[idx] = updated;
    return updated;
  }

  async discharge(id: string, notes?: string) {
    const idx = this.admissions.findIndex((a) => a.id === id);
    if (idx < 0) throw new Error('Admission not found');
    const current = this.admissions[idx]!;
    const updated: Admission = {
      ...current,
      status: 'discharged',
      dischargedAt: nowIso(),
      notes: notes ?? current.notes,
      updatedAt: nowIso(),
    };
    this.admissions[idx] = updated;
    return updated;
  }

  async searchTransfers(filters: TransferFilters = {}) {
    const items = await this.getAllTransfers(filters);
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 25;
    const start = (page - 1) * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      total: items.length,
      page,
      pageSize,
    };
  }

  async getAllTransfers(filters: TransferFilters = {}) {
    return this.transfers.filter((t) => {
      if (filters.status && t.status !== filters.status) return false;
      return true;
    });
  }

  async getTransfer(id: string) {
    const row = this.transfers.find((t) => t.id === id);
    if (!row) throw new Error('Transfer not found');
    return row;
  }

  async createTransfer(input: CreateTransferInput) {
    const row: PatientTransfer = {
      id: `tr-${Date.now()}`,
      admissionId: input.admissionId,
      patientId: input.patientId,
      patientName: 'Patient',
      fromFacilityId: input.fromFacilityId,
      fromFacilityName: input.fromFacilityName,
      fromWard: input.fromWard,
      fromBedId: input.fromBedId,
      toFacilityId: input.toFacilityId,
      toFacilityName: input.toFacilityName,
      toWard: input.toWard,
      toBedId: input.toBedId,
      status: 'requested',
      reason: input.reason,
      notes: input.notes,
      requestedAt: nowIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.transfers.unshift(row);
    return row;
  }

  async approveTransfer(id: string, notes?: string) {
    return this.patchTransfer(id, { status: 'approved', approvedAt: nowIso(), notes });
  }

  async startTransfer(id: string, notes?: string) {
    return this.patchTransfer(id, {
      status: 'in_transit',
      startedAt: nowIso(),
      notes,
    });
  }

  async completeTransfer(id: string, input: CompleteTransferInput = {}) {
    return this.patchTransfer(id, {
      status: 'completed',
      completedAt: nowIso(),
      toBedId: input.toBedId,
      notes: input.notes,
    });
  }

  async cancelTransfer(id: string, notes?: string) {
    return this.patchTransfer(id, {
      status: 'cancelled',
      cancelledAt: nowIso(),
      notes,
    });
  }

  private async patchTransfer(
    id: string,
    patch: Partial<PatientTransfer>,
  ): Promise<PatientTransfer> {
    const idx = this.transfers.findIndex((t) => t.id === id);
    if (idx < 0) throw new Error('Transfer not found');
    const updated = {
      ...this.transfers[idx]!,
      ...patch,
      notes: patch.notes ?? this.transfers[idx]!.notes,
      updatedAt: nowIso(),
    };
    this.transfers[idx] = updated;
    return updated;
  }
}

export const admissionsMockRepository = new AdmissionsMockRepository();
