import type {
  DiagnosticReport,
  ImagingComparison,
  ImagingDevice,
  ImagingInstance,
  ImagingSeries,
  Modality,
  RadiologyAnalytics,
  RadiologyDashboard,
  RadiologyStudy,
  RadiologyTimelineEntry,
  Radiologist,
  StudyStatus,
} from '@/services/radiology/types';
import { AUTH_USER_PATIENT_MAP } from '@/services/radiology/types';

const MODALITIES: Modality[] = ['MRI', 'CT', 'X-Ray', 'Ultrasound', 'PET', 'Mammography', 'Fluoroscopy', 'DEXA', 'Dental', 'Nuclear Medicine'];
const BODY_PARTS = ['head', 'neck', 'chest', 'abdomen', 'pelvis', 'spine', 'upper_extremity', 'lower_extremity', 'whole_body', 'breast'] as const;
const PHYSICIANS = [
  { id: 'phys-001', name: 'Dr. Emily Chen' },
  { id: 'phys-002', name: 'Dr. Jean-Luc Martin' },
  { id: 'phys-003', name: 'Dr. Sophie Bernard' },
];
const RADIOLOGISTS = [
  { id: 'rad-001', name: 'Dr. Antoine Moreau', specialty: 'Neuroradiology' },
  { id: 'rad-002', name: 'Dr. Claire Dubois', specialty: 'Body Imaging' },
  { id: 'rad-003', name: 'Dr. Pierre Laurent', specialty: 'Musculoskeletal' },
];
const FACILITIES = [
  { id: 'fac-001', name: 'Pitié-Salpêtrière' },
  { id: 'fac-002', name: 'Hôpital Européen Georges-Pompidou' },
  { id: 'fac-003', name: 'Hôpital Necker' },
];
const DEVICES = [
  { id: 'dev-001', name: 'Siemens MAGNETOM Vida 3T', modality: 'MRI' as Modality },
  { id: 'dev-002', name: 'GE Revolution CT', modality: 'CT' as Modality },
  { id: 'dev-003', name: 'Philips DigitalDiagnost', modality: 'X-Ray' as Modality },
  { id: 'dev-004', name: 'GE LOGIQ E10', modality: 'Ultrasound' as Modality },
];
const PATIENT_NAMES = ['Sarah Jenkins', 'Marcus Dubois', 'Amélie Laurent', 'James Okonkwo', 'Elena Vasquez'];

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length]!;
}

function patientIdFromIndex(idx: number): string {
  return `phr-${String((idx % 40) + 1).padStart(3, '0')}`;
}

function generateInstances(seriesId: string, count: number, startIdx: number): ImagingInstance[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${seriesId}-inst-${i + 1}`,
    seriesId,
    instanceNumber: i + 1,
    thumbnailUrl: `/api/imaging/placeholder/${seriesId}/${i + 1}/thumb`,
    imageUrl: `/api/imaging/placeholder/${seriesId}/${i + 1}`,
    dicomUid: `1.2.840.${startIdx}.${i}`,
  }));
}

function generateSeries(studyId: string, modality: Modality, bodyPart: typeof BODY_PARTS[number], index: number): ImagingSeries[] {
  const seriesCount = 1 + (index % 3);
  return Array.from({ length: seriesCount }, (_, si) => {
    const seriesId = `${studyId}-ser-${si + 1}`;
    const instanceCount = modality === 'CT' || modality === 'MRI' ? 24 + (si * 8) : 4 + si;
    return {
      id: seriesId,
      studyId,
      seriesNumber: si + 1,
      modality,
      description: `${modality} ${bodyPart.replace('_', ' ')} series ${si + 1}`,
      bodyPart,
      instanceCount,
      instances: generateInstances(seriesId, Math.min(instanceCount, 12), index * 100 + si),
    };
  });
}

function studyStatus(index: number): StudyStatus {
  const pool: StudyStatus[] = ['completed', 'final', 'pending_interpretation', 'preliminary', 'in_progress', 'scheduled'];
  return pick(pool, index);
}

export function generateRadiologyStudy(index: number): RadiologyStudy {
  const patientIdx = index % 40;
  const patientId = patientIdFromIndex(patientIdx);
  const modality = pick(MODALITIES, index);
  const bodyPart = pick([...BODY_PARTS], index);
  const physician = pick(PHYSICIANS, index);
  const facility = pick(FACILITIES, index);
  const radiologist = pick(RADIOLOGISTS, index);
  const device = DEVICES.find((d) => d.modality === modality) ?? DEVICES[0]!;
  const status = studyStatus(index);
  const id = `img-${String(index + 1).padStart(4, '0')}`;
  const series = generateSeries(id, modality, bodyPart, index);
  const imageCount = series.reduce((s, ser) => s + ser.instanceCount, 0);
  const isCritical = index % 29 === 0;
  const isEmergency = index % 17 === 0;

  return {
    id,
    accessionNumber: `ACC-${String(200000 + index)}`,
    patientId,
    patientName: pick(PATIENT_NAMES, patientIdx),
    orderingPhysician: physician.name,
    orderingPhysicianId: physician.id,
    facilityId: facility.id,
    facilityName: facility.name,
    radiologistId: ['final', 'preliminary', 'completed'].includes(status) ? radiologist.id : undefined,
    radiologistName: ['final', 'preliminary', 'completed'].includes(status) ? radiologist.name : undefined,
    modality,
    bodyPart,
    category: isEmergency ? 'emergency' : pick(['diagnostic', 'screening', 'follow_up'] as const, index),
    status,
    priority: isEmergency ? 'stat' : index % 8 === 0 ? 'urgent' : 'routine',
    studyDate: daysAgo(index % 180),
    reason: pick(['Persistent headache', 'Chest pain evaluation', 'Follow-up oncology', 'Trauma survey', 'Chronic back pain'], index),
    clinicalIndication: pick(['Rule out pathology', 'Monitor known lesion', 'Pre-operative assessment', 'Screening protocol'], index),
    protocol: `${modality} ${bodyPart} standard protocol`,
    contrast: { used: modality === 'CT' || modality === 'MRI' ? index % 2 === 0 : false, agent: index % 2 === 0 ? 'Gadolinium' : undefined, volumeMl: index % 2 === 0 ? 15 : undefined },
    patientPosition: { code: 'FFS', description: 'Feet First Supine' },
    imageCount,
    seriesCount: series.length,
    series,
    reportId: ['final', 'preliminary', 'completed', 'pending_interpretation'].includes(status) ? `rpt-${id}` : undefined,
    radiationDoseMsv: modality === 'CT' || modality === 'X-Ray' ? 2 + (index % 10) * 0.3 : undefined,
    deviceId: device.id,
    deviceName: device.name,
    isEmergency,
    billingStatus: pick(['pending', 'submitted', 'paid'] as const, index),
    isCritical,
    carePlanId: index % 5 === 0 ? `cp-${String((index % 120) + 1).padStart(3, '0')}` : undefined,
    appointmentId: index % 7 === 0 ? `appt-${index}` : undefined,
    comparisonStudyIds: index % 10 === 0 ? [`img-${String(Math.max(1, index - 50)).padStart(4, '0')}`] : undefined,
    createdAt: daysAgo(index % 180 + 1),
    updatedAt: daysAgo(index % 30),
  };
}

function generateReport(study: RadiologyStudy, index: number): DiagnosticReport {
  const isCritical = study.isCritical;
  return {
    id: `rpt-${study.id}`,
    studyId: study.id,
    patientId: study.patientId,
    patientName: study.patientName,
    accessionNumber: study.accessionNumber,
    status: study.status === 'final' ? 'final' : study.status === 'preliminary' ? 'preliminary' : 'draft',
    modality: study.modality,
    bodyPart: study.bodyPart,
    title: `${study.modality} ${study.bodyPart.replace('_', ' ')} — ${study.reason}`,
    findings: [
      { id: 'f1', title: 'Primary finding', description: isCritical ? 'Large mass with surrounding edema requiring urgent follow-up.' : 'No acute intracranial abnormality.', severity: isCritical ? 'critical' : 'normal' },
      { id: 'f2', title: 'Secondary finding', description: 'Mild degenerative changes.', severity: 'mild' },
    ],
    impression: { summary: isCritical ? 'Critical finding — recommend immediate clinical correlation.' : 'Study within expected limits for clinical context.', critical: isCritical },
    recommendations: isCritical
      ? [{ id: 'r1', text: 'Urgent oncology referral within 48 hours.', priority: 'urgent' }]
      : [{ id: 'r1', text: 'Routine follow-up in 12 months if clinically indicated.', priority: 'routine' }],
    measurements: study.modality === 'CT' ? [{ id: `m-${study.id}`, studyId: study.id, label: 'Lesion diameter', value: 12 + (index % 5), unit: 'mm', createdBy: study.radiologistName ?? 'System', createdAt: study.studyDate }] : [],
    radiologistId: study.radiologistId ?? 'rad-001',
    radiologistName: study.radiologistName ?? 'Dr. Antoine Moreau',
    signedAt: study.status === 'final' ? daysAgo(index % 14) : undefined,
    isCritical,
    isUnread: index % 4 === 0,
    attachments: index % 15 === 0 ? ['report.pdf'] : undefined,
    createdAt: study.studyDate,
    updatedAt: study.updatedAt,
  };
}

export const MOCK_RADIOLOGY_STUDIES: RadiologyStudy[] = Array.from({ length: 320 }, (_, i) => generateRadiologyStudy(i));

export const MOCK_DIAGNOSTIC_REPORTS: DiagnosticReport[] = MOCK_RADIOLOGY_STUDIES
  .filter((s) => s.reportId)
  .map((s, i) => generateReport(s, i));

export const MOCK_RADIOLOGISTS: Radiologist[] = RADIOLOGISTS.map((r, i) => ({
  ...r,
  facilityId: FACILITIES[i % FACILITIES.length]!.id,
  activeStudies: 8 + (i * 3),
}));

export const MOCK_IMAGING_DEVICES: ImagingDevice[] = DEVICES.map((d, i) => ({
  id: d.id,
  name: d.name,
  modality: d.modality,
  facilityId: FACILITIES[i % FACILITIES.length]!.id,
  facilityName: FACILITIES[i % FACILITIES.length]!.name,
  status: i === 2 ? 'maintenance' : 'online',
  utilizationPercent: 55 + (i * 12),
}));

export function buildStudyTimeline(patientId: string): RadiologyTimelineEntry[] {
  const studies = MOCK_RADIOLOGY_STUDIES.filter((s) => s.patientId === patientId).slice(0, 12);
  return studies.flatMap((s) => [
    { id: `tl-${s.id}-study`, patientId, studyId: s.id, type: 'study' as const, title: `${s.modality} ${s.bodyPart}`, description: s.reason, timestamp: s.studyDate },
    ...(s.reportId ? [{ id: `tl-${s.id}-rpt`, patientId, studyId: s.id, type: 'report' as const, title: 'Report available', description: s.status, timestamp: s.updatedAt, severity: s.isCritical ? 'critical' as const : 'info' as const }] : []),
  ]).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function buildDashboard(patientId?: string): RadiologyDashboard {
  const studies = patientId ? MOCK_RADIOLOGY_STUDIES.filter((s) => s.patientId === patientId) : MOCK_RADIOLOGY_STUDIES;
  const reports = patientId ? MOCK_DIAGNOSTIC_REPORTS.filter((r) => r.patientId === patientId) : MOCK_DIAGNOSTIC_REPORTS;
  return {
    patientId,
    studiesToday: studies.filter((_, i) => i % 50 === 0).length || 8,
    pendingReports: reports.filter((r) => r.status === 'draft' || r.status === 'preliminary').length,
    criticalFindings: reports.filter((r) => r.isCritical).length,
    averageReportingHours: 6.2,
    unreadReports: reports.filter((r) => r.isUnread).length,
    emergencyStudies: studies.filter((s) => s.isEmergency).length,
    recentStudies: [...studies].sort((a, b) => new Date(b.studyDate).getTime() - new Date(a.studyDate).getTime()).slice(0, 5),
    recentActivity: buildStudyTimeline(patientId ?? 'phr-001').slice(0, 8),
    kpis: [
      { label: 'Studies', value: studies.length },
      { label: 'Pending', value: reports.filter((r) => r.status !== 'final').length },
      { label: 'Critical', value: reports.filter((r) => r.isCritical).length },
    ],
    chartData: MODALITIES.slice(0, 6).map((m, i) => ({ label: m, value: 40 + i * 15 })),
  };
}

export function buildAnalytics(): RadiologyAnalytics {
  return {
    totalStudies: MOCK_RADIOLOGY_STUDIES.length,
    completedStudies: MOCK_RADIOLOGY_STUDIES.filter((s) => ['completed', 'final'].includes(s.status)).length,
    pendingInterpretation: MOCK_RADIOLOGY_STUDIES.filter((s) => s.status === 'pending_interpretation').length,
    criticalCount: MOCK_DIAGNOSTIC_REPORTS.filter((r) => r.isCritical).length,
    averageReportingHours: 6.2,
    radiologistUtilization: 78,
    deviceUtilization: 72,
    studiesByModality: MODALITIES.map((m, i) => ({ label: m, value: 20 + i * 8 })),
    studiesByBodyPart: BODY_PARTS.slice(0, 6).map((b, i) => ({ label: b.replace('_', ' '), value: 25 + i * 6 })),
    turnaroundByMonth: [
      { label: 'Jan', value: 5.8 }, { label: 'Feb', value: 6.1 }, { label: 'Mar', value: 5.5 },
      { label: 'Apr', value: 6.4 }, { label: 'May', value: 6.0 }, { label: 'Jun', value: 5.9 },
    ],
    emergencyCount: MOCK_RADIOLOGY_STUDIES.filter((s) => s.isEmergency).length,
  };
}

export function buildComparison(studyId: string, comparisonStudyId: string): ImagingComparison | null {
  const study = MOCK_RADIOLOGY_STUDIES.find((s) => s.id === studyId);
  const comp = MOCK_RADIOLOGY_STUDIES.find((s) => s.id === comparisonStudyId);
  if (!study || !comp) return null;
  return {
    studyId,
    comparisonStudyId,
    modality: study.modality,
    bodyPart: study.bodyPart,
    deltaSummary: 'Interval increase in lesion size compared to prior study.',
    changedFindings: ['Primary lesion increased 3mm', 'New small nodule in adjacent segment'],
  };
}

export function getPatientIdForUser(userId: string): string | null {
  return AUTH_USER_PATIENT_MAP[userId] ?? null;
}

export { AUTH_USER_PATIENT_MAP };
