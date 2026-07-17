import { useLocation } from 'wouter';

import { TelemedicineShell } from '@/features/telemedicine/components/TelemedicineShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

function resolvePatientBasePath(location: string) {
  if (location.includes('/device-check'))
    return resolveModuleBasePath(location, 'telemedicine/device-check');
  if (location.includes('/upcoming'))
    return resolveModuleBasePath(location, 'telemedicine/upcoming');
  if (location.includes('/history'))
    return resolveModuleBasePath(location, 'telemedicine/history');
  return resolveModuleBasePath(location, 'telemedicine');
}

export default function PatientTelemedicinePage() {
  const [location] = useLocation();
  const basePath = resolvePatientBasePath(location);
  const title = location.includes('/device-check')
    ? 'Device Check'
    : location.includes('/upcoming')
      ? 'Upcoming Visits'
      : location.includes('/history')
        ? 'Visit History'
        : 'Telemedicine';
  return (
    <TelemedicineShell basePath={basePath} variant="patient" title={title} />
  );
}
