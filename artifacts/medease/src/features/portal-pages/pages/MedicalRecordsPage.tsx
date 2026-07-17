import {
  PortalActionButton,
  PortalDataTableSection,
  PortalListCard,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import {
  MOCK_PATIENTS,
  type PatientRow,
} from '@/features/portal-pages/data/mock-data';
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
          { title: 'Active charts', value: '12,480', status: 'stable' },
          { title: 'Pending merges', value: '14', status: 'observation' },
          { title: 'Records updated today', value: '326', status: 'stable' },
        ]}
      />
      <PortalDataTableSection
        title="Patient charts"
        description="Recently accessed medical records."
        columns={columns}
        data={MOCK_PATIENTS}
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
        items={MOCK_PATIENTS.slice(0, 3).map((p) => ({
          id: p.id,
          primary: p.name,
          secondary: `MRN ${p.mrn} · ${p.ward}`,
          badge: p.status,
        }))}
      />
    </PageShell>
  );
}
