import { evaluateObservationAlerts } from '@/services/patient-monitoring/alerts-engine';
import {
  buildDashboard,
  buildTimeline,
  MOCK_ALERTS,
  MOCK_DEVICE_ASSIGNMENTS,
  MOCK_DEVICES,
  MOCK_EARLY_WARNING,
  MOCK_OBSERVATIONS,
  MOCK_RPM_PROGRAMS,
  MOCK_SESSIONS,
  MOCK_TRENDS,
  MOCK_VITALS,
} from '@/services/patient-monitoring/mock-data';
import { buildDailyTrend } from '@/services/patient-monitoring/trends';
import type {
  AssignDeviceInput,
  CreateObservationInput,
  EnrollRPMInput,
  MonitoringFilters,
  MonitoringSearchResult,
  Observation,
  ObservationExport,
  ObservationFavorite,
  ObservationShare,
  RemoteMonitoringProgram,
  UpdateObservationInput,
  VitalSign,
} from '@/services/patient-monitoring/types';

function matchesFilters<T extends { patientId: string }>(
  item: T,
  filters: MonitoringFilters,
  extra?: (item: T) => boolean,
) {
  if (filters.patientId && item.patientId !== filters.patientId) return false;
  return extra ? extra(item) : true;
}

function paginate<T>(items: T[], page = 1, pageSize = 25) {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total: items.length, page, pageSize };
}

class PatientMonitoringRepository {
  private observations = [...MOCK_OBSERVATIONS];
  private vitals = [...MOCK_VITALS];
  private alerts = [...MOCK_ALERTS];
  private devices = [...MOCK_DEVICES];
  private assignments = [...MOCK_DEVICE_ASSIGNMENTS];
  private rpmPrograms = [...MOCK_RPM_PROGRAMS];
  private favorites: ObservationFavorite[] = [];

  getDashboard(patientId?: string) {
    return buildDashboard(patientId);
  }

  listVitals(filters?: MonitoringFilters) {
    const filtered = this.vitals.filter((v) =>
      matchesFilters(v, filters ?? {}, (item) => {
        if (filters?.metric && item.type !== filters.metric) return false;
        if (filters?.context && item.context !== filters.context) return false;
        if (filters?.q && !item.type.includes(filters.q.toLowerCase())) return false;
        return true;
      }),
    );
    return paginate(filtered.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)), filters?.page, filters?.pageSize);
  }

  listObservations(filters?: MonitoringFilters) {
    const filtered = this.observations.filter((o) =>
      matchesFilters(o, filters ?? {}, (item) => {
        if (filters?.category && item.category !== filters.category) return false;
        if (filters?.context && item.context !== filters.context) return false;
        if (filters?.q) {
          const q = filters.q.toLowerCase();
          if (!item.display.toLowerCase().includes(q) && !item.code.toLowerCase().includes(q)) return false;
        }
        return true;
      }),
    );
    return paginate(filtered.sort((a, b) => b.recordedAt.localeCompare(a.recordedAt)), filters?.page, filters?.pageSize);
  }

  getObservation(id: string) {
    return this.observations.find((o) => o.id === id) ?? null;
  }

  createObservation(input: CreateObservationInput): Observation {
    const obs: Observation = {
      id: `obs-${Date.now()}`,
      patientId: input.patientId,
      category: input.category,
      code: input.code,
      display: input.display,
      value: input.value,
      unit: input.unit,
      recordedAt: new Date().toISOString(),
      context: input.context ?? 'home',
      deviceId: input.deviceId,
      status: 'final',
      interpretation: 'normal',
      recordedBy: 'Clinician',
      notes: input.notes,
    };
    this.observations.unshift(obs);
    const alert = evaluateObservationAlerts(obs, `Patient ${input.patientId}`);
    if (alert) this.alerts.unshift(alert);
    return obs;
  }

  updateObservation(input: UpdateObservationInput): Observation | null {
    const idx = this.observations.findIndex((o) => o.id === input.id);
    if (idx < 0) return null;
    this.observations[idx] = { ...this.observations[idx]!, ...input };
    return this.observations[idx]!;
  }

  listAlerts(filters?: MonitoringFilters) {
    const filtered = this.alerts.filter((a) =>
      matchesFilters(a, filters ?? {}, (item) => {
        if (filters?.status && item.status !== filters.status) return false;
        if (filters?.severity && item.severity !== filters.severity) return false;
        return true;
      }),
    );
    return paginate(filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), filters?.page, filters?.pageSize);
  }

  resolveAlert(id: string, resolvedBy?: string) {
    const alert = this.alerts.find((a) => a.id === id);
    if (!alert) return null;
    alert.status = 'resolved';
    alert.resolvedAt = new Date().toISOString();
    alert.acknowledgedBy = resolvedBy;
    return alert;
  }

  dismissAlert(id: string) {
    const alert = this.alerts.find((a) => a.id === id);
    if (!alert) return null;
    alert.status = 'dismissed';
    return alert;
  }

  acknowledgeAlert(id: string, by: string) {
    const alert = this.alerts.find((a) => a.id === id);
    if (!alert) return null;
    alert.status = 'acknowledged';
    alert.acknowledgedAt = new Date().toISOString();
    alert.acknowledgedBy = by;
    return alert;
  }

  getTimeline(patientId: string) {
    return buildTimeline(patientId);
  }

  listDevices(patientId?: string) {
    if (!patientId) return this.devices;
    const assignedIds = new Set(
      this.assignments.filter((a) => a.patientId === patientId && a.active).map((a) => a.deviceId),
    );
    return this.devices.filter((d) => assignedIds.has(d.id));
  }

  getDevice(id: string) {
    return this.devices.find((d) => d.id === id) ?? null;
  }

  assignDevice(input: AssignDeviceInput) {
    const assignment = {
      id: `assign-${Date.now()}`,
      deviceId: input.deviceId,
      patientId: input.patientId,
      assignedAt: new Date().toISOString(),
      assignedBy: input.assignedBy,
      programId: input.programId,
      active: true,
    };
    this.assignments.push(assignment);
    const device = this.devices.find((d) => d.id === input.deviceId);
    if (device) {
      device.status = 'online';
      device.lastSyncAt = new Date().toISOString();
    }
    return assignment;
  }

  syncDevice(deviceId: string) {
    const device = this.devices.find((d) => d.id === deviceId);
    if (!device) return null;
    device.status = 'syncing';
    device.lastSyncAt = new Date().toISOString();
    device.status = 'online';
    return device;
  }

  listRPMPrograms(patientId?: string) {
    return patientId
      ? this.rpmPrograms.filter((r) => r.patientId === patientId)
      : this.rpmPrograms;
  }

  enrollRPM(input: EnrollRPMInput): RemoteMonitoringProgram {
    const program: RemoteMonitoringProgram = {
      id: `rpm-${Date.now()}`,
      patientId: input.patientId,
      name: input.name,
      status: 'active',
      enrolledAt: new Date().toISOString(),
      enrolledBy: input.clinicianName,
      deviceIds: input.deviceIds ?? [],
      metrics: input.metrics,
      frequency: input.frequency,
      clinicianId: input.clinicianId,
      clinicianName: input.clinicianName,
      carePlanId: input.carePlanId,
    };
    this.rpmPrograms.unshift(program);
    return program;
  }

  removeRPM(programId: string) {
    const program = this.rpmPrograms.find((p) => p.id === programId);
    if (!program) return null;
    program.status = 'completed';
    program.completedAt = new Date().toISOString();
    return program;
  }

  getTrendAnalysis(patientId: string, metric?: VitalSign['type']) {
    const patientVitals = this.vitals.filter((v) => v.patientId === patientId);
    const stored = MOCK_TRENDS.filter((t) => t.patientId === patientId);
    if (metric) {
      const built = buildDailyTrend(patientVitals, metric);
      return [built, ...stored.filter((t) => t.metric === metric)].slice(0, 4);
    }
    return stored.slice(0, 8);
  }

  getEarlyWarningScores(patientId?: string) {
    return patientId
      ? MOCK_EARLY_WARNING.filter((e) => e.patientId === patientId)
      : MOCK_EARLY_WARNING;
  }

  getSessions(patientId?: string) {
    return patientId ? MOCK_SESSIONS.filter((s) => s.patientId === patientId) : MOCK_SESSIONS;
  }

  search(query: string, patientId?: string): MonitoringSearchResult {
    const q = query.toLowerCase();
    return {
      observations: this.observations.filter((o) =>
        (!patientId || o.patientId === patientId) &&
        (o.display.toLowerCase().includes(q) || o.code.toLowerCase().includes(q)),
      ).slice(0, 20),
      vitals: this.vitals.filter((v) =>
        (!patientId || v.patientId === patientId) && v.type.includes(q),
      ).slice(0, 20),
      alerts: this.alerts.filter((a) =>
        (!patientId || a.patientId === patientId) &&
        (a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q)),
      ).slice(0, 20),
      devices: this.devices.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 10),
    };
  }

  getHistory(patientId: string) {
    return {
      vitals: this.vitals.filter((v) => v.patientId === patientId).slice(0, 50),
      observations: this.observations.filter((o) => o.patientId === patientId).slice(0, 50),
      alerts: this.alerts.filter((a) => a.patientId === patientId).slice(0, 30),
    };
  }

  getFavorites(patientId: string) {
    return this.favorites.filter((f) => f.patientId === patientId);
  }

  toggleFavorite(patientId: string, observationId: string) {
    const existing = this.favorites.find((f) => f.patientId === patientId && f.observationId === observationId);
    if (existing) {
      this.favorites = this.favorites.filter((f) => f.id !== existing.id);
      return { favorited: false };
    }
    this.favorites.push({
      id: `fav-${Date.now()}`,
      patientId,
      observationId,
      createdAt: new Date().toISOString(),
    });
    return { favorited: true };
  }

  exportObservations(patientId: string, format: ObservationExport['format']): ObservationExport {
    const count = this.observations.filter((o) => o.patientId === patientId).length;
    return {
      id: `export-${Date.now()}`,
      patientId,
      format,
      exportedAt: new Date().toISOString(),
      recordCount: count,
    };
  }

  shareObservations(patientId: string, sharedWith: string, observationIds: string[]): ObservationShare {
    return {
      id: `share-${Date.now()}`,
      patientId,
      sharedWith,
      sharedAt: new Date().toISOString(),
      observationIds,
    };
  }
}

export const patientMonitoringRepository = new PatientMonitoringRepository();
