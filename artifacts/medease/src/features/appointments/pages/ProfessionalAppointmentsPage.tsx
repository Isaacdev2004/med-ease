import { useLocation } from 'wouter';

import { AppointmentsShell } from '@/features/appointments/components/AppointmentsShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function ProfessionalAppointmentsPage() {
  const [location] = useLocation();
  const basePath = location.includes('/calendar')
    ? resolveModuleBasePath(location, 'calendar')
    : location.includes('/schedule')
      ? resolveModuleBasePath(location, 'schedule')
      : resolveModuleBasePath(location, 'appointments');
  return (
    <AppointmentsShell
      basePath={basePath}
      variant="clinician"
      title="Clinical Schedule"
    />
  );
}
