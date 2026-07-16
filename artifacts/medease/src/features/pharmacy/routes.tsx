import { PortalRouter } from '@/app/router/PortalRouter';
import { pharmacyRouteGroup } from '@/config/routes/portals/pharmacy';

export default function PharmacyPortalRoutes() {
  return <PortalRouter group={pharmacyRouteGroup} />;
}
