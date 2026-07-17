import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import {
  MOCK_TRANSPORT_SCHEDULES,
  type TransportScheduleRow,
} from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<TransportScheduleRow>[] = [
  { id: 'patient', header: 'Patient', cell: (row) => row.patient },
  { id: 'pickup', header: 'Pickup', cell: (row) => row.pickup },
  { id: 'destination', header: 'Destination', cell: (row) => row.destination },
  { id: 'scheduledAt', header: 'Scheduled', cell: (row) => row.scheduledAt },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <PortalStatusBadge label={row.status} />,
  },
];

export default function TransportSchedulesPage() {
  const [schedules, setSchedules] = useState(MOCK_TRANSPORT_SCHEDULES);

  const active = schedules.filter(
    (row) => row.status === 'scheduled' || row.status === 'dispatched',
  ).length;

  return (
    <PageShell
      title="Schedules"
      subtitle="Patient transport pickups and route planning."
      primaryAction={
        <PortalActionButton
          label="Create schedule"
          successTitle="Transport scheduled"
        />
      }
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Active schedules', value: active, status: 'observation' },
          { title: 'Completed today', value: 8, status: 'stable' },
          { title: 'Avg. response', value: '12 min' },
        ]}
      />

      <PortalDataTableSection
        title="Transport schedule"
        description="Upcoming and in-progress patient movements."
        actionLabel="Optimize routes"
        columns={columns}
        data={schedules}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() => {
                setSchedules((prev) =>
                  prev.map((item) =>
                    item.id === row.id
                      ? { ...item, status: 'dispatched' as const }
                      : item,
                  ),
                );
              }}
            >
              Dispatch unit
            </DropdownMenuItem>
            <DropdownMenuItem>Reschedule</DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
