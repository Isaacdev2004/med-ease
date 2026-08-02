import { useMemo } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalListCard,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import type { PatientRow } from '@/features/portal-pages/data/mock-data';
import { mapPatientsToPortalRows, usePatients } from '@/features/patients';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';

const columns: DataTableColumn<PatientRow>[] = [
  { id: 'name', header: 'Patient', cell: (row) => row.name },
  { id: 'mrn', header: 'MRN', cell: (row) => row.mrn },
  { id: 'ward', header: 'Ward', cell: (row) => row.ward },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <PortalStatusBadge label={row.status} variant="outline" />,
  },
];

export default function MedicalRecordsPage() {
  const query = usePatients({ page: 1, pageSize: 100 });

  const patients = useMemo(
    () => mapPatientsToPortalRows(query.data?.items ?? []),
    [query.data?.items],
  );

  return (
    <PageShell
      title="Medical Records"
      subtitle="Search and open patient charts across the enterprise record index."
      primaryAction={
        <PortalActionButton
          label="New record request"
          successTitle="Record request submitted"
        />
      }
    >
      <PortalMetricsGrid
        metrics={[
          {
            title: 'Active charts',
            value: String(query.data?.total ?? patients.length),
            status: 'stable',
          },
          { title: 'Pending merges', value: '0', status: 'observation' },
          {
            title: 'Records loaded',
            value: String(patients.length),
            status: 'stable',
          },
        ]}
      />
      <PortalDataTableSection
        title="Patient charts"
        description="Recently accessed medical records."
        columns={columns}
        data={patients}
        getRowId={(row) => row.id}
        rowActions={() => (
          <PortalActionButton
            label="Open"
            variant="outline"
            successTitle="Chart opened"
          />
        )}
      />
      <PortalListCard
        title="Recent activity"
        items={patients.slice(0, 3).map((patient) => ({
          id: patient.id,
          primary: patient.name,
          secondary: `MRN ${patient.mrn} · ${patient.ward}`,
          badge: patient.status,
        }))}
      />
    </PageShell>
  );
}
