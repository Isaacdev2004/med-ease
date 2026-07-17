import { useLocation } from 'wouter';

import { MonitoringShell } from '@/features/patient-monitoring/components/MonitoringShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type FacilitySegment = 'monitoring' | 'dashboard' | 'devices' | 'alerts';

function resolveSegment(location: string): FacilitySegment {
  if (location.includes('/dashboard')) return 'dashboard';
  if (location.includes('/devices')) return 'devices';
  if (location.includes('/alerts')) return 'alerts';
  return 'monitoring';
}

export default function FacilityMonitoringPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<FacilitySegment, string> = {
    monitoring: 'Ward Monitoring',
    dashboard: 'Monitoring Dashboard',
    devices: 'Bedside Devices',
    alerts: 'Clinical Alerts',
  };
  return (
    <MonitoringShell
      basePath={basePath}
      variant="facility"
      title={titles[segment]}
    />
  );
}
