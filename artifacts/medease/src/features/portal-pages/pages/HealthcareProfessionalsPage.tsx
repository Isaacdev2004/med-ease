import { useMemo } from 'react';

import { useDirectory } from '@/features/directory';
import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import type { ProfessionalRow } from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';
import { Stethoscope } from 'lucide-react';

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

function mapStatus(
  status: string,
): ProfessionalRow['status'] {
  if (status === 'critical' || status === 'error') return 'inactive';
  if (status === 'pending' || status === 'observation') return 'on-leave';
  return 'active';
}

export default function HealthcareProfessionalsPage() {
  const query = useDirectory({
    type: 'professional',
    page: 1,
    pageSize: 100,
  });

  const professionals = useMemo<ProfessionalRow[]>(() => {
    return (query.data?.items ?? []).map((provider) => ({
      id: provider.id,
      name: provider.name,
      specialty:
        provider.specialty ||
        provider.medicalSpecialty ||
        provider.title ||
        '—',
      license: provider.finessNumber || provider.qualifications?.[0] || '—',
      facility: provider.address?.city
        ? `${provider.address.city}${provider.address.department ? `, ${provider.address.department}` : ''}`
        : '—',
      status: mapStatus(provider.status),
    }));
  }, [query.data?.items]);

  const active = professionals.filter((row) => row.status === 'active').length;
  const pending = professionals.filter((row) => row.status === 'on-leave').length;

  if (query.isLoading) {
    return <LoadingView label="Loading healthcare professionals…" />;
  }

  if (query.isError) {
    return (
      <PageShell
        title="Healthcare Professionals"
        subtitle="Manage credentialed staff across the organization."
      >
        <EmptyState
          icon={Stethoscope}
          title="Unable to load professionals"
          description="The directory API did not return providers. Confirm the API is reachable."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Healthcare Professionals"
      subtitle="Credentialed staff from the live provider directory."
      primaryAction={
        <PortalActionButton
          label="Invite professional"
          successTitle="Invitation sent"
        />
      }
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          {
            title: 'Total staff',
            value: query.data?.total ?? professionals.length,
          },
          { title: 'Active', value: active, status: 'stable' },
          {
            title: 'Pending / leave',
            value: pending,
            status: pending > 0 ? 'observation' : 'stable',
          },
        ]}
      />

      <PortalDataTableSection
        title="Professional directory"
        description="Physicians, nurses, and allied health providers."
        actionLabel="Export roster"
        columns={columns}
        data={professionals}
        getRowId={(row) => row.id}
        rowActions={() => (
          <>
            <DropdownMenuItem>View credentials</DropdownMenuItem>
            <DropdownMenuItem disabled>Activate account</DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
