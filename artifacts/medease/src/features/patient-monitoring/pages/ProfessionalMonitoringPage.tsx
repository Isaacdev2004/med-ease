import { useLocation } from 'wouter';

import { MonitoringShell } from '@/features/patient-monitoring/components/MonitoringShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

const SEGMENTS = ['monitoring', 'alerts', 'devices', 'analytics'] as const;
type ProSegment = (typeof SEGMENTS)[number];

function getPatientId(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const idx = segments.indexOf('patient');
  return idx >= 0 ? segments[idx + 1] : undefined;
}

function resolveSegment(location: string): ProSegment {
  for (const s of SEGMENTS) if (location.includes(`/${s}`)) return s;
  return 'monitoring';
}

export default function ProfessionalMonitoringPage() {
  const [location] = useLocation();
  const patientId = getPatientId(location);

  if (patientId) {
    return (
      <MonitoringShell
        basePath={`/patient/${patientId}/monitoring`}
        variant="clinician"
        title="Patient Monitoring"
        patientId={patientId}
      />
    );
  }

  const segment = resolveSegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<ProSegment, string> = {
    monitoring: 'Patient Monitoring',
    alerts: 'Monitoring Alerts',
    devices: 'Device Management',
    analytics: 'Monitoring Analytics',
  };
  return (
    <MonitoringShell
      basePath={basePath}
      variant="clinician"
      title={titles[segment]}
    />
  );
}
