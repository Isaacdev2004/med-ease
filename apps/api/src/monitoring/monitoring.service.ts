import { Injectable } from '@nestjs/common';

import type {
  AssignDeviceInput,
  CreateObservationInput,
  EnrollRPMInput,
  MonitoringFilters,
  UpdateObservationInput,
} from '@medease/monitoring-contract';

import { MonitoringRepository } from './monitoring.repository';

@Injectable()
export class MonitoringService {
  constructor(private readonly repository: MonitoringRepository) {}

  getDashboard(patientId?: string) {
    return this.repository.getDashboard(patientId);
  }

  listVitals(filters?: MonitoringFilters) {
    return this.repository.listVitals(filters);
  }

  listObservations(filters?: MonitoringFilters) {
    return this.repository.listObservations(filters);
  }

  getAllObservations(filters?: MonitoringFilters) {
    return this.repository.getAllObservations(filters);
  }

  getObservation(id: string) {
    return this.repository.getObservation(id);
  }

  createObservation(input: CreateObservationInput) {
    return this.repository.createObservation(input);
  }

  updateObservation(input: UpdateObservationInput) {
    return this.repository.updateObservation(input);
  }

  listAlerts(filters?: MonitoringFilters) {
    return this.repository.listAlerts(filters);
  }

  resolveAlert(id: string, resolvedBy?: string) {
    return this.repository.resolveAlert(id, resolvedBy);
  }

  dismissAlert(id: string) {
    return this.repository.dismissAlert(id);
  }

  acknowledgeAlert(id: string, by: string) {
    return this.repository.acknowledgeAlert(id, by);
  }

  getTimeline(patientId: string) {
    return this.repository.getTimeline(patientId);
  }

  listDevices(patientId?: string) {
    return this.repository.listDevices(patientId);
  }

  getDevice(id: string) {
    return this.repository.getDevice(id);
  }

  assignDevice(input: AssignDeviceInput) {
    return this.repository.assignDevice(input);
  }

  syncDevice(deviceId: string) {
    return this.repository.syncDevice(deviceId);
  }

  listRPMPrograms(patientId?: string) {
    return this.repository.listRPMPrograms(patientId);
  }

  enrollRPM(input: EnrollRPMInput) {
    return this.repository.enrollRPM(input);
  }

  removeRPM(programId: string) {
    return this.repository.removeRPM(programId);
  }

  getEarlyWarningScores(patientId?: string) {
    return this.repository.getEarlyWarningScores(patientId);
  }
}
