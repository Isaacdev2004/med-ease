import type {
  AlertListResult,
  AssignDeviceInput,
  CreateObservationInput,
  DeviceAssignment,
  EarlyWarningScore,
  EnrollRPMInput,
  MonitoringAlert,
  MonitoringDashboard,
  MonitoringDevice,
  MonitoringFilters,
  Observation,
  ObservationListResult,
  ObservationTimelineEntry,
  RemoteMonitoringProgram,
  UpdateObservationInput,
  VitalListResult,
} from './monitoring.types';

export interface MonitoringRepositoryContract {
  getDashboard(patientId?: string): Promise<MonitoringDashboard>;

  listVitals(filters?: MonitoringFilters): Promise<VitalListResult>;
  listObservations(filters?: MonitoringFilters): Promise<ObservationListResult>;
  getObservation(id: string): Promise<Observation>;
  createObservation(input: CreateObservationInput): Promise<Observation>;
  updateObservation(input: UpdateObservationInput): Promise<Observation>;

  listAlerts(filters?: MonitoringFilters): Promise<AlertListResult>;
  resolveAlert(id: string, resolvedBy?: string): Promise<MonitoringAlert>;
  dismissAlert(id: string): Promise<MonitoringAlert>;
  acknowledgeAlert(id: string, by: string): Promise<MonitoringAlert>;

  getTimeline(patientId: string): Promise<ObservationTimelineEntry[]>;

  listDevices(patientId?: string): Promise<MonitoringDevice[]>;
  getDevice(id: string): Promise<MonitoringDevice>;
  assignDevice(input: AssignDeviceInput): Promise<DeviceAssignment>;
  syncDevice(deviceId: string): Promise<MonitoringDevice>;

  listRPMPrograms(patientId?: string): Promise<RemoteMonitoringProgram[]>;
  enrollRPM(input: EnrollRPMInput): Promise<RemoteMonitoringProgram>;
  removeRPM(programId: string): Promise<RemoteMonitoringProgram>;

  getEarlyWarningScores(patientId?: string): Promise<EarlyWarningScore[]>;
}
