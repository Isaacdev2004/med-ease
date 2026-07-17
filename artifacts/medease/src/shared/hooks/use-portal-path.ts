/**
 * Build sidebar/nav hrefs for nested portal routers (wouter `nest`).
 * Links must be relative to the portal mount — not `${basePath}${route.path}`,
 * or wouter resolves `/patient/...` as `/patient` + `/patient/...`.
 */
export function portalNavHref(routePath: string): string {
  return routePath === '/' ? '/' : routePath;
}

/** Tab link for modules whose routes are flat siblings (e.g. /workflows, /workflow-designer). */
export function flatModuleTabHref(tabPath: string): string {
  return portalNavHref(tabPath.startsWith('/') ? tabPath : `/${tabPath}`);
}

/** Tab link for nested module routes (e.g. /appointments/book). */
export function nestedModuleTabHref(basePath: string, segment: string): string {
  if (!segment) return portalNavHref(basePath);
  return portalNavHref(`${basePath}/${segment}`.replace(/\/+/g, '/'));
}

/** Resolve module base path (e.g. `/appointments`) from full or nested location. */
export function resolveModuleBasePath(
  location: string,
  moduleSegment: string,
): string {
  const marker = `/${moduleSegment}`;
  const idx = location.indexOf(marker);
  if (idx >= 0) {
    return location.slice(idx);
  }
  return marker;
}

/** Strip portal mount prefix so breadcrumb/tab links stay nested-safe. */
export function toPortalRelativePath(
  location: string,
  portalBase?: string,
): string {
  if (!portalBase || portalBase === '/') {
    return location || '/';
  }
  if (location === portalBase || location.startsWith(`${portalBase}/`)) {
    return location.slice(portalBase.length) || '/';
  }
  return location || '/';
}
