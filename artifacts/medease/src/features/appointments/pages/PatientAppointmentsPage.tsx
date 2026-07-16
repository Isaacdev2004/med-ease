import { useLocation } from 'wouter';

import { AppointmentsShell } from '@/features/appointments/components/AppointmentsShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function PatientAppointmentsPage() {
  const [location] = useLocation();
  const basePath = resolveModuleBasePath(location, 'appointments');
  return <AppointmentsShell basePath={basePath} variant="patient" title="My Appointments" />;
}
