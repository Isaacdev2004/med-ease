import type {
  LabDiagnosticReport,
  LabObservation,
  LabResultFilters,
  ResultFlag,
} from '@/services/laboratory/types';

export function sortResultsByDate(
  reports: LabDiagnosticReport[],
): LabDiagnosticReport[] {
  return [...reports].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function getCriticalObservations(
  observations: LabObservation[],
): LabObservation[] {
  return observations.filter((o) => o.flag.startsWith('critical'));
}

export function matchesResultFilters(
  report: LabDiagnosticReport,
  observations: LabObservation[],
  filters: LabResultFilters,
): boolean {
  if (filters.patientId && report.patientId !== filters.patientId) return false;
  if (filters.status && report.status !== filters.status) return false;
  if (filters.category && report.category !== filters.category) return false;
  if (filters.flag) {
    const hasFlag = observations.some(
      (o) => o.reportId === report.id && o.flag === filters.flag,
    );
    if (!hasFlag) return false;
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (!`${report.title} ${report.reportNumber}`.toLowerCase().includes(q))
      return false;
  }
  return true;
}

export function flagSeverity(
  flag: ResultFlag,
): 'success' | 'warning' | 'critical' {
  if (flag === 'normal') return 'success';
  if (flag.startsWith('critical')) return 'critical';
  return 'warning';
}
