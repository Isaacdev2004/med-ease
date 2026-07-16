import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { MOCK_PROFESSIONALS, type ProfessionalRow } from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<ProfessionalRow>[] = [
  { id: 'name', header: 'Name', cell: (row) => row.name },
  { id: 'specialty', header: 'Specialty', cell: (row) => row.specialty },
  { id: 'license', header: 'License', cell: (row) => row.license },
  { id: 'facility', header: 'Facility', cell: (row) => row.facility },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <PortalStatusBadge
        label={row.status}
        variant={row.status === 'inactive' ? 'destructive' : 'outline'}
      />
    ),
  },
];

export default function HealthcareProfessionalsPage() {
  const [professionals, setProfessionals] = useState(MOCK_PROFESSIONALS);

  const active = professionals.filter((row) => row.status === 'active').length;

  return (
    <PageShell
      title="Healthcare Professionals"
      subtitle="Manage credentialed staff across the organization."
      primaryAction={<PortalActionButton label="Invite professional" successTitle="Invitation sent" />}
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Total staff', value: professionals.length },
          { title: 'Active', value: active, status: 'stable' },
          { title: 'Pending credentials', value: 4, status: 'observation' },
        ]}
      />

      <PortalDataTableSection
        title="Professional directory"
        description="Physicians, nurses, and allied health providers."
        actionLabel="Export roster"
        columns={columns}
        data={professionals}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem>View credentials</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setProfessionals((prev) =>
                  prev.map((item) =>
                    item.id === row.id ? { ...item, status: 'active' as const } : item,
                  ),
                );
              }}
            >
              Activate account
            </DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
