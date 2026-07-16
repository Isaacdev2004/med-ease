import type { RouteDefinition } from '@/config/routes/types';

interface RoutePatternEntry {
  pattern: RegExp;
  label: string;
}

const exactLabels = new Map<string, string>();
const patternEntries: RoutePatternEntry[] = [];

function normalizePath(basePath: string, routePath: string): string {
  if (routePath.startsWith('/')) {
    if (basePath && routePath !== '/') {
      return `${basePath}${routePath}`.replace(/\/+/g, '/');
    }
    return routePath === '/' ? basePath || '/' : routePath;
  }
  return `${basePath}/${routePath}`.replace(/\/+/g, '/');
}

function pathToPattern(fullPath: string): RegExp {
  const escaped = fullPath
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/:[\w]+/g, '[^/]+');
  return new RegExp(`^${escaped}$`);
}

export function registerPortalRoutes(
  basePath: string,
  routes: RouteDefinition[],
): void {
  for (const route of routes) {
    const fullPath = normalizePath(basePath, route.path);
    const label = route.breadcrumb ?? route.title;
    exactLabels.set(fullPath, label);

    if (fullPath.includes(':')) {
      patternEntries.push({
        pattern: pathToPattern(fullPath),
        label,
      });
    }
  }
}

export function registerGlobalRoute(route: RouteDefinition): void {
  const label = route.breadcrumb ?? route.title;
  exactLabels.set(route.path, label);

  if (route.path.includes(':')) {
    patternEntries.push({
      pattern: pathToPattern(route.path),
      label,
    });
  }
}

export function getRouteBreadcrumbLabel(pathname: string): string | undefined {
  if (exactLabels.has(pathname)) {
    return exactLabels.get(pathname);
  }

  for (const entry of patternEntries) {
    if (entry.pattern.test(pathname)) {
      return entry.label;
    }
  }

  return undefined;
}
