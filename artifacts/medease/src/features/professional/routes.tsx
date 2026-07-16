import { PortalRouter } from '@/app/router/PortalRouter';
import { professionalRouteGroup } from '@/config/routes/portals/professional';

export default function ProfessionalPortalRoutes() {
  return <PortalRouter group={professionalRouteGroup} />;
}
