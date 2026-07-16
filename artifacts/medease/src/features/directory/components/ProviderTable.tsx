import { Link } from 'wouter';
import { Eye } from 'lucide-react';

import { HighlightMatch } from '@/shared/data';
import {
  DataPagination,
  DataTable,
  SortableColumnHeader,
  StatusBadge,
} from '@/shared/components';
import type { DirectoryProvider } from '@/services/directory/directory.types';
import { getProviderProfilePath } from '@/services/directory/directory.service';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenuItem,
} from '@/shared/ui/dropdown-menu';

interface ProviderTableProps {
  providers: DirectoryProvider[];
  portalBase: string;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  searchQuery?: string;
  sort?: string;
  dir?: 'asc' | 'desc';
  onSort?: (columnId: string) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function ProviderTable({
  providers,
  portalBase,
  loading,
  error,
  onRetry,
  searchQuery = '',
  sort,
  dir = 'asc',
  onSort,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: ProviderTableProps) {
  return (
    <DataTable
      caption="Healthcare services directory"
      data={providers}
      getRowId={(row) => row.id}
      loading={loading}
      error={error}
      onRetry={onRetry}
      rowActions={(row) => (
        <DropdownMenuItem asChild>
          <Link href={getProviderProfilePath(portalBase, row.id)}>
            <Eye className="mr-2 h-4 w-4" />
            View profile
          </Link>
        </DropdownMenuItem>
      )}
      columns={[
        {
          id: 'name',
          sortable: true,
          header: onSort ? (
            <SortableColumnHeader
              label="Provider"
              columnId="name"
              activeSort={sort}
              direction={dir}
              onSort={onSort}
            />
          ) : (
            'Provider'
          ),
          cell: (row) => (
            <div>
              <p className="font-medium">
                <HighlightMatch text={row.name} query={searchQuery} />
              </p>
              <p className="text-xs text-muted-foreground">
                {row.specialty ?? row.facilityType ?? row.type}
              </p>
            </div>
          ),
        },
        {
          id: 'city',
          header: 'City',
          cell: (row) => row.address.city,
        },
        {
          id: 'department',
          header: 'Department',
          cell: (row) => row.address.department,
        },
        {
          id: 'distance',
          header: 'Distance',
          cell: (row) => (row.distanceKm ? `${row.distanceKm.toFixed(1)} km` : '—'),
        },
        {
          id: 'status',
          header: 'Status',
          cell: (row) => <StatusBadge status={row.status} />,
        },
        {
          id: 'actions',
          header: '',
          cell: (row) => (
            <Button size="sm" variant="outline" asChild>
              <Link href={getProviderProfilePath(portalBase, row.id)}>View</Link>
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
