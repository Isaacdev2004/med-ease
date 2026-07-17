import { Link } from 'wouter';
import { Eye } from 'lucide-react';

import { HighlightMatch } from '@/shared/data';
import { DataPagination, DataTable } from '@/shared/components';
import type { MedicationRecord } from '@/services/medical-library/medical-library.types';
import { getMedicationProfilePath } from '@/services/medical-library/medical-library.service';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

interface MedicationTableProps {
  medications: MedicationRecord[];
  portalBase: string;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  searchQuery?: string;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function MedicationTable({
  medications,
  portalBase,
  loading,
  error,
  onRetry,
  searchQuery = '',
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: MedicationTableProps) {
  return (
    <DataTable
      caption="Medical library medications"
      data={medications}
      getRowId={(row) => row.id}
      loading={loading}
      error={error}
      onRetry={onRetry}
      rowActions={(row) => (
        <DropdownMenuItem asChild>
          <Link href={getMedicationProfilePath(portalBase, row.id)}>
            <Eye className="mr-2 h-4 w-4" />
            View profile
          </Link>
        </DropdownMenuItem>
      )}
      columns={[
        {
          id: 'name',
          header: 'Medication',
          cell: (row) => (
            <div>
              <p className="font-medium">
                <HighlightMatch text={row.name} query={searchQuery} />
              </p>
              <p className="text-xs text-muted-foreground">
                {row.brandName ?? row.genericName}
              </p>
            </div>
          ),
        },
        { id: 'strength', header: 'Strength', cell: (row) => row.strength },
        { id: 'form', header: 'Form', cell: (row) => row.dosageForm },
        { id: 'atc', header: 'ATC', cell: (row) => row.atcCode },
        {
          id: 'rx',
          header: 'Rx',
          cell: (row) => (
            <Badge
              variant={row.prescriptionRequired ? 'destructive' : 'secondary'}
            >
              {row.prescriptionRequired ? 'Rx' : 'OTC'}
            </Badge>
          ),
        },
        {
          id: 'actions',
          header: '',
          cell: (row) => (
            <Button size="sm" variant="outline" asChild>
              <Link href={getMedicationProfilePath(portalBase, row.id)}>
                View
              </Link>
            </Button>
          ),
        },
      ]}
      footer={
        <DataPagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      }
    />
  );
}
