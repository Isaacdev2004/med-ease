import { useLocation } from 'wouter';

import { LaboratoryShell } from '@/features/laboratory/components/LaboratoryShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

function getPatientId(pathname: string): string | undefined {
  const segments = pathname.split('/').filter(Boolean);
  const idx = segments.indexOf('patient');
  return idx >= 0 ? segments[idx + 1] : undefined;
}

export default function ProfessionalLaboratoryPage() {
  const [location] = useLocation();
  const patientId = getPatientId(location);

  if (location.includes('/patient/') && patientId && location.includes('/laboratory')) {
    const basePath = resolveModuleBasePath(location, 'laboratory');
    return <LaboratoryShell basePath={basePath} variant="clinician" title="Patient Laboratory" patientId={patientId} />;
  }

  const segment = location.includes('/critical') ? 'laboratory/critical' : location.includes('/orders') ? 'laboratory/orders' : location.includes('/results') ? 'laboratory/results' : 'laboratory';
  const basePath = resolveModuleBasePath(location, segment.split('/')[0]!);
  const fullBase = segment.includes('/') ? resolveModuleBasePath(location, segment) : basePath;
  const title = location.includes('/critical') ? 'Critical Results' : location.includes('/orders') ? 'Lab Orders' : location.includes('/results') ? 'Lab Results' : 'Laboratory';
  return <LaboratoryShell basePath={fullBase} variant="clinician" title={title} />;
}
