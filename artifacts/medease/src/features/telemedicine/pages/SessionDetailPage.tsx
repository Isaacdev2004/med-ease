import { useLocation } from 'wouter';

import { TelemedicineShell } from '@/features/telemedicine/components/TelemedicineShell';
import { PageShell } from '@/shared/components';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

function getSessionId(pathname: string) {
  const match = pathname.match(/\/session\/([^/]+)/);
  return match?.[1];
}

export default function SessionDetailPage() {
  const [location] = useLocation();
  const sessionId = getSessionId(location) ?? '';
  const isPatient = location.includes('/patient/');

  if (!sessionId) {
    return (
      <PageShell title="Session">
        <p className="text-muted-foreground">Session not found.</p>
      </PageShell>
    );
  }

  if (isPatient) {
    return (
      <TelemedicineShell
        basePath={resolveModuleBasePath(location, 'telemedicine')}
        variant="patient"
        title="Virtual Visit"
        sessionId={sessionId}
      />
    );
  }

  return (
    <TelemedicineShell
      basePath={resolveModuleBasePath(location, 'session')}
      variant="clinician"
      title="Virtual Session"
      sessionId={sessionId}
      clinicianId="prov-001"
    />
  );
}
