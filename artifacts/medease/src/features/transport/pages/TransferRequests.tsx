import { useMemo } from 'react';
import { Ambulance, Clock, Route } from 'lucide-react';

import { useTransfers } from '@/features/transport/hooks/use-transfers';
import type { TransferRequest } from '@/features/transport/services/transport.service';
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
import { TransferCard } from '@/shared/medical';
import { Button } from '@/shared/ui/button';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';
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
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Completed', value: 'completed' },
];

const PRIORITY_BADGE = {
  routine: 'info',
  urgent: 'warning',
  critical: 'critical',
} as const;

export default function TransferRequestsPage() {
  const filters = useUrlFilters();
  const query = useTransfers({ status: filters.status || undefined });
  const transfers = query.data ?? [];

  const tableState = useTableState<TransferRequest>({
    data: transfers,
    sort: filters.sort,
    dir: filters.dir,
    page: filters.page,
    pageSize: filters.pageSize,
    searchQuery: filters.q,
    getSearchText: (row) =>
      `${row.patientName} ${row.fromFacility} ${row.toFacility} ${row.status}`,
    getSortValue: (row, column) => {
      if (column === 'patient') return row.patientName;
      if (column === 'requestedAt') return row.requestedAt;
      if (column === 'priority') return row.priority;
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
    patient: row.patientName,
    from: row.fromFacility,
    to: row.toFacility,
    status: row.status,
    priority: row.priority,
    requestedAt: new Date(row.requestedAt).toLocaleString(),
  }));

  return (
    <DataPageLayout
      title="Transfer Requests"
      subtitle="Monitor, assign, and coordinate patient transfers across facilities."
      primaryAction={
        <LoadingButton>
          <Route className="mr-2 h-4 w-4" />
          New Request
        </LoadingButton>
      }
      metrics={
        <>
          <StatCard
            label="Open Requests"
            value={transfers.filter((row) => row.status === 'pending').length}
            icon={Clock}
          />
          <MetricCard
            title="Critical Priority"
            value={transfers.filter((row) => row.priority === 'critical').length}
            status="critical"
            description="Requires immediate dispatch"
          />
          <MetricCard
            title="In Transit"
            value={transfers.filter((row) => row.status === 'in_transit').length}
            status="info"
          />
          <StatCard
            label="Fleet Ready"
            value="4 / 6"
            hint="2 vehicles in maintenance"
            icon={Ambulance}
          />
        </>
      }
      toolbar={
        <DataToolbar
          search={
            <SearchBar
              defaultValue={filters.q}
              onSearch={(value) => filters.setParam('q', value || null)}
              placeholder="Search transfers…"
              loading={query.isFetching}
            />
          }
          filters={
            <FilterPanel activeCount={filters.activeFilterCount}>
              <div className="space-y-2">
                <Label htmlFor="transfer-status-filter">Status</Label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) =>
                    filters.setParam('status', value === 'all' ? null : value)
                  }
                >
                  <SelectTrigger id="transfer-status-filter">
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    appToast.success({
                      title: 'Assignments updated',
                      description: `${selection.selectedCount} transfers assigned to dispatch.`,
                    })
                  }
                >
                  Assign Dispatch
                </Button>
              }
            />
          }
          actions={
            <ExportMenu
              filename="transfer-requests"
              rows={exportRows}
              columns={[
                { key: 'patient', label: 'Patient' },
                { key: 'from', label: 'From' },
                { key: 'to', label: 'To' },
                { key: 'status', label: 'Status' },
                { key: 'priority', label: 'Priority' },
                { key: 'requestedAt', label: 'Requested At' },
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
        caption="Transfer request queue"
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
          <TransferCard
            patientName={row.patientName}
            fromFacility={row.fromFacility}
            toFacility={row.toFacility}
            status={row.status === 'in_transit' ? 'transferred' : row.status === 'pending' ? 'pending' : 'stable'}
          />
        )}
        rowActions={() => (
          <>
            <DropdownMenuItem onClick={() => appToast.info({ title: 'Transfer details opened' })}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => appToast.success({ title: 'Transfer assigned' })}>
              Assign
            </DropdownMenuItem>
          </>
        )}
        columns={[
          {
            id: 'patient',
            header: (
              <SortableColumnHeader
                label="Patient"
                columnId="patient"
                activeSort={filters.sort}
                direction={filters.dir}
                onSort={handleSort}
              />
            ),
            cell: (row) => (
              <span className="font-medium">
                <HighlightMatch text={row.patientName} query={filters.q} />
              </span>
            ),
          },
          {
            id: 'route',
            header: 'Route',
            cell: (row) => (
              <div className="text-sm">
                <p>{row.fromFacility}</p>
                <p className="text-muted-foreground">→ {row.toFacility}</p>
              </div>
            ),
          },
          {
            id: 'priority',
            header: (
              <SortableColumnHeader
                label="Priority"
                columnId="priority"
                activeSort={filters.sort}
                direction={filters.dir}
                onSort={handleSort}
              />
            ),
            cell: (row) => (
              <StatusBadge status={PRIORITY_BADGE[row.priority]} />
            ),
          },
          {
            id: 'status',
            header: 'Status',
            cell: (row) => (
              <StatusBadge
                status={
                  row.status === 'pending'
                    ? 'pending'
                    : row.status === 'in_transit'
                      ? 'transferred'
                      : row.status === 'completed'
                        ? 'success'
                        : 'info'
                }
              />
            ),
          },
          {
            id: 'requestedAt',
            header: (
              <SortableColumnHeader
                label="Requested"
                columnId="requestedAt"
                activeSort={filters.sort}
                direction={filters.dir}
                onSort={handleSort}
              />
            ),
            cell: (row) => new Date(row.requestedAt).toLocaleString(),
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
