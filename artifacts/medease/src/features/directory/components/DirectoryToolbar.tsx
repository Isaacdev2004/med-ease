import type { ReactNode } from 'react';
import { LayoutGrid, List, Map, Table2 } from 'lucide-react';

import { DataToolbar, ExportMenu } from '@/shared/components';
import { Button } from '@/shared/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/toggle-group';
import type { DirectoryViewMode } from '@/services/directory/directory.types';
import { cn } from '@/shared/lib/utils';

interface DirectoryToolbarProps {
  search: ReactNode;
  filters: ReactNode;
  view: DirectoryViewMode;
  onViewChange: (view: DirectoryViewMode) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  exportRows?: Record<string, string | number>[];
  showExport?: boolean;
  className?: string;
}

export function DirectoryToolbar({
  search,
  filters,
  view,
  onViewChange,
  onRefresh,
  refreshing,
  exportRows = [],
  showExport = false,
  className,
}: DirectoryToolbarProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <DataToolbar
        search={search}
        filters={filters}
        onRefresh={onRefresh}
        refreshing={refreshing}
        actions={
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(value) => value && onViewChange(value as DirectoryViewMode)}
              aria-label="View mode"
            >
              <ToggleGroupItem value="cards" aria-label="Card view">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label="Table view">
                <Table2 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="compact" aria-label="Compact list">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="map" aria-label="Map view">
                <Map className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            {showExport ? (
              <ExportMenu
                filename="healthcare-directory"
                rows={exportRows}
                columns={[
                  { key: 'name', label: 'Name' },
                  { key: 'type', label: 'Type' },
                  { key: 'city', label: 'City' },
                  { key: 'department', label: 'Department' },
                  { key: 'phone', label: 'Phone' },
                ]}
              />
            ) : (
              <Button variant="outline" size="sm" disabled title="Export requires admin permission">
                Export
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
}
