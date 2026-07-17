import { useLocation } from 'wouter';

import { ViewerSection } from '@/features/radiology/components/RadiologySections';
import { RadiologyShell } from '@/features/radiology/components/RadiologyShell';
import { PageShell } from '@/shared/components';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

function getPatientId(pathname: string): string | undefined {
  const segments = pathname.split('/').filter(Boolean);
  const idx = segments.indexOf('patient');
  return idx >= 0 ? segments[idx + 1] : undefined;
}

export default function ProfessionalRadiologyPage() {
  const [location] = useLocation();

  if (location.includes('/viewer/')) {
    return (
      <PageShell title="Image Viewer">
        <ViewerSection />
      </PageShell>
    );
  }

  const patientId = getPatientId(location);
  if (
    location.includes('/patient/') &&
    patientId &&
    location.includes('/radiology')
  ) {
    const basePath = resolveModuleBasePath(location, 'radiology');
    return (
      <RadiologyShell
        basePath={basePath}
        variant="clinician"
        title="Patient Imaging"
        patientId={patientId}
      />
    );
  }

  const segment = location.includes('/worklist')
    ? 'worklist'
    : location.includes('/compare')
      ? 'compare'
      : location.includes('/reports')
        ? 'reports'
        : location.includes('/critical')
          ? 'radiology/critical'
          : 'radiology';
  const basePath = resolveModuleBasePath(
    location,
    segment.includes('/') ? segment : segment,
  );
  const title = location.includes('/worklist')
    ? 'Radiologist Worklist'
    : location.includes('/compare')
      ? 'Study Comparison'
      : location.includes('/reports')
        ? 'Reports'
        : location.includes('/critical')
          ? 'Critical Results'
          : 'Radiology';
  return (
    <RadiologyShell basePath={basePath} variant="clinician" title={title} />
  );
}
