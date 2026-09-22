import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';

import { AppointmentFiltersBar } from '@/features/appointments/components/ScheduleComponents';
import { AppointmentSectionContent } from '@/features/appointments/components/AppointmentSections';
import {
  AppointmentTabs,
  getAppointmentSectionFromPath,
} from '@/features/appointments/components/AppointmentTabs';
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
  title = 'Rendez-vous',
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
        <EmptyState
          title="Accès refusé"
          description="Vous n’avez pas l’autorisation de consulter les rendez-vous."
        />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Chargement des rendez-vous…" />
      </PageShell>
    );
  }

  if (
    variant === 'patient' &&
    section === 'book' &&
    !patientResolve.data
  ) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Profil patient indisponible"
          description="Impossible de lier votre compte à un dossier patient. Reconnectez-vous ou contactez le support."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Réservez, consultez et suivez vos rendez-vous de santé."
      primaryAction={
        perms.canBook ? (
          <Button asChild>
            <Link href={`${basePath}/book`}>Prendre rendez-vous</Link>
          </Button>
        ) : undefined
      }
      toolbar={
        section !== 'book' ? (
          <AppointmentFiltersBar
            filters={scopedFilters}
            onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
            onSearch={(q) =>
              setFilters((prev) => ({ ...prev, q: q || undefined }))
            }
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
