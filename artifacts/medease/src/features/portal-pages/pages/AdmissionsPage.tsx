import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import {
  useAdmissionBoard,
  useAdmitPatient,
  useAssignAdmissionBed,
} from '@/features/admissions/hooks/use-admissions';
import { toAdmissionRow } from '@/services/admissions/types';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

type AdmissionRow = ReturnType<typeof toAdmissionRow>;

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
  const boardQuery = useAdmissionBoard();
  const admitPatient = useAdmitPatient();
  const assignBed = useAssignAdmissionBed();

  const admissions = (boardQuery.data?.admissions ?? []).map(toAdmissionRow);
  const summary = boardQuery.data?.summary;

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
          {
            title: 'Pending',
            value: summary?.pending ?? 0,
            status: 'observation',
          },
          {
            title: 'Admitted',
            value: summary?.admitted ?? 0,
            status: 'stable',
          },
          {
            title: 'Urgent',
            value: summary?.urgent ?? 0,
            description: 'High-priority queue',
          },
          {
            title: 'Discharged',
            value: summary?.discharged ?? 0,
            status: 'observation',
          },
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
                if (row.apiStatus === 'bed_assigned' || row.bedId) {
                  admitPatient.mutate(row.id);
                  return;
                }
                assignBed.mutate(
                  { admissionId: row.id },
                  {
                    onSuccess: () => admitPatient.mutate(row.id),
                  },
                );
              }}
            >
              Admit patient
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                assignBed.mutate({ admissionId: row.id });
              }}
            >
              Assign bed
            </DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
