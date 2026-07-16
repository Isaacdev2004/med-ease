import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { MOCK_DRIVERS, type DriverRow } from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<DriverRow>[] = [
  { id: 'name', header: 'Driver', cell: (row) => row.name },
  { id: 'license', header: 'License', cell: (row) => row.license },
  { id: 'shift', header: 'Shift', cell: (row) => row.shift },
  { id: 'certifications', header: 'Certifications', cell: (row) => row.certifications },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <PortalStatusBadge
        label={row.status}
        variant={row.status === 'on-duty' ? 'default' : 'outline'}
      />
    ),
  },
];

export default function TransportDriversPage() {
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);

  const onDuty = drivers.filter((row) => row.status === 'on-duty').length;

  return (
    <PageShell
      title="Drivers"
      subtitle="EMT and driver roster with shift assignments."
      primaryAction={<PortalActionButton label="Add driver" successTitle="Driver profile created" />}
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Total drivers', value: drivers.length },
          { title: 'On duty', value: onDuty, status: 'stable' },
          { title: 'On call', value: drivers.filter((d) => d.status === 'on-call').length },
        ]}
      />

      <PortalDataTableSection
        title="Driver roster"
        description="Certifications, shifts, and availability."
        actionLabel="Publish schedule"
        columns={columns}
        data={drivers}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() => {
                setDrivers((prev) =>
                  prev.map((item) =>
                    item.id === row.id ? { ...item, status: 'on-duty' as const } : item,
                  ),
                );
              }}
            >
              Clock in
            </DropdownMenuItem>
            <DropdownMenuItem>Assign vehicle</DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
