import type {
  PatientHealthRecord,
  PatientRecordFilters,
} from '@/services/patient-records/types';
import { MOCK_PATIENT_RECORDS } from '@/services/patient-records/mock-data';

/** In-memory repository — swap for Supabase/PostgreSQL adapter later. */
class PatientRecordRepository {
  private records: Map<string, PatientHealthRecord>;

  constructor(seed: PatientHealthRecord[]) {
    this.records = new Map(seed.map((r) => [r.demographics.id, r]));
  }

  getAll(): PatientHealthRecord[] {
    return [...this.records.values()];
  }

  getById(patientId: string): PatientHealthRecord | null {
    return this.records.get(patientId) ?? null;
  }

  search(filters: PatientRecordFilters = {}) {
    const q = filters.q?.trim().toLowerCase() ?? '';
    let items = this.getAll().map((r) => r.demographics);

    if (q) {
      items = items.filter(
        (d) =>
          d.fullName.toLowerCase().includes(q) ||
          d.mrn.toLowerCase().includes(q) ||
          d.nationalId.toLowerCase().includes(q),
      );
    }

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

  update(
    patientId: string,
    updater: (record: PatientHealthRecord) => PatientHealthRecord,
  ) {
    const current = this.getById(patientId);
    if (!current) return null;
    const next = updater(current);
    this.records.set(patientId, next);
    return next;
  }
}

export const patientRecordRepository = new PatientRecordRepository(
  MOCK_PATIENT_RECORDS,
);
