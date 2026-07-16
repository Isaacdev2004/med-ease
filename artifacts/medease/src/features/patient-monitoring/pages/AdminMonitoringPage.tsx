import { useLocation } from 'wouter';

import { MonitoringShell } from '@/features/patient-monitoring/components/MonitoringShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type AdminSegment = 'monitoring' | 'rpm' | 'devices';

function resolveSegment(location: string): AdminSegment {
  if (location.includes('/rpm')) return 'rpm';
  if (location.includes('/devices')) return 'devices';
  return 'monitoring';
}

export default function AdminMonitoringPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  const basePath = location.includes('/monitoring/analytics')
    ? resolveModuleBasePath(location, 'monitoring/analytics')
    : resolveModuleBasePath(location, segment === 'monitoring' && location.includes('/analytics') ? 'monitoring/analytics' : segment);
  const titles: Record<string, string> = {
    monitoring: 'Population Monitoring',
    rpm: 'RPM Program Administration',
    devices: 'Device Fleet Management',
    'monitoring/analytics': 'Monitoring Analytics',
  };
  const titleKey = location.includes('/monitoring/analytics') ? 'monitoring/analytics' : segment;
  return <MonitoringShell basePath={basePath} variant="admin" title={titles[titleKey] ?? 'Monitoring'} />;
}
