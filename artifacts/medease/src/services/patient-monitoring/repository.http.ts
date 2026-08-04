import { httpTransport } from '@workspace/repository-transport';
import type {
  AssignDeviceInput,
  CreateObservationInput,
  EnrollRPMInput,
  MonitoringFilters,
  UpdateObservationInput,
  VitalSign,
} from '@/services/patient-monitoring/types';
import {
  mapDeviceAssignment,
  mapEarlyWarningScoreArray,
  mapMonitoringAlert,
  mapMonitoringDashboard,
  mapMonitoringDevice,
  mapMonitoringDeviceArray,
  mapObservation,
  mapPaginatedAlerts,
  mapPaginatedObservations,
  mapPaginatedVitals,
  mapRemoteMonitoringProgram,
  mapRemoteMonitoringProgramArray,
  mapTimelineEntryArray,
  monitoringFiltersToQuery,
} from '@/services/patient-monitoring/dto-mappers';

const BASE = '/api/monitoring';

class PatientMonitoringHttpRepository {
  private readonly transport = httpTransport;
  private readonly favorites: {
    id: string;
    patientId: string;
    observationId: string;
    createdAt: string;
  }[] = [];

  async getDashboard(patientId?: string) {
    return mapMonitoringDashboard(
      await this.transport.get(`${BASE}/dashboard`, {
        query: patientId ? { patientId } : undefined,
      }),
    );
  }

  async listVitals(filters?: MonitoringFilters) {
    return mapPaginatedVitals(
      await this.transport.get(`${BASE}/vitals`, {
        query: monitoringFiltersToQuery(filters),
      }),
    );
  }

  async listObservations(filters?: MonitoringFilters) {
    return mapPaginatedObservations(
      await this.transport.get(`${BASE}/observations`, {
        query: monitoringFiltersToQuery(filters),
      }),
    );
  }

  async getObservation(id: string) {
    try {
      return mapObservation(
        await this.transport.get(`${BASE}/observations/${id}`),
      );
    } catch {
      return null;
    }
  }

  async createObservation(input: CreateObservationInput) {
    return mapObservation(
      await this.transport.post(`${BASE}/observations`, { body: input }),
    );
  }

  async updateObservation(input: UpdateObservationInput) {
    try {
      return mapObservation(
        await this.transport.post(
          `${BASE}/observations/${input.id}/update`,
          {
            body: {
              value: input.value,
              notes: input.notes,
              status: input.status,
            },
          },
        ),
      );
    } catch {
      return null;
    }
  }

  async listAlerts(filters?: MonitoringFilters) {
    return mapPaginatedAlerts(
      await this.transport.get(`${BASE}/alerts`, {
        query: monitoringFiltersToQuery(filters),
      }),
    );
  }

  async resolveAlert(id: string, resolvedBy?: string) {
    try {
      return mapMonitoringAlert(
        await this.transport.post(`${BASE}/alerts/${id}/resolve`, {
          body: { resolvedBy },
        }),
      );
    } catch {
      return null;
    }
  }

  async dismissAlert(id: string) {
    try {
      return mapMonitoringAlert(
        await this.transport.post(`${BASE}/alerts/${id}/dismiss`, {
          body: {},
        }),
      );
    } catch {
      return null;
    }
  }

  async acknowledgeAlert(id: string, by: string) {
    try {
      return mapMonitoringAlert(
        await this.transport.post(`${BASE}/alerts/${id}/acknowledge`, {
          body: { by },
        }),
      );
    } catch {
      return null;
    }
  }

  async getTimeline(patientId: string) {
    return mapTimelineEntryArray(
      await this.transport.get(`${BASE}/timeline`, {
        query: { patientId },
      }),
    );
  }

  async listDevices(patientId?: string) {
    return mapMonitoringDeviceArray(
      await this.transport.get(`${BASE}/devices`, {
        query: patientId ? { patientId } : undefined,
      }),
    );
  }

  async getDevice(id: string) {
    try {
      return mapMonitoringDevice(
        await this.transport.get(`${BASE}/devices/${id}`),
      );
    } catch {
      return null;
    }
  }

  async assignDevice(input: AssignDeviceInput) {
    return mapDeviceAssignment(
      await this.transport.post(`${BASE}/devices/assign`, { body: input }),
    );
  }

  async syncDevice(deviceId: string) {
    try {
      return mapMonitoringDevice(
        await this.transport.post(`${BASE}/devices/${deviceId}/sync`, {
          body: {},
        }),
      );
    } catch {
      return null;
    }
  }

  async listRPMPrograms(patientId?: string) {
    return mapRemoteMonitoringProgramArray(
      await this.transport.get(`${BASE}/programs`, {
        query: patientId ? { patientId } : undefined,
      }),
    );
  }

  async enrollRPM(input: EnrollRPMInput) {
    return mapRemoteMonitoringProgram(
      await this.transport.post(`${BASE}/programs`, { body: input }),
    );
  }

  async removeRPM(programId: string) {
    try {
      return mapRemoteMonitoringProgram(
        await this.transport.post(`${BASE}/programs/${programId}/remove`, {
          body: {},
        }),
      );
    } catch {
      return null;
    }
  }

  async getEarlyWarningScores(patientId?: string) {
    return mapEarlyWarningScoreArray(
      await this.transport.get(`${BASE}/scores`, {
        query: patientId ? { patientId } : undefined,
      }),
    );
  }

  /** Extras without Nest endpoints — live-safe, never mock demo rows. */
  async getTrendAnalysis(
    patientId: string,
    metric?: VitalSign['type'],
  ): Promise<import('@/services/patient-monitoring/types').PatientTrend[]> {
    const { items } = await this.listVitals({ patientId, pageSize: 100 });
    const filtered = metric ? items.filter((v) => v.type === metric) : items;
    if (!filtered.length) return [];
    const byDay = new Map<string, number[]>();
    for (const vital of filtered) {
      const day = vital.recordedAt.slice(0, 10);
      if (!day) continue;
      const bucket = byDay.get(day) ?? [];
      bucket.push(Number(vital.value) || 0);
      byDay.set(day, bucket);
    }
    const points = [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, values]) => ({
        label: day,
        value:
          values.reduce((sum, n) => sum + n, 0) /
          Math.max(values.length, 1),
      }));
    const values = points.map((p) => p.value);
    const average =
      values.reduce((sum, n) => sum + n, 0) / Math.max(values.length, 1);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const first = values[0] ?? 0;
    const last = values[values.length - 1] ?? 0;
    const trend =
      last < first * 0.95
        ? ('improving' as const)
        : last > first * 1.05
          ? ('deteriorating' as const)
          : ('stable' as const);
    return [
      {
        id: `trend-${patientId}-${metric ?? filtered[0]!.type}`,
        patientId,
        metric: metric ?? filtered[0]!.type,
        period: 'daily',
        points,
        average,
        min,
        max,
        trend,
      },
    ];
  }

  async getSessions(_patientId?: string) {
    return [];
  }

  async search(query: string, patientId?: string) {
    const q = query.toLowerCase();
    const [observations, vitals] = await Promise.all([
      this.listObservations({ patientId, pageSize: 50 }),
      this.listVitals({ patientId, pageSize: 50 }),
    ]);
    return {
      observations: observations.items
        .filter((o) =>
          `${o.display ?? ''} ${o.code ?? ''}`.toLowerCase().includes(q),
        )
        .slice(0, 20),
      vitals: vitals.items
        .filter((v) => `${v.type}`.toLowerCase().includes(q))
        .slice(0, 20),
      alerts: [] as Awaited<ReturnType<typeof this.listAlerts>>['items'],
    };
  }

  async getHistory(patientId: string) {
    const [vitals, observations, alerts] = await Promise.all([
      this.listVitals({ patientId, pageSize: 50 }),
      this.listObservations({ patientId, pageSize: 50 }),
      this.listAlerts({ patientId, pageSize: 30 }),
    ]);
    return {
      vitals: vitals.items,
      observations: observations.items,
      alerts: alerts.items,
    };
  }

  async getFavorites(patientId: string) {
    return this.favorites.filter((f) => f.patientId === patientId);
  }

  async toggleFavorite(patientId: string, observationId: string) {
    const existing = this.favorites.find(
      (f) => f.patientId === patientId && f.observationId === observationId,
    );
    if (existing) {
      this.favorites.splice(this.favorites.indexOf(existing), 1);
      return { favorited: false };
    }
    this.favorites.push({
      id: `fav-${observationId}`,
      patientId,
      observationId,
      createdAt: new Date().toISOString(),
    });
    return { favorited: true };
  }

  async exportObservations(
    patientId: string,
    format: 'pdf' | 'csv' | 'fhir',
  ) {
    const { total } = await this.listObservations({ patientId, pageSize: 1 });
    return {
      id: `export-${patientId}`,
      patientId,
      format,
      exportedAt: new Date().toISOString(),
      recordCount: total,
    };
  }

  async shareObservations(
    patientId: string,
    sharedWith: string,
    observationIds: string[],
  ) {
    return {
      id: `share-${patientId}`,
      patientId,
      sharedWith,
      sharedAt: new Date().toISOString(),
      observationIds,
    };
  }
}

export const patientMonitoringHttpRepository =
  new PatientMonitoringHttpRepository();
