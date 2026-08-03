import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import {
  useBedBoard,
  useReleaseBed,
  useUpdateBedStatus,
} from '@/features/beds/hooks/use-beds';
import { toBedRow } from '@/services/beds/types';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

type BedRow = ReturnType<typeof toBedRow>;

const statusVariant = {
  available: 'default',
  occupied: 'secondary',
  cleaning: 'outline',
  reserved: 'destructive',
} as const;

const columns: DataTableColumn<BedRow>[] = [
  { id: 'ward', header: 'Ward', cell: (row) => row.ward },
  { id: 'bed', header: 'Bed', cell: (row) => row.bed },
  { id: 'type', header: 'Type', cell: (row) => row.type },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <PortalStatusBadge
        label={row.status}
        variant={statusVariant[row.status]}
      />
    ),
  },
  { id: 'patient', header: 'Patient', cell: (row) => row.patient ?? '—' },
];

export default function BedManagementPage() {
  const boardQuery = useBedBoard();
  const updateStatus = useUpdateBedStatus();
  const releaseBed = useReleaseBed();

  const beds = (boardQuery.data?.beds ?? []).map(toBedRow);
  const summary = boardQuery.data?.summary;

  return (
    <PageShell
      title="Bed Management"
      subtitle="Real-time bed inventory and assignment status."
      primaryAction={
        <PortalActionButton label="Assign bed" successTitle="Bed assigned" />
      }
    >
      <PortalMetricsGrid
        metrics={[
          {
            title: 'Available',
            value: summary?.available ?? 0,
            status: 'stable',
          },
          {
            title: 'Occupied',
            value: summary?.occupied ?? 0,
            status: 'observation',
          },
          {
            title: 'Cleaning',
            value: summary?.cleaning ?? 0,
          },
          {
            title: 'Reserved',
            value: summary?.reserved ?? 0,
          },
        ]}
      />

      <PortalDataTableSection
        title="Bed inventory"
        description="All wards and bed types across the facility."
        actionLabel="Refresh status"
        columns={columns}
        data={beds}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() => {
                updateStatus.mutate({
                  bedId: row.id,
                  input: { status: 'available' },
                });
              }}
            >
              Mark available
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (row.status === 'occupied') {
                  releaseBed.mutate(row.id);
                } else {
                  updateStatus.mutate({
                    bedId: row.id,
                    input: { status: 'cleaning' },
                  });
                }
              }}
            >
              Schedule cleaning
            </DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
