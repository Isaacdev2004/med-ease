import { useLocation } from 'wouter';

import { CarePlanSectionContent } from '@/features/care-plans/components/CarePlanSections';
import { getCarePlanSectionFromPath } from '@/features/care-plans/components/CarePlanTabs';
import { CarePlansShell } from '@/features/care-plans/components/CarePlansShell';
import { PageShell } from '@/shared/components';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

function getPatientId(pathname: string): string | undefined {
  const segments = pathname.split('/').filter(Boolean);
  const idx = segments.indexOf('patient');
  return idx >= 0 ? segments[idx + 1] : undefined;
}

export default function ProfessionalCarePlansPage() {
  const [location] = useLocation();
  const patientId = getPatientId(location);

  if (location.includes('/patient/') && patientId) {
    const section = getCarePlanSectionFromPath(location);
    if (location.includes('/tasks') || location.includes('/goals')) {
      return (
        <PageShell
          title={
            location.includes('/tasks') ? 'Patient Tasks' : 'Patient Goals'
          }
          subtitle={`Patient ${patientId}`}
        >
          <CarePlanSectionContent section={section} filters={{ patientId }} />
        </PageShell>
      );
    }
    const basePath = resolveModuleBasePath(location, 'care-plan');
    return (
      <CarePlansShell
        basePath={basePath}
        variant="clinician"
        title="Patient Care Plan"
        patientId={patientId}
      />
    );
  }

  const segment = location.includes('/pathways') ? 'pathways' : 'care-plans';
  const basePath = resolveModuleBasePath(location, segment);
  return (
    <CarePlansShell
      basePath={basePath}
      variant="clinician"
      title={segment === 'pathways' ? 'Clinical Pathways' : 'Care Plans'}
    />
  );
}
