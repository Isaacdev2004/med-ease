import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';

import { AppointmentFiltersBar } from '@/features/appointments/components/ScheduleComponents';
import { AppointmentSectionContent } from '@/features/appointments/components/AppointmentSections';
import { AppointmentTabs, getAppointmentSectionFromPath } from '@/features/appointments/components/AppointmentTabs';
import { useAppointmentPermissions } from '@/features/appointments/hooks/use-appointment-permissions';
import { usePatientAppointmentFilters } from '@/features/appointments/hooks/use-appointments';
import type { AppointmentFilters } from '@/services/appointments/types';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { Button } from '@/shared/ui/button';
import { Link } from 'wouter';

interface AppointmentsShellProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
  title?: string;
}

export function AppointmentsShell({
  basePath,
  variant = 'patient',
  title = 'Appointments',
}: AppointmentsShellProps) {
  const [location] = useLocation();
  const perms = useAppointmentPermissions();
  const patientResolve = usePatientAppointmentFilters();
  const [filters, setFilters] = useState<AppointmentFilters>({});
  const section = getAppointmentSectionFromPath(location);

  const scopedFilters = useMemo(() => {
    if (variant === 'patient' && patientResolve.data) {
      return { ...filters, patientId: patientResolve.data };
    }
    return filters;
  }, [filters, patientResolve.data, variant]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view appointments." />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Loading appointments…" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Enterprise scheduling — book, manage, and track healthcare appointments."
      primaryAction={
        perms.canBook ? (
          <Button asChild>
            <Link href={`${basePath}/book`}>Book Appointment</Link>
          </Button>
        ) : undefined
      }
      toolbar={
        section !== 'book' ? (
          <AppointmentFiltersBar
            filters={scopedFilters}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
            onSearch={(q) => setFilters((prev) => ({ ...prev, q: q || undefined }))}
          />
        ) : undefined
      }
    >
      <div className="space-y-6">
        <AppointmentTabs basePath={basePath} variant={variant} />
        <AppointmentSectionContent
          section={section}
          filters={scopedFilters}
          patientId={patientResolve.data ?? undefined}
        />
      </div>
    </PageShell>
  );
}
