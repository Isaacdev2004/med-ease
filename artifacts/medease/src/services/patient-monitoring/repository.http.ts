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
import { patientMonitoringMockRepository } from '@/services/patient-monitoring/repository.mock';

const BASE = '/api/monitoring';

class PatientMonitoringHttpRepository {
  private readonly transport = httpTransport;
  private readonly mock = patientMonitoringMockRepository;

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

  // Hybrid mock-only surfaces
  getTrendAnalysis(patientId: string, metric?: VitalSign['type']) {
    return this.mock.getTrendAnalysis(patientId, metric);
  }

  getSessions(patientId?: string) {
    return this.mock.getSessions(patientId);
  }

  search(query: string, patientId?: string) {
    return this.mock.search(query, patientId);
  }

  getHistory(patientId: string) {
    return this.mock.getHistory(patientId);
  }

  getFavorites(patientId: string) {
    return this.mock.getFavorites(patientId);
  }

  toggleFavorite(patientId: string, observationId: string) {
    return this.mock.toggleFavorite(patientId, observationId);
  }

  exportObservations(
    patientId: string,
    format: 'pdf' | 'csv' | 'fhir',
  ) {
    return this.mock.exportObservations(patientId, format);
  }

  shareObservations(
    patientId: string,
    sharedWith: string,
    observationIds: string[],
  ) {
    return this.mock.shareObservations(patientId, sharedWith, observationIds);
  }
}

export const patientMonitoringHttpRepository =
  new PatientMonitoringHttpRepository();
