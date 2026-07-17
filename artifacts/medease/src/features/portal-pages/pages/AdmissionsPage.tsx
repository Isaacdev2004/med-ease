import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import {
  MOCK_ADMISSIONS,
  type AdmissionRow,
} from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<AdmissionRow>[] = [
  { id: 'patient', header: 'Patient', cell: (row) => row.patient },
  { id: 'mrn', header: 'MRN', cell: (row) => row.mrn },
  { id: 'ward', header: 'Ward', cell: (row) => row.ward },
  { id: 'admittedAt', header: 'Admitted', cell: (row) => row.admittedAt },
  {
    id: 'priority',
    header: 'Priority',
    cell: (row) => (
      <PortalStatusBadge
        label={row.priority}
        variant={row.priority === 'urgent' ? 'destructive' : 'secondary'}
      />
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <PortalStatusBadge label={row.status} />,
  },
];

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState(MOCK_ADMISSIONS);

  const pending = admissions.filter((row) => row.status === 'pending').length;
  const admitted = admissions.filter((row) => row.status === 'admitted').length;

  return (
    <PageShell
      title="Admissions"
      subtitle="Manage inpatient admissions and bed assignments."
      primaryAction={
        <PortalActionButton
          label="New admission"
          successTitle="Admission created"
        />
      }
    >
      <PortalMetricsGrid
        metrics={[
          { title: 'Pending', value: pending, status: 'observation' },
          { title: 'Admitted today', value: admitted, status: 'stable' },
          {
            title: 'Avg. wait time',
            value: '38 min',
            description: 'Emergency to ward',
          },
          { title: 'Capacity', value: '87%', status: 'observation' },
        ]}
      />

      <PortalDataTableSection
        title="Admission queue"
        description="Review and process incoming admissions."
        actionLabel="Export list"
        columns={columns}
        data={admissions}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() => {
                setAdmissions((prev) =>
                  prev.map((item) =>
                    item.id === row.id
                      ? { ...item, status: 'admitted' as const }
                      : item,
                  ),
                );
              }}
            >
              Admit patient
            </DropdownMenuItem>
            <DropdownMenuItem>Assign bed</DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
