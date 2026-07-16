import { useLocation } from 'wouter';

import { AppointmentsShell } from '@/features/appointments/components/AppointmentsShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function FacilitySchedulePage() {
  const [location] = useLocation();
  const basePath = location.includes('/resources')
    ? resolveModuleBasePath(location, 'resources')
    : location.includes('/calendar')
      ? resolveModuleBasePath(location, 'calendar')
      : resolveModuleBasePath(location, 'schedule');
  return <AppointmentsShell basePath={basePath} variant="facility" title="Facility Schedule" />;
}
