import { useLocation } from 'wouter';

import { TelemedicineShell } from '@/features/telemedicine/components/TelemedicineShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type FacilitySegment = 'telemedicine' | 'sessions' | 'providers' | 'analytics';

function resolveSegment(location: string): FacilitySegment {
  if (location.includes('/sessions')) return 'sessions';
  if (location.includes('/providers')) return 'providers';
  if (location.includes('/analytics')) return 'analytics';
  return 'telemedicine';
}

export default function FacilityTelemedicinePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<FacilitySegment, string> = {
    telemedicine: 'Telemedicine',
    sessions: 'Virtual Sessions',
    providers: 'Telehealth Providers',
    analytics: 'Telemedicine Analytics',
  };
  return (
    <TelemedicineShell
      basePath={basePath}
      variant="facility"
      title={titles[segment]}
    />
  );
}
