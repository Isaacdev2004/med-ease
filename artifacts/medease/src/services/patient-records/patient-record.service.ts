import type {
  PatientHealthRecord,
  PatientRecordFilters,
  TimelineEntry,
  VitalReading,
} from '@/services/patient-records/types';
import { getPatientIdForUser } from '@/services/patient-records/mock-data';
import { patientRecordRepository } from '@/services/patient-records/repository';

const DELAY_MS = 250;

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterTimeline(
  timeline: TimelineEntry[],
  filters: PatientRecordFilters,
): TimelineEntry[] {
  return timeline.filter((entry) => {
    if (filters.category && entry.category !== filters.category) return false;
    if (filters.severity && entry.severity !== filters.severity) return false;
    if (
      filters.provider &&
      entry.actor &&
      !entry.actor.includes(filters.provider)
    )
      return false;
    if (filters.dateFrom && new Date(entry.date) < new Date(filters.dateFrom))
      return false;
    if (filters.dateTo && new Date(entry.date) > new Date(filters.dateTo))
      return false;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      if (
        !entry.title.toLowerCase().includes(q) &&
        !entry.description.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });
}

export const patientRecordService = {
  async resolvePatientId(
    userId: string,
    explicitId?: string,
  ): Promise<string | null> {
    await delay(50);
    if (explicitId) return explicitId;
    return getPatientIdForUser(userId);
  },

  async search(filters?: PatientRecordFilters) {
    await delay();
    return patientRecordRepository.search(filters);
  },

  async getRecord(patientId: string): Promise<PatientHealthRecord | null> {
    await delay();
    return patientRecordRepository.getById(patientId);
  },

  async getSummary(patientId: string) {
    await delay(150);
    const record = patientRecordRepository.getById(patientId);
    if (!record) return null;
    return {
      summary: record.summary,
      healthScore: record.healthScore,
      alerts: record.alerts,
    };
  },

  async getTimeline(patientId: string, filters?: PatientRecordFilters) {
    await delay();
    const record = patientRecordRepository.getById(patientId);
    if (!record) return [];
    return filterTimeline(record.timeline, filters ?? {});
  },

  async getVitals(patientId: string): Promise<VitalReading[]> {
    await delay();
    return patientRecordRepository.getById(patientId)?.vitals ?? [];
  },

  async getLabs(patientId: string) {
    await delay();
    return patientRecordRepository.getById(patientId)?.labs ?? [];
  },

  async getRadiology(patientId: string) {
    await delay();
    return patientRecordRepository.getById(patientId)?.radiology ?? [];
  },

  async getDocuments(patientId: string) {
    await delay();
    return patientRecordRepository.getById(patientId)?.documents ?? [];
  },

  async getMedications(patientId: string) {
    await delay();
    return patientRecordRepository.getById(patientId)?.medications ?? [];
  },

  async getAllergies(patientId: string) {
    await delay();
    return patientRecordRepository.getById(patientId)?.allergies ?? [];
  },

  async getProcedures(patientId: string) {
    await delay();
    return patientRecordRepository.getById(patientId)?.procedures ?? [];
  },

  async getImmunizations(patientId: string) {
    await delay();
    return patientRecordRepository.getById(patientId)?.immunizations ?? [];
  },

  async getEncounters(patientId: string) {
    await delay();
    return patientRecordRepository.getById(patientId)?.encounters ?? [];
  },

  async getCarePlans(patientId: string) {
    await delay();
    return patientRecordRepository.getById(patientId)?.carePlans ?? [];
  },

  async getNotes(patientId: string) {
    await delay();
    return patientRecordRepository.getById(patientId)?.notes ?? [];
  },

  async getEmergencySummary(patientId: string) {
    await delay(100);
    return patientRecordRepository.getById(patientId)?.emergencySummary ?? null;
  },

  async getStats() {
    await delay(100);
    const all = patientRecordRepository.getAll();
    const activeAlerts = all.reduce(
      (sum, r) => sum + r.alerts.filter((a) => a.active).length,
      0,
    );
    const pendingCarePlans = all.reduce(
      (sum, r) => sum + r.carePlans.filter((c) => c.status === 'active').length,
      0,
    );
    return { totalPatients: all.length, activeAlerts, pendingCarePlans };
  },

  async addVitalReading(patientId: string, reading: Omit<VitalReading, 'id'>) {
    await delay(100);
    return patientRecordRepository.update(patientId, (record) => ({
      ...record,
      vitals: [{ ...reading, id: `vital-${Date.now()}` }, ...record.vitals],
      updatedAt: new Date().toISOString(),
    }));
  },
};

export function getPatientRecordBasePath(
  portalBase: string,
  patientId?: string,
) {
  if (patientId) return `${portalBase}/patient/${patientId}`;
  return `${portalBase}/records`;
}
