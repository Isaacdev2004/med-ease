import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { MOCK_FACILITIES, type FacilityRow } from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<FacilityRow>[] = [
  { id: 'name', header: 'Facility', cell: (row) => row.name },
  { id: 'type', header: 'Type', cell: (row) => row.type },
  { id: 'address', header: 'Address', cell: (row) => row.address },
  { id: 'beds', header: 'Beds', cell: (row) => (row.beds > 0 ? row.beds : '—') },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <PortalStatusBadge
        label={row.status}
        variant={row.status === 'closed' ? 'destructive' : row.status === 'limited' ? 'secondary' : 'outline'}
      />
    ),
  },
];

export default function TransportFacilitiesPage() {
  const [facilities, setFacilities] = useState(MOCK_FACILITIES);

  const operational = facilities.filter((row) => row.status === 'operational').length;

  return (
    <PageShell
      title="Facilities"
      subtitle="Partner hospitals, clinics, and transfer destinations."
      primaryAction={<PortalActionButton label="Add facility" successTitle="Facility added" />}
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Partner facilities', value: facilities.length },
          { title: 'Operational', value: operational, status: 'stable' },
          { title: 'Limited capacity', value: facilities.filter((f) => f.status === 'limited').length, status: 'observation' },
        ]}
      />

      <PortalDataTableSection
        title="Facility directory"
        description="Pickup and drop-off locations for patient transport."
        actionLabel="Sync directory"
        columns={columns}
        data={facilities}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem>View contacts</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setFacilities((prev) =>
                  prev.map((item) =>
                    item.id === row.id ? { ...item, status: 'operational' as const } : item,
                  ),
                );
              }}
            >
              Mark operational
            </DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
