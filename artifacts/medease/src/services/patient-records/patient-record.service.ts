import type {
  PatientHealthRecord,
  PatientRecordFilters,
  TimelineEntry,
  VitalReading,
} from '@/services/patient-records/types';
import { useApiAuth } from '@/services/auth/auth-service';
import { getPatientIdForUser } from '@/services/patient-records/mock-data';
import {
  buildDemographicsFromPatient,
  buildPatientHealthRecordFromApi,
} from '@/services/patient-records/live-record.mapper';
import { patientRecordRepository } from '@/services/patient-records/repository';
import { patientsService } from '@/services/patients';
import { NotFoundError } from '@workspace/repository-transport';

const DELAY_MS = 250;

function delay(ms = DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buildAppointmentTimeline(
  patientId: string,
): Promise<TimelineEntry[]> {
  try {
    const { appointmentService } =
      await import('@/services/appointments/appointment.service');
    const [upcoming, past] = await Promise.all([
      appointmentService.getUpcoming({ patientId, pageSize: 10 }),
      appointmentService.getPast({ patientId, pageSize: 10 }),
    ]);

    return [...past, ...upcoming]
      .sort(
        (a, b) =>
          new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
      )
      .map((appointment) => ({
        id: appointment.id,
        category: 'encounter' as const,
        date: appointment.scheduledAt,
        title: `${appointment.specialty} — ${appointment.reason}`,
        description: `${appointment.provider.fullName} · ${appointment.facility.name} · ${appointment.status.replaceAll('_', ' ')}`,
        actor: appointment.provider.fullName,
      }));
  } catch {
    return [];
  }
}

async function loadClinicalEmbeds(patientId: string) {
  const empty = {
    medications: [],
    labObservations: [],
    radiologyStudies: [],
    radiologyReports: [],
    vitals: [],
    carePlans: [],
    careGoals: [],
    careTasks: [],
    telemedicineSessions: [],
  };

  try {
    const [
      { medicationService },
      { laboratoryService },
      { radiologyService },
      { patientMonitoringService },
      { carePlanService },
      { telemedicineService },
    ] = await Promise.all([
      import('@/services/medications/medication.service'),
      import('@/services/laboratory/laboratory.service'),
      import('@/services/radiology/radiology.service'),
      import('@/services/patient-monitoring/patient-monitoring.service'),
      import('@/services/care-plans/care-plan.service'),
      import('@/services/telemedicine/telemedicine.service'),
    ]);

    const [
      medications,
      laboratory,
      imaging,
      vitals,
      carePlans,
      careGoals,
      careTasks,
      teleSessions,
    ] = await Promise.all([
      medicationService
        .getMedications({ patientId })
        .catch(() => [] as Awaited<ReturnType<typeof medicationService.getMedications>>),
      laboratoryService
        .getPatientLaboratory(patientId)
        .catch(() => null),
      radiologyService
        .getPatientImaging(patientId)
        .catch(() => null),
      patientMonitoringService
        .getVitalSigns({ patientId, pageSize: 50 })
        .then((result) => result.items)
        .catch(() => [] as Awaited<
          ReturnType<typeof patientMonitoringService.getVitalSigns>
        >['items']),
      carePlanService
        .getCarePlans({ patientId })
        .catch(() => [] as Awaited<ReturnType<typeof carePlanService.getCarePlans>>),
      carePlanService
        .getGoals(patientId)
        .catch(() => [] as Awaited<ReturnType<typeof carePlanService.getGoals>>),
      carePlanService
        .getTasks(patientId)
        .catch(() => [] as Awaited<ReturnType<typeof carePlanService.getTasks>>),
      telemedicineService
        .searchSessions({ patientId, pageSize: 25 })
        .then((result) => result.items)
        .catch(() => [] as Awaited<
          ReturnType<typeof telemedicineService.searchSessions>
        >['items']),
    ]);

    return {
      medications,
      labObservations: laboratory?.observations ?? [],
      radiologyStudies: imaging?.studies ?? [],
      radiologyReports: imaging?.reports ?? [],
      vitals,
      carePlans,
      careGoals,
      careTasks,
      telemedicineSessions: teleSessions,
    };
  } catch {
    return empty;
  }
}

async function loadLiveRecord(
  patientId: string,
): Promise<PatientHealthRecord | null> {
  try {
    const [
      patient,
      identifiers,
      contacts,
      addresses,
      emergencyContacts,
      allergies,
      preferences,
      timeline,
      clinical,
    ] = await Promise.all([
      patientsService.getPatient(patientId),
      patientsService.getIdentifiers(patientId),
      patientsService.getContacts(patientId),
      patientsService.getAddresses(patientId),
      patientsService.getEmergencyContacts(patientId),
      patientsService.getAllergies(patientId),
      patientsService.getPreferences(patientId).catch(() => undefined),
      buildAppointmentTimeline(patientId),
      loadClinicalEmbeds(patientId),
    ]);

    return buildPatientHealthRecordFromApi({
      patient,
      identifiers,
      contacts,
      addresses,
      emergencyContacts,
      allergies,
      preferences: preferences ?? undefined,
      timeline,
      ...clinical,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return null;
    }
    throw error;
  }
}

async function loadRecord(
  patientId: string,
): Promise<PatientHealthRecord | null> {
  const liveRecord = await loadLiveRecord(patientId);
  if (liveRecord) {
    return liveRecord;
  }
  return patientRecordRepository.getById(patientId);
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

    if (useApiAuth) {
      try {
        const result = await patientsService.listPatients({
          userId,
          page: 1,
          pageSize: 1,
        });
        const patientId = result.items[0]?.patientId;
        if (patientId) return patientId;
      } catch {
        // Fall back to mock resolver below.
      }
    }

    return getPatientIdForUser(userId);
  },

  async search(filters?: PatientRecordFilters) {
    await delay();
    const query = filters?.q?.trim();

    try {
      if (query) {
        const result = await patientsService.searchPatients({
          q: query,
          page: filters?.page ?? 1,
          pageSize: filters?.pageSize ?? 25,
        });

        return {
          items: result.items.map(buildDemographicsFromPatient),
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
        };
      }

      const result = await patientsService.listPatients({
        page: filters?.page ?? 1,
        pageSize: filters?.pageSize ?? 25,
      });

      return {
        items: result.items.map(buildDemographicsFromPatient),
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      };
    } catch {
      return patientRecordRepository.search(filters);
    }
  },

  async getRecord(patientId: string): Promise<PatientHealthRecord | null> {
    await delay();
    return loadRecord(patientId);
  },

  async getSummary(patientId: string) {
    await delay(150);
    const record = await loadRecord(patientId);
    if (!record) return null;
    return {
      summary: record.summary,
      healthScore: record.healthScore,
      alerts: record.alerts,
    };
  },

  async getTimeline(patientId: string, filters?: PatientRecordFilters) {
    await delay();
    const record = await loadRecord(patientId);
    if (!record) return [];
    return filterTimeline(record.timeline, filters ?? {});
  },

  async getVitals(patientId: string): Promise<VitalReading[]> {
    await delay();
    return (await loadRecord(patientId))?.vitals ?? [];
  },

  async getLabs(patientId: string) {
    await delay();
    return (await loadRecord(patientId))?.labs ?? [];
  },

  async getRadiology(patientId: string) {
    await delay();
    return (await loadRecord(patientId))?.radiology ?? [];
  },

  async getDocuments(patientId: string) {
    await delay();
    return (await loadRecord(patientId))?.documents ?? [];
  },

  async getMedications(patientId: string) {
    await delay();
    return (await loadRecord(patientId))?.medications ?? [];
  },

  async getAllergies(patientId: string) {
    await delay();
    return (await loadRecord(patientId))?.allergies ?? [];
  },

  async getProcedures(patientId: string) {
    await delay();
    return (await loadRecord(patientId))?.procedures ?? [];
  },

  async getImmunizations(patientId: string) {
    await delay();
    return (await loadRecord(patientId))?.immunizations ?? [];
  },

  async getEncounters(patientId: string) {
    await delay();
    return (await loadRecord(patientId))?.encounters ?? [];
  },

  async getCarePlans(patientId: string) {
    await delay();
    return (await loadRecord(patientId))?.carePlans ?? [];
  },

  async getNotes(patientId: string) {
    await delay();
    return (await loadRecord(patientId))?.notes ?? [];
  },

  async getEmergencySummary(patientId: string) {
    await delay(100);
    return (await loadRecord(patientId))?.emergencySummary ?? null;
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
