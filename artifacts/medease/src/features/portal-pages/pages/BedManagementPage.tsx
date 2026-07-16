import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { MOCK_BEDS, type BedRow } from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

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
    cell: (row) => <PortalStatusBadge label={row.status} variant={statusVariant[row.status]} />,
  },
  { id: 'patient', header: 'Patient', cell: (row) => row.patient ?? '—' },
];

export default function BedManagementPage() {
  const [beds, setBeds] = useState(MOCK_BEDS);

  const available = beds.filter((row) => row.status === 'available').length;
  const occupied = beds.filter((row) => row.status === 'occupied').length;

  return (
    <PageShell
      title="Bed Management"
      subtitle="Real-time bed inventory and assignment status."
      primaryAction={<PortalActionButton label="Assign bed" successTitle="Bed assigned" />}
    >
      <PortalMetricsGrid
        metrics={[
          { title: 'Available', value: available, status: 'stable' },
          { title: 'Occupied', value: occupied, status: 'observation' },
          { title: 'Cleaning', value: beds.filter((b) => b.status === 'cleaning').length },
          { title: 'Reserved', value: beds.filter((b) => b.status === 'reserved').length },
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
                setBeds((prev) =>
                  prev.map((item) =>
                    item.id === row.id ? { ...item, status: 'available' as const, patient: undefined } : item,
                  ),
                );
              }}
            >
              Mark available
            </DropdownMenuItem>
            <DropdownMenuItem>Schedule cleaning</DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
