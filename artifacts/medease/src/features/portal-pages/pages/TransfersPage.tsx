import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import {
  useCancelTransfer,
  useCompleteTransfer,
  useTransfers,
} from '@/features/admissions/hooks/use-admissions';
import { toTransferRow } from '@/services/admissions/types';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

type TransferRow = ReturnType<typeof toTransferRow>;

const columns: DataTableColumn<TransferRow>[] = [
  { id: 'patient', header: 'Patient', cell: (row) => row.patient },
  { id: 'from', header: 'From', cell: (row) => row.fromWard },
  { id: 'to', header: 'To', cell: (row) => row.toWard },
  { id: 'requestedAt', header: 'Requested', cell: (row) => row.requestedAt },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <PortalStatusBadge label={row.status} />,
  },
];

export default function TransfersPage() {
  const transfersQuery = useTransfers();
  const completeTransfer = useCompleteTransfer();
  const cancelTransfer = useCancelTransfer();

  const transfers = (transfersQuery.data ?? []).map(toTransferRow);
  const active = transfers.filter(
    (row) => row.status === 'requested' || row.status === 'in-transit',
  ).length;
  const completed = transfers.filter((row) => row.status === 'completed').length;

  return (
    <PageShell
      title="Transfers"
      subtitle="Coordinate inter-ward and inter-facility patient transfers."
      primaryAction={
        <PortalActionButton
          label="Request transfer"
          successTitle="Transfer requested"
        />
      }
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Active transfers', value: active, status: 'observation' },
          { title: 'Completed', value: completed, status: 'stable' },
          { title: 'Total', value: transfers.length },
        ]}
      />

      <PortalDataTableSection
        title="Transfer requests"
        description="Track status from request through completion."
        actionLabel="Refresh"
        columns={columns}
        data={transfers}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() => {
                completeTransfer.mutate(row.id);
              }}
            >
              Mark complete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                cancelTransfer.mutate(row.id);
              }}
            >
              Cancel transfer
            </DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
