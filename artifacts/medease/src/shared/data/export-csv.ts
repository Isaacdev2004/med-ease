/** Exports table rows to CSV and triggers browser download. */
export function exportToCsv<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  columns: Array<{ key: keyof T; label: string }>,
) {
  if (rows.length === 0) return;

  const header = columns.map((column) => escapeCsv(String(column.label))).join(',');
  const body = rows
    .map((row) =>
      columns.map((column) => escapeCsv(String(row[column.key] ?? ''))).join(','),
    )
    .join('\n');

  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Opens browser print dialog for the current page region. */
export function printPage() {
  window.print();
}
