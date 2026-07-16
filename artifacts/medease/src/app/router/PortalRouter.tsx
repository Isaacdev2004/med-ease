import { Route, Switch } from 'wouter';
import { useMemo } from 'react';

import { RouteErrorBoundary } from '@/app/error-boundaries/RouteErrorBoundary';
import { LazyRouteFromDefinition } from '@/app/router/LazyRoute';
import {
  AuthenticatedGuard,
  FeatureFlagGuard,
  OrganizationGuard,
  PermissionGuard,
  RoleGuard,
} from '@/app/guards';
import {
  buildAuthorizedPortalConfig,
  filterAuthorizedRoutes,
} from '@/config/routes/authorize-routes';
import type { PortalRouteGroup, RouteDefinition } from '@/config/routes/types';
import { useDocumentTitle } from '@/shared/hooks/use-document-title';
import { useRouteFocus } from '@/shared/hooks/use-route-focus';
import { useAuth } from '@/services/auth/auth-context';
import { PortalLayout } from '@/shared/layout/PortalLayout';

import PortalNotFound from '@/features/errors/pages/PortalNotFound';

interface PortalRouterProps {
  group: PortalRouteGroup;
}

function RouteMetadataEffects({
  route,
  portalTitle,
}: {
  route: RouteDefinition;
  portalTitle: string;
}) {
  useDocumentTitle(route.title, portalTitle);
  useRouteFocus();
  return null;
}

export function PortalRouter({ group }: PortalRouterProps) {
  const { permissions, user, organization } = useAuth();

  const authCtx = useMemo(
    () => ({ permissions }),
    [permissions],
  );

  const config = useMemo(
    () => buildAuthorizedPortalConfig(group, authCtx),
    [group, authCtx],
  );

  const authorizedRoutes = useMemo(
    () => filterAuthorizedRoutes(group.routes, authCtx),
    [group.routes, authCtx],
  );

  const displayName = user?.fullName ?? group.userName;

  return (
    <AuthenticatedGuard>
      <OrganizationGuard organizationId={organization?.id}>
        <RoleGuard portalId={group.id}>
          <PortalLayout config={{ ...config, userName: displayName }}>
            <RouteErrorBoundary moduleName={`${group.roleName} Portal`}>
              <Switch>
                {authorizedRoutes.map((route) => (
                  <Route key={route.path} path={route.path}>
                    <FeatureFlagGuard flag={route.featureFlag}>
                      <PermissionGuard permission={route.permission}>
                        <RouteMetadataEffects
                          route={route}
                          portalTitle={group.portalTitle}
                        />
                        <LazyRouteFromDefinition
                          lazy={route.lazy}
                          moduleName={route.title}
                          loadingLabel={`Loading ${route.title.toLowerCase()}`}
                        />
                      </PermissionGuard>
                    </FeatureFlagGuard>
                  </Route>
                ))}
                <Route>
                  <PortalNotFound
                    portalLabel={group.roleName}
                    dashboardPath="/"
                  />
                </Route>
              </Switch>
            </RouteErrorBoundary>
          </PortalLayout>
        </RoleGuard>
      </OrganizationGuard>
    </AuthenticatedGuard>
  );
}
