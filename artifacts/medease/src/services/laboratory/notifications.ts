import type { LabAlert, LabDiagnosticReport, SpecimenRecord } from '@/services/laboratory/types';

export function formatLabAlertNotification(alert: LabAlert): string {
  return `${alert.title}: ${alert.message}`;
}

export function formatCriticalResultNotification(alert: LabAlert): string {
  return `Critical lab result — ${alert.title}: ${alert.message}`;
}

export function formatResultVerifiedNotification(report: LabDiagnosticReport): string {
  return `Lab result verified: ${report.title} (${report.reportNumber})`;
}

export function formatResultApprovedNotification(report: LabDiagnosticReport): string {
  return `Lab result approved and released: ${report.title}`;
}

export function formatSpecimenCollectedNotification(specimen: SpecimenRecord): string {
  return `Specimen collected: ${specimen.barcode} (${specimen.specimenType})`;
}

export function formatSampleRejectedNotification(specimen: SpecimenRecord): string {
  return `Sample rejected: ${specimen.barcode}${specimen.rejectionReason ? ` — ${specimen.rejectionReason}` : ''}`;
}

export function formatResultAvailableNotification(report: LabDiagnosticReport): string {
  return `New lab result available: ${report.title}`;
}

export function formatPathologyCompletedNotification(report: LabDiagnosticReport): string {
  return `Pathology report finalized: ${report.title}`;
}

export function formatMicrobiologyFinalizedNotification(report: LabDiagnosticReport): string {
  return `Microbiology culture finalized: ${report.title}`;
}
