import { useLocation } from 'wouter';

import { TelemedicineShell } from '@/features/telemedicine/components/TelemedicineShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type AdminSegment =
  'telemedicine' | 'analytics' | 'providers' | 'platform-health';

function resolveSegment(location: string): AdminSegment {
  if (location.includes('/platform-health')) return 'platform-health';
  if (location.includes('/telemedicine/analytics')) return 'analytics';
  if (location.includes('/providers')) return 'providers';
  return 'telemedicine';
}

function resolveBasePath(location: string, segment: AdminSegment) {
  if (segment === 'analytics')
    return resolveModuleBasePath(location, 'telemedicine/analytics');
  if (segment === 'platform-health')
    return resolveModuleBasePath(location, 'platform-health');
  return resolveModuleBasePath(
    location,
    segment === 'providers' ? 'providers' : 'telemedicine',
  );
}

export default function AdminTelemedicinePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  const basePath = resolveBasePath(location, segment);
  const titles: Record<AdminSegment, string> = {
    telemedicine: 'Telemedicine',
    analytics: 'Telemedicine Analytics',
    providers: 'Provider Management',
    'platform-health': 'Platform Health',
  };
  return (
    <TelemedicineShell
      basePath={basePath}
      variant="admin"
      title={titles[segment]}
    />
  );
}
