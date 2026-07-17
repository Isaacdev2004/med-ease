import type {
  ExportFormat,
  ExportStatus,
  ReportExport,
} from '@/services/reporting/types';

const FORMAT_MIME: Record<ExportFormat, string> = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
};

export function mimeForFormat(format: ExportFormat): string {
  return FORMAT_MIME[format];
}

export function estimateFileSizeKb(
  recordCount: number,
  format: ExportFormat,
): number {
  const base = format === 'pdf' ? 120 : format === 'xlsx' ? 45 : 12;
  return Math.round(base + recordCount * (format === 'csv' ? 0.5 : 1.2));
}

export function nextExportStatus(
  current: ExportStatus,
  action: 'start' | 'complete' | 'fail',
): ExportStatus {
  if (action === 'start') return 'processing';
  if (action === 'complete') return 'completed';
  return 'failed';
}

export function pendingExportCount(exports: ReportExport[]): number {
  return exports.filter(
    (e) => e.status === 'queued' || e.status === 'processing',
  ).length;
}

export function exportsTodayCount(exports: ReportExport[]): number {
  const today = new Date().toDateString();
  return exports.filter((e) => new Date(e.requestedAt).toDateString() === today)
    .length;
}

export function formatBreakdown(
  exports: ReportExport[],
): { label: string; value: number }[] {
  const counts: Record<ExportFormat, number> = { pdf: 0, xlsx: 0, csv: 0 };
  for (const e of exports) counts[e.format]++;
  return (['pdf', 'xlsx', 'csv'] as const).map((label) => ({
    label: label.toUpperCase(),
    value: counts[label],
  }));
}
