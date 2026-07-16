import { useLocation } from 'wouter';

import { RadiologyShell } from '@/features/radiology/components/RadiologyShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function FacilityRadiologyPage() {
  const [location] = useLocation();
  const segment = location.includes('dashboard') ? 'dashboard'
    : location.includes('imaging') ? 'imaging'
      : location.includes('devices') ? 'devices'
        : 'radiology';
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<string, string> = {
    radiology: 'Radiology Queue',
    dashboard: 'Imaging Dashboard',
    imaging: 'Imaging Studies',
    devices: 'Imaging Devices',
  };
  return <RadiologyShell basePath={basePath} variant="facility" title={titles[segment] ?? 'Radiology'} />;
}
