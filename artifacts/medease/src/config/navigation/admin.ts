import { buildPortalConfig } from '@/config/routes/build-portal-config';
import { adminRouteGroup } from '@/config/routes/portals/admin';

export const adminPortalConfig = buildPortalConfig(adminRouteGroup);
