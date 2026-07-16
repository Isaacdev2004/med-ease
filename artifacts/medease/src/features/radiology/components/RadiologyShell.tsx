import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { RadiologySectionContent, StudyDetailSection } from '@/features/radiology/components/RadiologySections';
import { RadiologyTabs, getRadiologySectionFromPath } from '@/features/radiology/components/RadiologyTabs';
import { useRadiologyPermissions } from '@/features/radiology/hooks/use-radiology-permissions';
import { usePatientRadiologyContext } from '@/features/radiology/hooks/use-radiology';
import type { StudyFilters } from '@/services/radiology/types';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface RadiologyShellProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
  title?: string;
  patientId?: string;
}

export function RadiologyShell({
  basePath,
  variant = 'patient',
  title = 'Radiology',
  patientId: explicitPatientId,
}: RadiologyShellProps) {
  const [location] = useLocation();
  const perms = useRadiologyPermissions();
  const patientResolve = usePatientRadiologyContext();
  const sectionRaw = getRadiologySectionFromPath(location);
  const section = variant === 'patient' && sectionRaw === 'list' ? 'dashboard' : sectionRaw;

  const scopedFilters = useMemo((): StudyFilters => {
    const patientId = explicitPatientId ?? (variant === 'patient' ? patientResolve.data ?? undefined : undefined);
    return patientId ? { patientId } : {};
  }, [explicitPatientId, patientResolve.data, variant]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view radiology records." />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Loading imaging records…" />
      </PageShell>
    );
  }

  const isStudyDetail = variant === 'patient' && location.match(/\/radiology\/[^/]+$/) && !location.endsWith('/history');

  return (
    <PageShell title={title} subtitle="Medical imaging studies, diagnostic reports, DICOM viewer, and radiology analytics.">
      <div className="space-y-6">
        {!isStudyDetail && location.indexOf('/viewer/') < 0 && location.indexOf('/report/') < 0 ? (
          <RadiologyTabs basePath={basePath} variant={variant} />
        ) : null}
        {isStudyDetail ? <StudyDetailSection /> : <RadiologySectionContent section={section} filters={scopedFilters} />}
      </div>
    </PageShell>
  );
}
