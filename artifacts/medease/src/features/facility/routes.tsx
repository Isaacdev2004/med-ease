import { PortalRouter } from '@/app/router/PortalRouter';
import { facilityRouteGroup } from '@/config/routes/portals/facility';

export default function FacilityPortalRoutes() {
  return <PortalRouter group={facilityRouteGroup} />;
}
