import { isFeatureEnabled } from '@/config/feature-flags';
import { hasPermission } from '@/config/permissions';
import type { PortalConfig } from '@/config/navigation/types';
import type { PortalRouteGroup, RouteDefinition } from '@/config/routes/types';
import { portalNavHref } from '@/shared/hooks/use-portal-path';

export interface AuthorizationContext {
  permissions: string[];
}

export function isRouteAuthorized(
  route: RouteDefinition,
  ctx: AuthorizationContext,
): boolean {
  if (route.featureFlag && !isFeatureEnabled(route.featureFlag)) {
    return false;
  }

  if (route.permission && !hasPermission(ctx.permissions, route.permission)) {
    return false;
  }

  return true;
}

export function filterAuthorizedRoutes(
  routes: RouteDefinition[],
  ctx: AuthorizationContext,
): RouteDefinition[] {
  return routes.filter((route) => isRouteAuthorized(route, ctx));
}

export function buildAuthorizedPortalConfig(
  group: PortalRouteGroup,
  ctx: AuthorizationContext,
): PortalConfig {
  const authorizedRoutes = filterAuthorizedRoutes(group.routes, ctx);

  const navigation = authorizedRoutes
    .filter((route) => route.nav)
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
