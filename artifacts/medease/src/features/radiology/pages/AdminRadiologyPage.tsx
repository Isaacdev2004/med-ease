import { useLocation } from 'wouter';

import { RadiologyShell } from '@/features/radiology/components/RadiologyShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function AdminRadiologyPage() {
  const [location] = useLocation();
  const segment = location.includes('radiology/analytics') ? 'radiology/analytics'
    : location.includes('radiology/devices') ? 'radiology/devices'
      : location.includes('radiology/workload') ? 'radiology/workload'
        : 'radiology';
  const basePath = resolveModuleBasePath(location, segment.startsWith('radiology/') ? segment : 'radiology');
  const titles: Record<string, string> = {
    radiology: 'Radiology Overview',
    'radiology/analytics': 'Radiology Analytics',
    'radiology/devices': 'Device Management',
    'radiology/workload': 'Radiologist Workload',
  };
  return <RadiologyShell basePath={basePath} variant="admin" title={titles[segment] ?? 'Radiology'} />;
}
