import type { DiagnosticReport, RadiologyStudy } from '@/services/radiology/types';

export function toFhirImagingStudy(study: RadiologyStudy) {
  return {
    resourceType: 'ImagingStudy',
    id: study.id,
    status: study.status === 'cancelled' ? 'unknown' : 'available',
    modality: [{ text: study.modality }],
    subject: { reference: `Patient/${study.patientId}` },
    started: study.studyDate,
    numberOfSeries: study.seriesCount,
    numberOfInstances: study.imageCount,
    procedureCode: [{ text: study.protocol }],
    reasonCode: [{ text: study.clinicalIndication }],
  };
}

export function toFhirDiagnosticReport(report: DiagnosticReport) {
  return {
    resourceType: 'DiagnosticReport',
    id: report.id,
    status: report.status === 'final' ? 'final' : 'preliminary',
    code: { text: report.title },
    subject: { reference: `Patient/${report.patientId}` },
    effectiveDateTime: report.signedAt ?? report.createdAt,
    conclusion: report.impression.summary,
    performer: [{ display: report.radiologistName }],
    imagingStudy: [{ reference: `ImagingStudy/${report.studyId}` }],
  };
}
