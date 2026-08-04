import { useMemo } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import type { PatientRow } from '@/features/portal-pages/data/mock-data';
import {
  mapPatientsToPortalRows,
  useArchivePatient,
  usePatients,
} from '@/features/patients';
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
  const query = usePatients({ page: 1, pageSize: 100 });
  const archivePatient = useArchivePatient();

  const patients = useMemo(
    () => mapPatientsToPortalRows(query.data?.items ?? []),
    [query.data?.items],
  );

  const critical = patients.filter((row) => row.status === 'critical').length;
  const active = patients.filter((row) => row.status !== 'discharged').length;
  const discharged = patients.filter((row) => row.status === 'discharged').length;

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
          { title: 'Active patients', value: active },
          { title: 'Critical', value: critical, status: 'critical' },
          {
            title: 'Total on record',
            value: query.data?.total ?? patients.length,
            status: 'stable',
          },
          {
            title: 'Discharged (page)',
            value: discharged,
            status: 'observation',
          },
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
              disabled={archivePatient.isPending}
              onClick={() => archivePatient.mutate(row.id)}
            >
              Initiate discharge
            </DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
