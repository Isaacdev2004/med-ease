import type { ReactNode } from 'react';
import { Grid3X3, LayoutGrid, List, Table2 } from 'lucide-react';

import { DataToolbar, ExportMenu } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group';
import type { MedicationViewMode } from '@/services/medical-library/medical-library.types';

interface MedicationToolbarProps {
  search: ReactNode;
  filters: ReactNode;
  view: MedicationViewMode;
  onViewChange: (view: MedicationViewMode) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  exportRows?: Record<string, string | number>[];
  showExport?: boolean;
}

export function MedicationToolbar({
  search,
  filters,
  view,
  onViewChange,
  onRefresh,
  refreshing,
  exportRows = [],
  showExport = false,
}: MedicationToolbarProps) {
  return (
    <DataToolbar
      search={search}
      filters={filters}
      onRefresh={onRefresh}
      refreshing={refreshing}
      actions={
        <div className="flex items-center gap-2">
          <ToggleGroup type="single" value={view} onValueChange={(v) => v && onViewChange(v as MedicationViewMode)} aria-label="View mode">
            <ToggleGroupItem value="cards" aria-label="Cards"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table"><Table2 className="h-4 w-4" /></ToggleGroupItem>
            <ToggleGroupItem value="compact" aria-label="Compact"><List className="h-4 w-4" /></ToggleGroupItem>
            <ToggleGroupItem value="categories" aria-label="Categories"><Grid3X3 className="h-4 w-4" /></ToggleGroupItem>
          </ToggleGroup>
          {showExport ? (
            <ExportMenu filename="medical-library" rows={exportRows} columns={[
              { key: 'name', label: 'Name' },
              { key: 'brand', label: 'Brand' },
              { key: 'strength', label: 'Strength' },
              { key: 'atc', label: 'ATC' },
            ]} />
          ) : (
            <Button variant="outline" size="sm" disabled>Export</Button>
          )}
        </div>
      }
    />
  );
}
