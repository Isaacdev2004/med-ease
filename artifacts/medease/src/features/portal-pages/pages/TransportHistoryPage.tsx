import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import {
  MOCK_TRANSPORT_HISTORY,
  type TransportHistoryRow,
} from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<TransportHistoryRow>[] = [
  { id: 'patient', header: 'Patient', cell: (row) => row.patient },
  { id: 'route', header: 'Route', cell: (row) => row.route },
  { id: 'completedAt', header: 'Completed', cell: (row) => row.completedAt },
  { id: 'duration', header: 'Duration', cell: (row) => row.duration },
  {
    id: 'outcome',
    header: 'Outcome',
    cell: (row) => (
      <PortalStatusBadge
        label={row.outcome}
        variant={
          row.outcome === 'delayed'
            ? 'destructive'
            : row.outcome === 'cancelled'
              ? 'secondary'
              : 'outline'
        }
      />
    ),
  },
];

export default function TransportHistoryPage() {
  const [history, setHistory] = useState(MOCK_TRANSPORT_HISTORY);

  const onTime = history.filter((row) => row.outcome === 'on-time').length;
  const onTimeRate = Math.round((onTime / history.length) * 100);

  return (
    <PageShell
      title="History"
      subtitle="Completed transport runs and performance metrics."
      primaryAction={
        <PortalActionButton
          label="Export history"
          successTitle="History exported"
        />
      }
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Total runs', value: history.length },
          {
            title: 'On-time rate',
            value: `${onTimeRate}%`,
            status: onTimeRate >= 90 ? 'stable' : 'observation',
          },
          { title: 'Avg. duration', value: '42 min' },
        ]}
      />

      <PortalDataTableSection
        title="Transport log"
        description="Historical patient movements and outcomes."
        actionLabel="Generate report"
        columns={columns}
        data={history}
        getRowId={(row) => row.id}
        rowActions={() => (
          <>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setHistory((prev) => [...prev]);
              }}
            >
              Flag for review
            </DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
