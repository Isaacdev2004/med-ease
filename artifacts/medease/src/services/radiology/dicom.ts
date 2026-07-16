import type { DICOMMetadata, RadiologyStudy } from '@/services/radiology/types';

export function toDicomMetadata(study: RadiologyStudy): DICOMMetadata {
  const series = study.series[0];
  const instance = series?.instances[0];
  return {
    studyInstanceUid: `1.2.840.${study.id}`,
    seriesInstanceUid: series ? `1.2.840.${series.id}` : '',
    sopInstanceUid: instance?.dicomUid ?? '',
    patientId: study.patientId,
    accessionNumber: study.accessionNumber,
    studyDate: study.studyDate,
    modality: study.modality,
    bodyPartExamined: study.bodyPart,
    windowCenter: 40,
    windowWidth: 400,
  };
}

export function parseDicomPlaceholder(buffer: ArrayBuffer): DICOMMetadata | null {
  void buffer;
  return null;
}
