import type { RadiologyStudy, StudyFilters } from '@/services/radiology/types';

export function matchesStudyFilters(study: RadiologyStudy, filters: StudyFilters): boolean {
  if (filters.patientId && study.patientId !== filters.patientId) return false;
  if (filters.modality && study.modality !== filters.modality) return false;
  if (filters.bodyPart && study.bodyPart !== filters.bodyPart) return false;
  if (filters.status && study.status !== filters.status) return false;
  if (filters.priority && study.priority !== filters.priority) return false;
  if (filters.facilityId && study.facilityId !== filters.facilityId) return false;
  if (filters.radiologistId && study.radiologistId !== filters.radiologistId) return false;
  if (filters.isCritical !== undefined && study.isCritical !== filters.isCritical) return false;
  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (!`${study.accessionNumber} ${study.patientName} ${study.reason} ${study.modality}`.toLowerCase().includes(q)) return false;
  }
  return true;
}

export function sortStudiesByDate(studies: RadiologyStudy[]): RadiologyStudy[] {
  return [...studies].sort((a, b) => new Date(b.studyDate).getTime() - new Date(a.studyDate).getTime());
}
