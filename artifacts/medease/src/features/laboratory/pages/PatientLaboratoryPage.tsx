import { useLocation } from 'wouter';

import { LaboratoryShell } from '@/features/laboratory/components/LaboratoryShell';
import { ResultDetailSection } from '@/features/laboratory/components/LaboratorySections';
import { PageShell } from '@/shared/components';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function PatientLaboratoryPage() {
  const [location] = useLocation();
  if (location.match(/\/laboratory\/[^/]+$/) && !location.endsWith('/orders') && !location.endsWith('/results') && !location.endsWith('/history') && !location.endsWith('/trends')) {
    return (
      <PageShell title="Lab Result Details">
        <ResultDetailSection />
      </PageShell>
    );
  }
  const basePath = resolveModuleBasePath(location, 'laboratory');
  return <LaboratoryShell basePath={basePath} variant="patient" title="My Laboratory" />;
}
