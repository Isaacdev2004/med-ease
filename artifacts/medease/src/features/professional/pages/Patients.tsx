import { useMemo } from 'react';
import { Link } from 'wouter';
import { Eye, UserPlus, Users } from 'lucide-react';

import { usePatients } from '@/features/professional/hooks/use-patients';
import type { ProfessionalPatientSummary } from '@/features/professional/services/professional.service';
import { ROUTES } from '@/config/routes';
import {
  BulkActionBar,
  DataPageLayout,
  DataPagination,
  DataTable,
  DataToolbar,
  ExportMenu,
  FilterChips,
  FilterPanel,
  LoadingButton,
  MetricCard,
  SearchBar,
  SortableColumnHeader,
  StatCard,
  StatusBadge,
} from '@/shared/components';
import {
  HighlightMatch,
  useRowSelection,
  useTableState,
  useUrlFilters,
} from '@/shared/data';
import { PatientCard } from '@/shared/medical';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenuItem,
} from '@/shared/ui/dropdown-menu';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { appToast } from '@/services/api/toast';

const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Observation', value: 'observation' },
  { label: 'Inactive', value: 'inactive' },
];

export default function PatientsPage() {
  const filters = useUrlFilters();
  const query = usePatients({ status: filters.status || undefined });
  const patients = query.data ?? [];

  const tableState = useTableState<ProfessionalPatientSummary>({
    data: patients,
    sort: filters.sort,
    dir: filters.dir,
    page: filters.page,
    pageSize: filters.pageSize,
    searchQuery: filters.q,
    getSearchText: (row) => `${row.fullName} ${row.mrn} ${row.department ?? ''}`,
    getSortValue: (row, column) => {
      if (column === 'name') return row.fullName;
      if (column === 'lastVisit') return row.lastVisit ?? '';
      if (column === 'department') return row.department ?? '';
      return row.status;
    },
    filterFn: (row) => !filters.status || row.status === filters.status,
  });

  const selection = useRowSelection(tableState.rows.map((row) => row.id));

  const activeFilters = useMemo(() => {
    const chips = [];
    if (filters.q) chips.push({ key: 'q', label: 'Search', value: filters.q });
    if (filters.status) {
      chips.push({
        key: 'status',
        label: 'Status',
        value: STATUS_OPTIONS.find((option) => option.value === filters.status)?.label ?? filters.status,
      });
    }
    return chips;
  }, [filters.q, filters.status]);

  function handleSort(columnId: string) {
    const nextDir =
      filters.sort === columnId && filters.dir === 'asc' ? 'desc' : 'asc';
    filters.setMany({ sort: columnId, dir: nextDir });
  }

  const exportRows = tableState.rows.map((row) => ({
    name: row.fullName,
    mrn: row.mrn,
    status: row.status,
    department: row.department ?? '',
    lastVisit: row.lastVisit ?? '',
  }));

  return (
    <DataPageLayout
      title="Patients"
      subtitle="Search, filter, and manage your assigned patient panel."
      lastUpdated={query.dataUpdatedAt ? new Date(query.dataUpdatedAt).toLocaleString() : undefined}
      primaryAction={
        <LoadingButton>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Patient
        </LoadingButton>
      }
      metrics={
        <>
          <StatCard label="Total Patients" value={patients.length} icon={Users} />
          <MetricCard
            title="Active"
            value={patients.filter((row) => row.status === 'active').length}
            status="success"
          />
          <MetricCard
            title="Under Observation"
            value={patients.filter((row) => row.status === 'observation').length}
            status="warning"
          />
          <MetricCard
            title="Inactive"
            value={patients.filter((row) => row.status === 'inactive').length}
            status="neutral"
          />
        </>
      }
      toolbar={
        <DataToolbar
          search={
            <SearchBar
              defaultValue={filters.q}
              onSearch={(value) => filters.setParam('q', value || null)}
              placeholder="Search patients…"
              loading={query.isFetching}
            />
          }
          filters={
            <FilterPanel activeCount={filters.activeFilterCount}>
              <div className="space-y-2">
                <Label htmlFor="patient-status-filter">Status</Label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) =>
                    filters.setParam('status', value === 'all' ? null : value)
                  }
                >
                  <SelectTrigger id="patient-status-filter">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value || 'all'} value={option.value || 'all'}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FilterPanel>
          }
          bulkActions={
            <BulkActionBar
              selectedCount={selection.selectedCount}
              onClear={selection.clearSelection}
              actions={
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      appToast.info({
                        title: 'Export queued',
                        description: `${selection.selectedCount} patients selected for export.`,
                      })
                    }
                  >
                    Export Selected
                  </Button>
                  <Button size="sm" variant="outline">
                    Notify
                  </Button>
                </>
              }
            />
          }
          actions={
            <ExportMenu
              filename="patients"
              rows={exportRows}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'mrn', label: 'MRN' },
                { key: 'status', label: 'Status' },
                { key: 'department', label: 'Department' },
                { key: 'lastVisit', label: 'Last Visit' },
              ]}
            />
          }
          onRefresh={() => void query.refetch()}
          refreshing={query.isFetching}
        />
      }
      filters={
        <FilterChips
          filters={activeFilters}
          onRemove={(key) => filters.setParam(key, null)}
          onClearAll={filters.clearFilters}
        />
      }
    >
      <DataTable
        caption="Professional patient list"
        data={tableState.rows}
        getRowId={(row) => row.id}
        loading={query.isLoading}
        error={query.isError}
        onRetry={() => void query.refetch()}
        selectable
        selectedIds={selection.selectedIds}
        onToggleRow={selection.toggleRow}
        onToggleAll={selection.toggleAll}
        isAllSelected={selection.isAllSelected}
        isIndeterminate={selection.isIndeterminate}
        renderMobileCard={(row) => (
          <PatientCard
            fullName={row.fullName}
            mrn={row.mrn}
            status={row.status === 'active' ? 'stable' : row.status === 'observation' ? 'observation' : 'neutral'}
          />
        )}
        rowActions={(row) => (
          <>
            <DropdownMenuItem asChild>
              <Link href={`${ROUTES.professional.root}/patient/${row.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Record
              </Link>
            </DropdownMenuItem>
          </>
        )}
        columns={[
          {
            id: 'name',
            sortable: true,
            header: (
              <SortableColumnHeader
                label="Patient"
                columnId="name"
                activeSort={filters.sort}
                direction={filters.dir}
                onSort={handleSort}
              />
            ),
            cell: (row) => (
              <div>
                <p className="font-medium">
                  <HighlightMatch text={row.fullName} query={filters.q} />
                </p>
                <p className="text-xs text-muted-foreground">{row.mrn}</p>
              </div>
            ),
          },
          {
            id: 'department',
            header: (
              <SortableColumnHeader
                label="Department"
                columnId="department"
                activeSort={filters.sort}
                direction={filters.dir}
                onSort={handleSort}
              />
            ),
            cell: (row) => row.department ?? '—',
          },
          {
            id: 'status',
            header: 'Status',
            cell: (row) => (
              <StatusBadge
                status={
                  row.status === 'active'
                    ? 'stable'
                    : row.status === 'observation'
                      ? 'observation'
                      : 'neutral'
                }
              />
            ),
          },
          {
            id: 'lastVisit',
            header: (
              <SortableColumnHeader
                label="Last Visit"
                columnId="lastVisit"
                activeSort={filters.sort}
                direction={filters.dir}
                onSort={handleSort}
              />
            ),
            cell: (row) => row.lastVisit ?? '—',
          },
        ]}
        footer={
          <DataPagination
            page={tableState.page}
            pageSize={tableState.pageSize}
            total={tableState.total}
            onPageChange={(page) => filters.setParam('page', String(page))}
            onPageSizeChange={(pageSize) => filters.setParam('pageSize', String(pageSize))}
          />
        }
      />
    </DataPageLayout>
  );
}
