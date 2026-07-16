import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { MOCK_VACCINATIONS, type VaccinationRow } from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<VaccinationRow>[] = [
  { id: 'vaccine', header: 'Vaccine', cell: (row) => row.vaccine },
  { id: 'dose', header: 'Dose', cell: (row) => row.dose },
  { id: 'administeredAt', header: 'Date', cell: (row) => row.administeredAt },
  { id: 'provider', header: 'Provider', cell: (row) => row.provider },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <PortalStatusBadge
        label={row.status}
        variant={row.status === 'overdue' ? 'destructive' : row.status === 'due' ? 'secondary' : 'outline'}
      />
    ),
  },
];

export default function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState(MOCK_VACCINATIONS);

  const due = vaccinations.filter((row) => row.status === 'due' || row.status === 'overdue').length;

  return (
    <PageShell
      title="Vaccinations"
      subtitle="Immunization history and upcoming vaccine schedules."
      primaryAction={<PortalActionButton label="Schedule vaccination" successTitle="Vaccination scheduled" />}
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Completed', value: vaccinations.filter((v) => v.status === 'completed').length, status: 'stable' },
          { title: 'Due / overdue', value: due, status: due > 0 ? 'observation' : 'stable' },
          { title: 'Next appointment', value: 'Aug 12', description: 'COVID-19 booster' },
        ]}
      />

      <PortalDataTableSection
        title="Immunization record"
        description="CDC-aligned vaccination history."
        actionLabel="Download record"
        columns={columns}
        data={vaccinations}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() => {
                setVaccinations((prev) =>
                  prev.map((item) =>
                    item.id === row.id
                      ? {
                          ...item,
                          status: 'completed' as const,
                          administeredAt: '2026-07-15',
                          provider: 'Central Hospital',
                        }
                      : item,
                  ),
                );
              }}
            >
              Record administration
            </DropdownMenuItem>
            <DropdownMenuItem>Print certificate</DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
