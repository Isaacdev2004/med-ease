import { useLocation } from 'wouter';

import { ReportDetailSection } from '@/features/radiology/components/RadiologySections';
import { RadiologyShell } from '@/features/radiology/components/RadiologyShell';
import { PageShell } from '@/shared/components';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function PatientRadiologyPage() {
  const [location] = useLocation();
  if (location.includes('/radiology/report/')) {
    return (
      <PageShell title="Diagnostic Report">
        <ReportDetailSection />
      </PageShell>
    );
  }
  const basePath = resolveModuleBasePath(location, 'radiology');
  return <RadiologyShell basePath={basePath} variant="patient" title="My Imaging" />;
}
