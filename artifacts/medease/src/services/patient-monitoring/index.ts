export { patientMonitoringService } from '@/services/patient-monitoring/patient-monitoring.service';
export { patientMonitoringRepository } from '@/services/patient-monitoring/repository';
export { patientMonitoringOfflineQueue } from '@/services/patient-monitoring/offline-sync';
export { computeMonitoringAnalytics } from '@/services/patient-monitoring/analytics';
export { calculateNEWS2, calculateMEWS, classifyBloodPressure, classifyGlucose } from '@/services/patient-monitoring/scoring';
export { buildDailyTrend, buildWeeklyTrend, buildRecoveryTrend } from '@/services/patient-monitoring/trends';
export {
  toFhirObservation,
  toFhirDevice,
  toFhirDeviceMetric,
  toFhirEncounter,
  toFhirCarePlanMonitoring,
  toFhirQuestionnaireResponse,
} from '@/services/patient-monitoring/mapper';
export {
  buildDashboard,
  buildTimeline,
  getPatientIdForUser,
  MOCK_VITALS,
  MOCK_OBSERVATIONS,
  MOCK_ALERTS,
  MOCK_DEVICES,
  MOCK_RPM_PROGRAMS,
  MOCK_EARLY_WARNING,
  MOCK_SESSIONS,
  MOCK_TRENDS,
} from '@/services/patient-monitoring/mock-data';
export type {
  VitalSign,
  Observation,
  MonitoringAlert,
  MonitoringDevice,
  MonitoringDashboard,
  MonitoringAnalytics,
  MonitoringFilters,
  MonitoringSession,
  RemoteMonitoringProgram,
  EarlyWarningScore,
  PatientTrend,
  ObservationTimelineEntry,
  CreateObservationInput,
  AssignDeviceInput,
  EnrollRPMInput,
  VitalType,
  AlertSeverity,
  DeviceStatus,
} from '@/services/patient-monitoring/types';
export { AUTH_USER_PATIENT_MAP, MONITORED_PATIENT_IDS } from '@/services/patient-monitoring/types';
