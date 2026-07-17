import { useLocation } from 'wouter';

import { MonitoringShell } from '@/features/patient-monitoring/components/MonitoringShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

function resolvePatientBasePath(location: string) {
  if (location.includes('/vitals'))
    return resolveModuleBasePath(location, 'vitals');
  if (location.includes('/observations'))
    return resolveModuleBasePath(location, 'observations');
  if (location.includes('/rpm')) return resolveModuleBasePath(location, 'rpm');
  return resolveModuleBasePath(location, 'monitoring');
}

export default function PatientMonitoringPage() {
  const [location] = useLocation();
  const basePath = resolvePatientBasePath(location);
  const title = location.includes('/vitals')
    ? 'Vital Signs'
    : location.includes('/observations')
      ? 'Observations'
      : location.includes('/rpm')
        ? 'Remote Monitoring'
        : 'My Monitoring';
  return (
    <MonitoringShell basePath={basePath} variant="patient" title={title} />
  );
}
