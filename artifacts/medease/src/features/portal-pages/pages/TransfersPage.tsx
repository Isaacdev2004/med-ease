import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { MOCK_TRANSFERS, type TransferRow } from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

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
  const [transfers, setTransfers] = useState(MOCK_TRANSFERS);

  const active = transfers.filter((row) => row.status === 'requested' || row.status === 'in-transit').length;

  return (
    <PageShell
      title="Transfers"
      subtitle="Coordinate inter-ward and inter-facility patient transfers."
      primaryAction={<PortalActionButton label="Request transfer" successTitle="Transfer requested" />}
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Active transfers', value: active, status: 'observation' },
          { title: 'Completed today', value: 6, status: 'stable' },
          { title: 'Avg. transfer time', value: '22 min' },
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
                setTransfers((prev) =>
                  prev.map((item) =>
                    item.id === row.id ? { ...item, status: 'completed' as const } : item,
                  ),
                );
              }}
            >
              Mark complete
            </DropdownMenuItem>
            <DropdownMenuItem>Cancel transfer</DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
