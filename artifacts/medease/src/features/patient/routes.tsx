import { PortalRouter } from '@/app/router/PortalRouter';
import { patientRouteGroup } from '@/config/routes/portals/patient';

export default function PatientPortalRoutes() {
  return <PortalRouter group={patientRouteGroup} />;
}
