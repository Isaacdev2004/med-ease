import { lazy } from 'react';
import { Route, Switch } from 'wouter';

import { AuthRoute, PublicRoute } from '@/app/router/GlobalRouter';
import { LazyRoute } from '@/app/router/LazyRoute';
import { authRoutes, portalAuthRoutes, publicRoutes } from '@/app/router/route-registry';
import { ROUTES } from '@/config/routes';
import { useScrollRestoration } from '@/shared/hooks/use-scroll-restoration';

const DesignSystemPage = lazy(() =>
  import('@/features/design-system').then((m) => ({
    default: m.DesignSystemPage,
  })),
);
const NotFoundPage = lazy(() =>
  import('@/features/errors').then((m) => ({ default: m.NotFoundPage })),
);
const ForbiddenPage = lazy(() =>
  import('@/features/errors').then((m) => ({ default: m.ForbiddenPage })),
);
const ServerErrorPage = lazy(() =>
  import('@/features/errors').then((m) => ({ default: m.ServerErrorPage })),
);
const OfflinePage = lazy(() =>
  import('@/features/errors').then((m) => ({ default: m.OfflinePage })),
);

const PatientPortalRoutes = lazy(() => import('@/features/patient'));
const ProfessionalPortalRoutes = lazy(() => import('@/features/professional'));
const FacilityPortalRoutes = lazy(() => import('@/features/facility'));
const PharmacyPortalRoutes = lazy(() => import('@/features/pharmacy'));
const TransportPortalRoutes = lazy(() => import('@/features/transport'));
const AdminPortalRoutes = lazy(() => import('@/features/admin'));

const portalLazyRoutes = [
  {
    path: ROUTES.patient.root,
    component: PatientPortalRoutes,
    label: 'Patient Portal',
  },
  {
    path: ROUTES.professional.root,
    component: ProfessionalPortalRoutes,
    label: 'Professional Portal',
  },
  {
    path: ROUTES.facility.root,
    component: FacilityPortalRoutes,
    label: 'Facility Portal',
  },
  {
    path: ROUTES.pharmacy.root,
    component: PharmacyPortalRoutes,
    label: 'Pharmacy Portal',
  },
  {
    path: ROUTES.transport.root,
    component: TransportPortalRoutes,
    label: 'Transport Portal',
  },
  {
    path: ROUTES.admin.root,
    component: AdminPortalRoutes,
    label: 'Admin Portal',
  },
] as const;

export function AppRouter() {
  useScrollRestoration();

  return (
    <Switch>
      <Route path={ROUTES.forbidden}>
        <LazyRoute component={ForbiddenPage} loadingLabel="Loading" />
      </Route>
      <Route path={ROUTES.notFound}>
        <LazyRoute component={NotFoundPage} loadingLabel="Loading" />
      </Route>
      <Route path={ROUTES.serverError}>
        <LazyRoute component={ServerErrorPage} loadingLabel="Loading" />
      </Route>
      <Route path={ROUTES.offline}>
        <LazyRoute component={OfflinePage} loadingLabel="Loading" />
      </Route>

      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path}>
          <PublicRoute route={route} />
        </Route>
      ))}

      {authRoutes.map((route) => (
        <Route key={route.path} path={route.path}>
          <AuthRoute route={route} />
        </Route>
      ))}

      {portalAuthRoutes.map((route) => (
        <Route key={route.path} path={route.path}>
          <AuthRoute route={route} />
        </Route>
      ))}

      {portalLazyRoutes.map(({ path, component, label }) => (
        <Route key={path} path={path} nest>
          <LazyRoute
            component={component}
            moduleName={label}
            loadingLabel={`Loading ${label.toLowerCase()}`}
          />
        </Route>
      ))}

      <Route path={ROUTES.designSystem}>
        <LazyRoute
          component={DesignSystemPage}
          moduleName="Design System"
          loadingLabel="Loading design system"
        />
      </Route>

      <Route>
        <LazyRoute component={NotFoundPage} loadingLabel="Loading" />
      </Route>
    </Switch>
  );
}
