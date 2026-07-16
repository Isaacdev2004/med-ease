import { isFeatureEnabled } from '@/config/feature-flags';
import type { PortalConfig } from '@/config/navigation/types';
import type { PortalRouteGroup } from '@/config/routes/types';
import { portalNavHref } from '@/shared/hooks/use-portal-path';

export function buildPortalConfig(group: PortalRouteGroup): PortalConfig {
  const navigation = group.routes
    .filter(
      (route) =>
        route.nav &&
        (!route.featureFlag || isFeatureEnabled(route.featureFlag)),
    )
    .sort((a, b) => (a.nav!.order ?? 0) - (b.nav!.order ?? 0))
    .map((route) => ({
      icon: route.nav!.icon,
      label: route.nav!.label ?? route.title,
      href: portalNavHref(route.path),
      badge: route.nav!.badge,
    }));

  return {
    id: group.id,
    roleName: group.roleName,
    userName: group.userName,
    basePath: group.basePath,
    navigation,
  };
}
