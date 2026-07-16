import { Download, FileSpreadsheet, Printer } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { exportToCsv, printPage } from '@/shared/data/export-csv';

interface ExportMenuProps<T extends Record<string, unknown>> {
  filename: string;
  rows: T[];
  columns: Array<{ key: keyof T; label: string }>;
  disabled?: boolean;
}

/** CSV and print export — permission checks belong at the call site. */
export function ExportMenu<T extends Record<string, unknown>>({
  filename,
  rows,
  columns,
  disabled,
}: ExportMenuProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || rows.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportToCsv(filename, rows, columns)}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => printPage()}>
          <Printer className="mr-2 h-4 w-4" />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
