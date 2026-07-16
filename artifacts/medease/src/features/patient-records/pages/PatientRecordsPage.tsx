import { PatientRecordsShell } from '@/features/patient-records/components/PatientRecordsShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';
import { useLocation } from 'wouter';

export default function PatientRecordsPage() {
  const [location] = useLocation();
  const basePath = resolveModuleBasePath(location, 'records');
  return <PatientRecordsShell basePath={basePath} />;
}
