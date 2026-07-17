import type { DicomStudy } from '@/services/interoperability/types';

export function buildWadoUrl(studyUid: string, seriesUid?: string): string {
  return seriesUid
    ? `/dicomweb/studies/${studyUid}/series/${seriesUid}`
    : `/dicomweb/studies/${studyUid}`;
}

export function validateDicomMetadata(study: DicomStudy): boolean {
  return Boolean(study.studyInstanceUid && study.modality && study.patientId);
}

export const DICOM_MODALITIES = [
  'CT',
  'MR',
  'US',
  'XR',
  'NM',
  'PT',
  'MG',
  'CR',
];
