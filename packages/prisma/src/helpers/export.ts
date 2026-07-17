export type ExportFormat = 'csv' | 'pdf' | 'xlsx';

export interface ExportResult {
  format: ExportFormat;
  exportedAt: string;
  recordCount: number;
}

export function buildExportResult(
  format: ExportFormat,
  recordCount: number,
): ExportResult {
  return {
    format,
    exportedAt: new Date().toISOString(),
    recordCount,
  };
}
