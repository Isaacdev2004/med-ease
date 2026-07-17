import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import {
  MOCK_VEHICLES,
  type VehicleRow,
} from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<VehicleRow>[] = [
  { id: 'unit', header: 'Unit', cell: (row) => row.unit },
  { id: 'type', header: 'Type', cell: (row) => row.type },
  { id: 'capacity', header: 'Capacity', cell: (row) => row.capacity },
  { id: 'lastService', header: 'Last service', cell: (row) => row.lastService },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <PortalStatusBadge
        label={row.status}
        variant={
          row.status === 'maintenance' || row.status === 'offline'
            ? 'destructive'
            : 'outline'
        }
      />
    ),
  },
];

export default function TransportVehiclesPage() {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);

  const available = vehicles.filter((row) => row.status === 'available').length;

  return (
    <PageShell
      title="Vehicles"
      subtitle="Fleet inventory and maintenance status."
      primaryAction={
        <PortalActionButton
          label="Add vehicle"
          successTitle="Vehicle added to fleet"
        />
      }
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Fleet size', value: vehicles.length },
          { title: 'Available', value: available, status: 'stable' },
          {
            title: 'In maintenance',
            value: vehicles.filter((v) => v.status === 'maintenance').length,
            status: 'observation',
          },
        ]}
      />

      <PortalDataTableSection
        title="Fleet roster"
        description="Ambulances, vans, and specialty transport units."
        actionLabel="Schedule maintenance"
        columns={columns}
        data={vehicles}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() => {
                setVehicles((prev) =>
                  prev.map((item) =>
                    item.id === row.id
                      ? { ...item, status: 'available' as const }
                      : item,
                  ),
                );
              }}
            >
              Mark available
            </DropdownMenuItem>
            <DropdownMenuItem>Assign to route</DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
