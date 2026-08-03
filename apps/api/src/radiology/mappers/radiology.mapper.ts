import type {
  BillingStatus,
  BodyPart,
  ContrastInformation,
  DeviceStatus,
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
  StudyPriority,
  StudyStatus,
} from '@medease/radiology-contract';
import type { Prisma } from '@medease/prisma';

const MODALITIES: Modality[] = [
  'MRI',
  'CT',
  'X-Ray',
  'Ultrasound',
  'PET',
  'Mammography',
  'Fluoroscopy',
  'DEXA',
  'Dental',
  'Nuclear Medicine',
];

const BODY_PARTS: BodyPart[] = [
  'head',
  'neck',
  'chest',
  'abdomen',
  'pelvis',
  'spine',
  'upper_extremity',
  'lower_extremity',
  'whole_body',
  'breast',
  'dental',
  'cardiac',
];

const RADIOLOGISTS: Radiologist[] = [
  {
    id: '01930000-0000-7000-8000-000000000103',
    name: 'Dr. Emily Chen',
    specialty: 'Diagnostic Radiology',
    facilityId: '01930000-0000-7000-8000-000000000201',
    activeStudies: 3,
  },
  {
    id: 'rad-002',
    name: 'Dr. Jean Moreau',
    specialty: 'Neuroradiology',
    facilityId: '01930000-0000-7000-8000-000000000201',
    activeStudies: 5,
  },
];

export function getRadiologistsCatalog(): Radiologist[] {
  return RADIOLOGISTS;
}

export function mapModality(value: string): Modality {
  return (MODALITIES.find((m) => m === value) ?? 'X-Ray') as Modality;
}

export function mapBodyPart(value: string): BodyPart {
  return (BODY_PARTS.find((b) => b === value) ?? 'chest') as BodyPart;
}

export function mapStudyStatus(status: string): StudyStatus {
  switch (status) {
    case 'scheduled':
    case 'in_progress':
    case 'completed':
    case 'pending_interpretation':
    case 'preliminary':
    case 'final':
    case 'amended':
    case 'cancelled':
      return status;
    default:
      return 'scheduled';
  }
}

export function mapPriority(priority: string): StudyPriority {
  switch (priority) {
    case 'routine':
    case 'urgent':
    case 'stat':
      return priority;
    default:
      return 'routine';
  }
}

export function mapCategory(category: string): RadiologyCategory {
  switch (category) {
    case 'diagnostic':
    case 'screening':
    case 'interventional':
    case 'emergency':
    case 'follow_up':
    case 'research':
      return category;
    default:
      return 'diagnostic';
  }
}

export function mapReportStatus(status: string): ReportStatus {
  switch (status) {
    case 'draft':
    case 'preliminary':
    case 'final':
    case 'amended':
    case 'cancelled':
      return status;
    default:
      return 'draft';
  }
}

export function mapBillingStatus(status: string): BillingStatus {
  switch (status) {
    case 'pending':
    case 'submitted':
    case 'paid':
    case 'denied':
      return status;
    default:
      return 'pending';
  }
}

export function mapDeviceStatus(status: string): DeviceStatus {
  switch (status) {
    case 'online':
    case 'offline':
    case 'maintenance':
      return status;
    default:
      return 'online';
  }
}

function parseContrast(value: unknown): ContrastInformation {
  if (!value || typeof value !== 'object') return { used: false };
  const row = value as Record<string, unknown>;
  return {
    used: Boolean(row.used),
    agent: typeof row.agent === 'string' ? row.agent : undefined,
    volumeMl: typeof row.volumeMl === 'number' ? row.volumeMl : undefined,
    reaction: typeof row.reaction === 'string' ? row.reaction : undefined,
  };
}

function parsePosition(value: unknown): PatientPosition {
  if (!value || typeof value !== 'object') {
    return { code: 'HFS', description: 'Head first supine' };
  }
  const row = value as Record<string, unknown>;
  return {
    code: typeof row.code === 'string' ? row.code : 'HFS',
    description:
      typeof row.description === 'string'
        ? row.description
        : 'Head first supine',
  };
}

function parseSeries(value: unknown, studyId: string): ImagingSeries[] {
  if (!Array.isArray(value)) return [];
  const out: ImagingSeries[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : '';
    if (!id) continue;
    out.push({
      id,
      studyId,
      seriesNumber:
        typeof row.seriesNumber === 'number' ? row.seriesNumber : 1,
      modality: mapModality(String(row.modality ?? 'X-Ray')),
      description: String(row.description ?? ''),
      bodyPart: mapBodyPart(String(row.bodyPart ?? 'chest')),
      instanceCount:
        typeof row.instanceCount === 'number' ? row.instanceCount : 0,
      instances: Array.isArray(row.instances)
        ? (row.instances as ImagingSeries['instances'])
        : [],
    });
  }
  return out;
}

function parseFindings(value: unknown): Finding[] {
  if (!Array.isArray(value)) return [];
  const out: Finding[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : '';
    if (!id) continue;
    const severity = String(row.severity ?? 'normal');
    out.push({
      id,
      title: String(row.title ?? ''),
      description: String(row.description ?? ''),
      severity:
        severity === 'mild' ||
        severity === 'moderate' ||
        severity === 'severe' ||
        severity === 'critical'
          ? severity
          : 'normal',
      bodyRegion:
        typeof row.bodyRegion === 'string' ? row.bodyRegion : undefined,
    });
  }
  return out;
}

function parseImpression(value: unknown): Impression {
  if (!value || typeof value !== 'object') {
    return { summary: '', critical: false };
  }
  const row = value as Record<string, unknown>;
  return {
    summary: String(row.summary ?? ''),
    critical: Boolean(row.critical),
  };
}

function parseRecommendations(value: unknown): Recommendation[] {
  if (!Array.isArray(value)) return [];
  const out: Recommendation[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : '';
    if (!id) continue;
    out.push({
      id,
      text: String(row.text ?? ''),
      priority: row.priority === 'urgent' ? 'urgent' : 'routine',
      followUpModality:
        typeof row.followUpModality === 'string'
          ? mapModality(row.followUpModality)
          : undefined,
    });
  }
  return out;
}

function parseMeasurements(value: unknown): Measurement[] {
  if (!Array.isArray(value)) return [];
  const out: Measurement[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') continue;
    const row = item as Record<string, unknown>;
    const id = typeof row.id === 'string' ? row.id : '';
    if (!id) continue;
    out.push({
      id,
      studyId: String(row.studyId ?? ''),
      seriesId: typeof row.seriesId === 'string' ? row.seriesId : undefined,
      instanceId:
        typeof row.instanceId === 'string' ? row.instanceId : undefined,
      label: String(row.label ?? ''),
      value: typeof row.value === 'number' ? row.value : 0,
      unit: String(row.unit ?? ''),
      createdBy: String(row.createdBy ?? ''),
      createdAt: String(row.createdAt ?? ''),
    });
  }
  return out;
}

export function mapOrder(
  row: Prisma.RadiologyOrderGetPayload<object>,
): RadiologyOrder {
  return {
    id: row.id,
    studyId: row.studyId ?? undefined,
    orderNumber: row.orderNumber,
    patientId: row.patientId,
    patientName: row.patientName,
    orderingPhysician: row.orderingPhysician,
    orderingPhysicianId: row.orderingPhysicianId,
    facilityId: row.facilityId,
    facilityName: row.facilityName,
    clinicalIndication: row.clinicalIndication,
    reason: row.reason,
    modality: mapModality(row.modality),
    bodyPart: mapBodyPart(row.bodyPart),
    priority: mapPriority(row.priority),
    status: mapStudyStatus(row.status),
    carePlanId: row.carePlanId ?? undefined,
    appointmentId: row.appointmentId ?? undefined,
    scheduledAt: row.scheduledAt?.toISOString(),
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapStudy(
  row: Prisma.RadiologyStudyGetPayload<{
    include?: { report?: { select: { id: true } } };
  }>,
): RadiologyStudy {
  const reportId =
    'report' in row && row.report && typeof row.report === 'object'
      ? (row.report as { id: string }).id
      : undefined;
  return {
    id: row.id,
    accessionNumber: row.accessionNumber,
    patientId: row.patientId,
    patientName: row.patientName,
    orderingPhysician: row.orderingPhysician,
    orderingPhysicianId: row.orderingPhysicianId,
    facilityId: row.facilityId,
    facilityName: row.facilityName,
    radiologistId: row.radiologistId ?? undefined,
    radiologistName: row.radiologistName ?? undefined,
    modality: mapModality(row.modality),
    bodyPart: mapBodyPart(row.bodyPart),
    category: mapCategory(row.category),
    status: mapStudyStatus(row.status),
    priority: mapPriority(row.priority),
    studyDate: row.studyDate.toISOString(),
    reason: row.reason,
    clinicalIndication: row.clinicalIndication,
    protocol: row.protocol,
    contrast: parseContrast(row.contrast),
    patientPosition: parsePosition(row.patientPosition),
    imageCount: row.imageCount,
    seriesCount: row.seriesCount,
    series: parseSeries(row.series, row.id),
    reportId,
    radiationDoseMsv: row.radiationDoseMsv ?? undefined,
    deviceId: row.deviceId,
    deviceName: row.deviceName,
    isEmergency: row.isEmergency,
    billingStatus: mapBillingStatus(row.billingStatus),
    isCritical: row.isCritical,
    carePlanId: row.carePlanId ?? undefined,
    appointmentId: row.appointmentId ?? undefined,
    comparisonStudyIds: row.comparisonStudyIds,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapReport(
  row: Prisma.RadiologyReportGetPayload<object>,
): DiagnosticReport {
  return {
    id: row.id,
    studyId: row.studyId,
    patientId: row.patientId,
    patientName: row.patientName,
    accessionNumber: row.accessionNumber,
    status: mapReportStatus(row.status),
    modality: mapModality(row.modality),
    bodyPart: mapBodyPart(row.bodyPart),
    title: row.title,
    findings: parseFindings(row.findings),
    impression: parseImpression(row.impression),
    recommendations: parseRecommendations(row.recommendations),
    measurements: parseMeasurements(row.measurements),
    radiologistId: row.radiologistId,
    radiologistName: row.radiologistName,
    signedAt: row.signedAt?.toISOString(),
    isCritical: row.isCritical,
    isUnread: row.isUnread,
    attachments: row.attachments,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapDevice(
  row: Prisma.ImagingDeviceGetPayload<object>,
): ImagingDevice {
  return {
    id: row.id,
    name: row.name,
    modality: mapModality(row.modality),
    facilityId: row.facilityId,
    facilityName: row.facilityName,
    status: mapDeviceStatus(row.status),
    utilizationPercent: row.utilizationPercent,
  };
}
