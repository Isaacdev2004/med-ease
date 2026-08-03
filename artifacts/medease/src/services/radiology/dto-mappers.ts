import type { QueryParams } from '@workspace/repository-transport';
import type {
  BillingStatus,
  BodyPart,
  ContrastInformation,
  DiagnosticReport,
  Finding,
  ImagingDevice,
  ImagingSeries,
  Impression,
  Measurement,
  Modality,
  PatientPosition,
  Radiologist,
  RadiologyCategory,
  RadiologyOrder,
  RadiologyStudy,
  Recommendation,
  ReportStatus,
  StudyFilters,
  StudyPriority,
  StudyStatus,
} from '@/services/radiology/types';

export type StudyListResult = {
  items: RadiologyStudy[];
  total: number;
  page: number;
  pageSize: number;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : [];
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

export function studyFiltersToQuery(
  filters?: StudyFilters,
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    patientId: filters.patientId,
    modality: filters.modality,
    bodyPart: filters.bodyPart,
    status: filters.status,
    priority: filters.priority,
    facilityId: filters.facilityId,
    radiologistId: filters.radiologistId,
    isCritical: filters.isCritical,
    q: filters.q,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

function mapContrast(value: unknown): ContrastInformation {
  const row = asRecord(value);
  return {
    used: asBoolean(row.used),
    agent: asOptionalString(row.agent),
    volumeMl: asOptionalNumber(row.volumeMl),
    reaction: asOptionalString(row.reaction),
  };
}

function mapPosition(value: unknown): PatientPosition {
  const row = asRecord(value);
  return {
    code: asString(row.code, 'HFS'),
    description: asString(row.description, 'Head first supine'),
  };
}

function mapSeries(value: unknown, studyId: string): ImagingSeries[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const row = asRecord(item);
    return {
      id: asString(row.id, `series-${index}`),
      studyId: asString(row.studyId, studyId),
      seriesNumber: asNumber(row.seriesNumber, index + 1),
      modality: asString(row.modality, 'X-Ray') as Modality,
      description: asString(row.description),
      bodyPart: asString(row.bodyPart, 'chest') as BodyPart,
      instanceCount: asNumber(row.instanceCount),
      instances: Array.isArray(row.instances)
        ? (row.instances as ImagingSeries['instances'])
        : [],
    };
  });
}

function mapFindings(value: unknown): Finding[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const row = asRecord(item);
    return {
      id: asString(row.id, `finding-${index}`),
      title: asString(row.title),
      description: asString(row.description),
      severity: asString(row.severity, 'normal') as Finding['severity'],
      bodyRegion: asOptionalString(row.bodyRegion),
    };
  });
}

function mapImpression(value: unknown): Impression {
  const row = asRecord(value);
  return {
    summary: asString(row.summary),
    critical: asBoolean(row.critical),
  };
}

function mapRecommendations(value: unknown): Recommendation[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const row = asRecord(item);
    return {
      id: asString(row.id, `rec-${index}`),
      text: asString(row.text),
      priority: asString(row.priority, 'routine') as Recommendation['priority'],
      followUpModality: asOptionalString(row.followUpModality) as
        | Modality
        | undefined,
    };
  });
}

function mapMeasurements(value: unknown): Measurement[] {
  if (!Array.isArray(value)) return [];
  return value.map((item, index) => {
    const row = asRecord(item);
    return {
      id: asString(row.id, `meas-${index}`),
      studyId: asString(row.studyId),
      seriesId: asOptionalString(row.seriesId),
      instanceId: asOptionalString(row.instanceId),
      label: asString(row.label),
      value: asNumber(row.value),
      unit: asString(row.unit),
      createdBy: asString(row.createdBy),
      createdAt: asString(row.createdAt),
    };
  });
}

export function mapRadiologyStudy(dto: unknown): RadiologyStudy {
  const row = asRecord(dto);
  const id = asString(row.id);
  return {
    id,
    accessionNumber: asString(row.accessionNumber),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    orderingPhysician: asString(row.orderingPhysician),
    orderingPhysicianId: asString(row.orderingPhysicianId),
    facilityId: asString(row.facilityId),
    facilityName: asString(row.facilityName),
    radiologistId: asOptionalString(row.radiologistId),
    radiologistName: asOptionalString(row.radiologistName),
    modality: asString(row.modality, 'X-Ray') as Modality,
    bodyPart: asString(row.bodyPart, 'chest') as BodyPart,
    category: asString(row.category, 'diagnostic') as RadiologyCategory,
    status: asString(row.status, 'scheduled') as StudyStatus,
    priority: asString(row.priority, 'routine') as StudyPriority,
    studyDate: asString(row.studyDate),
    reason: asString(row.reason),
    clinicalIndication: asString(row.clinicalIndication),
    protocol: asString(row.protocol),
    contrast: mapContrast(row.contrast),
    patientPosition: mapPosition(row.patientPosition),
    imageCount: asNumber(row.imageCount),
    seriesCount: asNumber(row.seriesCount),
    series: mapSeries(row.series, id),
    reportId: asOptionalString(row.reportId),
    radiationDoseMsv: asOptionalNumber(row.radiationDoseMsv),
    deviceId: asString(row.deviceId),
    deviceName: asString(row.deviceName),
    isEmergency: asBoolean(row.isEmergency),
    billingStatus: asString(row.billingStatus, 'pending') as BillingStatus,
    isCritical: asBoolean(row.isCritical),
    carePlanId: asOptionalString(row.carePlanId),
    appointmentId: asOptionalString(row.appointmentId),
    comparisonStudyIds: asStringArray(row.comparisonStudyIds),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapRadiologyStudyArray(dto: unknown): RadiologyStudy[] {
  return Array.isArray(dto) ? dto.map(mapRadiologyStudy) : [];
}

export function mapPaginatedStudies(dto: unknown): StudyListResult {
  const row = asRecord(dto);
  return {
    items: mapRadiologyStudyArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapDiagnosticReport(dto: unknown): DiagnosticReport {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    studyId: asString(row.studyId),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    accessionNumber: asString(row.accessionNumber),
    status: asString(row.status, 'draft') as ReportStatus,
    modality: asString(row.modality, 'X-Ray') as Modality,
    bodyPart: asString(row.bodyPart, 'chest') as BodyPart,
    title: asString(row.title),
    findings: mapFindings(row.findings),
    impression: mapImpression(row.impression),
    recommendations: mapRecommendations(row.recommendations),
    measurements: mapMeasurements(row.measurements),
    radiologistId: asString(row.radiologistId),
    radiologistName: asString(row.radiologistName),
    signedAt: asOptionalString(row.signedAt),
    isCritical: asBoolean(row.isCritical),
    isUnread: asBoolean(row.isUnread, true),
    attachments: asStringArray(row.attachments),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapDiagnosticReportArray(dto: unknown): DiagnosticReport[] {
  return Array.isArray(dto) ? dto.map(mapDiagnosticReport) : [];
}

export function mapRadiologyOrder(dto: unknown): RadiologyOrder {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    studyId: asOptionalString(row.studyId),
    patientId: asString(row.patientId),
    orderingPhysician: asString(row.orderingPhysician),
    clinicalIndication: asString(row.clinicalIndication),
    modality: asString(row.modality, 'X-Ray') as Modality,
    bodyPart: asString(row.bodyPart, 'chest') as BodyPart,
    priority: asString(row.priority, 'routine') as StudyPriority,
    status: asString(row.status, 'scheduled') as StudyStatus,
    carePlanId: asOptionalString(row.carePlanId),
    appointmentId: asOptionalString(row.appointmentId),
    scheduledAt: asOptionalString(row.scheduledAt),
    createdAt: asString(row.createdAt),
  };
}

export function mapImagingDevice(dto: unknown): ImagingDevice {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    name: asString(row.name),
    modality: asString(row.modality, 'X-Ray') as Modality,
    facilityId: asString(row.facilityId),
    facilityName: asString(row.facilityName),
    status: asString(row.status, 'online') as ImagingDevice['status'],
    utilizationPercent: asNumber(row.utilizationPercent),
  };
}

export function mapImagingDeviceArray(dto: unknown): ImagingDevice[] {
  return Array.isArray(dto) ? dto.map(mapImagingDevice) : [];
}

export function mapRadiologist(dto: unknown): Radiologist {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    name: asString(row.name),
    specialty: asString(row.specialty),
    facilityId: asString(row.facilityId),
    activeStudies: asNumber(row.activeStudies),
  };
}

export function mapRadiologistArray(dto: unknown): Radiologist[] {
  return Array.isArray(dto) ? dto.map(mapRadiologist) : [];
}
