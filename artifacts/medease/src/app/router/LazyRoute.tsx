import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

import { RouteErrorBoundary } from '@/app/error-boundaries/RouteErrorBoundary';
import { RouteSuspense } from '@/app/suspense/RouteSuspense';

type LazyLoader = () => Promise<{ default: ComponentType }>;

const lazyComponentCache = new Map<
  LazyLoader,
  LazyExoticComponent<ComponentType>
>();

function resolveLazyComponent(load: LazyLoader): LazyExoticComponent<ComponentType> {
  const cached = lazyComponentCache.get(load);
  if (cached) {
    return cached;
  }

  const component = lazy(load);
  lazyComponentCache.set(load, component);
  return component;
}

export function LazyRoute({
  component: Component,
  moduleName,
  loadingLabel,
}: {
  component: ComponentType;
  moduleName?: string;
  loadingLabel?: string;
}) {
  return (
    <RouteErrorBoundary moduleName={moduleName}>
      <RouteSuspense label={loadingLabel}>
        <Component />
      </RouteSuspense>
    </RouteErrorBoundary>
  );
}

export function LazyRouteFromDefinition({
  lazy: load,
  moduleName,
  loadingLabel,
}: {
  lazy: LazyLoader;
  moduleName?: string;
  loadingLabel?: string;
}) {
  const Component = resolveLazyComponent(load);

  return (
    <LazyRoute
      component={Component}
      moduleName={moduleName}
      loadingLabel={loadingLabel}
    />
  );
}
