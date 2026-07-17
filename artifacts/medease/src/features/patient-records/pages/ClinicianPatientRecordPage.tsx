import { useLocation } from 'wouter';

import { PatientRecordsShell } from '@/features/patient-records/components/PatientRecordsShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

function getClinicianPatientId(pathname: string): string | undefined {
  const segments = pathname.split('/').filter(Boolean);
  const idx = segments.indexOf('patient');
  if (idx === -1) return undefined;
  return segments[idx + 1];
}

export default function ClinicianPatientRecordPage() {
  const [location] = useLocation();
  const patientId = getClinicianPatientId(location);
  const basePath = patientId
    ? `/patient/${patientId}`
    : resolveModuleBasePath(location, 'records');

  return <PatientRecordsShell basePath={basePath} routePatientId={patientId} />;
}
