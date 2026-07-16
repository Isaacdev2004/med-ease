import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { MOCK_MEDICATION_REQUESTS, type MedicationRequestRow } from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<MedicationRequestRow>[] = [
  { id: 'patient', header: 'Patient', cell: (row) => row.patient },
  { id: 'medication', header: 'Medication', cell: (row) => row.medication },
  { id: 'dosage', header: 'Dosage', cell: (row) => row.dosage },
  { id: 'requestedAt', header: 'Requested', cell: (row) => row.requestedAt },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => (
      <PortalStatusBadge
        label={row.status}
        variant={row.status === 'rejected' ? 'destructive' : row.status === 'pending' ? 'secondary' : 'outline'}
      />
    ),
  },
];

export default function MedicationRequestsPage() {
  const [requests, setRequests] = useState(MOCK_MEDICATION_REQUESTS);

  const pending = requests.filter((row) => row.status === 'pending').length;

  return (
    <PageShell
      title="Medication Requests"
      subtitle="Review, approve, and dispense medication orders."
      primaryAction={<PortalActionButton label="New request" successTitle="Medication request submitted" />}
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Pending review', value: pending, status: 'observation' },
          { title: 'Approved today', value: 18, status: 'stable' },
          { title: 'Dispensed', value: 14, status: 'stable' },
        ]}
      />

      <PortalDataTableSection
        title="Request queue"
        description="Pharmacy workflow for inpatient and outpatient orders."
        actionLabel="Batch approve"
        columns={columns}
        data={requests}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() => {
                setRequests((prev) =>
                  prev.map((item) =>
                    item.id === row.id ? { ...item, status: 'approved' as const } : item,
                  ),
                );
              }}
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setRequests((prev) =>
                  prev.map((item) =>
                    item.id === row.id ? { ...item, status: 'dispensed' as const } : item,
                  ),
                );
              }}
            >
              Mark dispensed
            </DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
