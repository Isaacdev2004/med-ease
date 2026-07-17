import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { TelemedicineSectionContent } from '@/features/telemedicine/components/TelemedicineSections';
import {
  TelemedicineTabs,
  getTelemedicineSectionFromPath,
} from '@/features/telemedicine/components/TelemedicineTabs';
import { useTelemedicineContext } from '@/features/telemedicine/hooks/use-telemedicine';
import { useTelemedicinePermissions } from '@/features/telemedicine/hooks/use-telemedicine-permissions';
import type { TelemedicineFilters } from '@/services/telemedicine/types';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface TelemedicineShellProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
  title?: string;
  patientId?: string;
  clinicianId?: string;
  sessionId?: string;
}

function extractSessionId(pathname: string) {
  const match = pathname.match(/\/session\/([^/]+)/);
  return match?.[1];
}

export function TelemedicineShell({
  basePath,
  variant = 'patient',
  title = 'Telemedicine',
  patientId: explicitPatientId,
  clinicianId: explicitClinicianId,
  sessionId: explicitSessionId,
}: TelemedicineShellProps) {
  const [location] = useLocation();
  const perms = useTelemedicinePermissions();
  const patientResolve = useTelemedicineContext();
  const section = getTelemedicineSectionFromPath(location);
  const sessionId = explicitSessionId ?? extractSessionId(location);

  const scopedFilters = useMemo((): TelemedicineFilters => {
    const patientId =
      explicitPatientId ??
      (variant === 'patient' ? (patientResolve.data ?? undefined) : undefined);
    const clinicianId =
      explicitClinicianId ?? (variant === 'clinician' ? 'prov-001' : undefined);
    return {
      ...(patientId ? { patientId } : {}),
      ...(clinicianId ? { clinicianId } : {}),
    };
  }, [explicitPatientId, explicitClinicianId, patientResolve.data, variant]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view telemedicine."
        />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Loading telemedicine…" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Secure virtual consultations, waiting room, clinical chat, documentation, and session recordings."
    >
      <div className="space-y-6">
        <TelemedicineTabs basePath={basePath} variant={variant} />
        <TelemedicineSectionContent
          section={section}
          filters={scopedFilters}
          sessionId={sessionId}
        />
      </div>
    </PageShell>
  );
}
