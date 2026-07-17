import { useLocation } from 'wouter';

import { CarePlansShell } from '@/features/care-plans/components/CarePlansShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function PatientCarePlanPage() {
  const [location] = useLocation();
  const basePath = resolveModuleBasePath(location, 'care-plan');
  return (
    <CarePlansShell
      basePath={basePath}
      variant="patient"
      title="My Care Plan"
    />
  );
}
