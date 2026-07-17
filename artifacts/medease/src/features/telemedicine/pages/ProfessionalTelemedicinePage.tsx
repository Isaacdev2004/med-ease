import { useLocation } from 'wouter';

import { TelemedicineShell } from '@/features/telemedicine/components/TelemedicineShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

function resolveProfessionalBasePath(location: string) {
  if (location.includes('/waiting-room'))
    return resolveModuleBasePath(location, 'waiting-room');
  if (location.includes('/current-session'))
    return resolveModuleBasePath(location, 'current-session');
  if (location.includes('/availability'))
    return resolveModuleBasePath(location, 'availability');
  if (location.includes('/telemedicine/history'))
    return resolveModuleBasePath(location, 'telemedicine/history');
  return resolveModuleBasePath(location, 'telemedicine');
}

function resolveTitle(location: string) {
  if (location.includes('/waiting-room')) return 'Waiting Room';
  if (location.includes('/current-session')) return 'Current Session';
  if (location.includes('/availability')) return 'Provider Availability';
  if (location.includes('/telemedicine/history')) return 'Visit History';
  return 'Telemedicine';
}

export default function ProfessionalTelemedicinePage() {
  const [location] = useLocation();
  const basePath = resolveProfessionalBasePath(location);
  return (
    <TelemedicineShell
      basePath={basePath}
      variant="clinician"
      title={resolveTitle(location)}
      clinicianId="prov-001"
    />
  );
}
