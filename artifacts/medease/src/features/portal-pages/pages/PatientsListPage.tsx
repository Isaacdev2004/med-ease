import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import {
  MOCK_PATIENTS,
  type PatientRow,
} from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<PatientRow>[] = [
  { id: 'name', header: 'Patient', cell: (row) => row.name },
  { id: 'mrn', header: 'MRN', cell: (row) => row.mrn },
  { id: 'ward', header: 'Ward', cell: (row) => row.ward },
  { id: 'attending', header: 'Attending', cell: (row) => row.attending },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <PortalStatusBadge
        label={row.status}
        variant={row.status === 'critical' ? 'destructive' : 'outline'}
      />
    ),
  },
];

export default function PatientsListPage() {
  const [patients, setPatients] = useState(MOCK_PATIENTS);

  const critical = patients.filter((row) => row.status === 'critical').length;

  return (
    <PageShell
      title="Patients"
      subtitle="Active patient census and care team assignments."
      primaryAction={
        <PortalActionButton
          label="Register patient"
          successTitle="Patient registered"
        />
      }
    >
      <PortalMetricsGrid
        metrics={[
          { title: 'Active patients', value: patients.length },
          { title: 'Critical', value: critical, status: 'critical' },
          { title: 'New today', value: 3, status: 'stable' },
          { title: 'Discharges planned', value: 7 },
        ]}
      />

      <PortalDataTableSection
        title="Patient census"
        description="Search, filter, and open patient records."
        actionLabel="Export census"
        columns={columns}
        data={patients}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem>View chart</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setPatients((prev) =>
                  prev.map((item) =>
                    item.id === row.id
                      ? { ...item, status: 'discharged' as const }
                      : item,
                  ),
                );
              }}
            >
              Initiate discharge
            </DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
