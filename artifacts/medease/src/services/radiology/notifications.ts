import type {
  DiagnosticReport,
  RadiologyStudy,
} from '@/services/radiology/types';

export function formatStudyUploadedNotification(study: RadiologyStudy): string {
  return `Imaging study ${study.accessionNumber} (${study.modality}) uploaded for ${study.patientName}.`;
}

export function formatCriticalReportNotification(
  report: DiagnosticReport,
): string {
  return `Critical imaging result: ${report.title} — immediate review required.`;
}
