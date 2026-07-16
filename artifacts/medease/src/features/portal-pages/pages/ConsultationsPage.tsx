import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { MOCK_CONSULTATIONS, type ConsultationRow } from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<ConsultationRow>[] = [
  { id: 'patient', header: 'Patient', cell: (row) => row.patient },
  { id: 'specialty', header: 'Specialty', cell: (row) => row.specialty },
  { id: 'provider', header: 'Provider', cell: (row) => row.provider },
  { id: 'scheduledAt', header: 'Scheduled', cell: (row) => row.scheduledAt },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <PortalStatusBadge label={row.status} />,
  },
];

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState(MOCK_CONSULTATIONS);

  const today = consultations.length;
  const inProgress = consultations.filter((row) => row.status === 'in-progress').length;

  return (
    <PageShell
      title="Consultations"
      subtitle="Specialist consults and referral follow-ups."
      primaryAction={<PortalActionButton label="Schedule consult" successTitle="Consultation scheduled" />}
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Today', value: today },
          { title: 'In progress', value: inProgress, status: 'observation' },
          { title: 'Pending notes', value: 2, status: 'observation' },
        ]}
      />

      <PortalDataTableSection
        title="Consultation schedule"
        description="Today's consults across specialties."
        actionLabel="Add note template"
        columns={columns}
        data={consultations}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() => {
                setConsultations((prev) =>
                  prev.map((item) =>
                    item.id === row.id ? { ...item, status: 'completed' as const } : item,
                  ),
                );
              }}
            >
              Complete consult
            </DropdownMenuItem>
            <DropdownMenuItem>Reschedule</DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
