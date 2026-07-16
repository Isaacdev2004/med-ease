import { useMemo } from 'react';
import { useLocation } from 'wouter';

import {
  formatBreadcrumbSegment,
  PORTAL_HOME_LABELS,
} from '@/config/breadcrumbs';
import { getRouteBreadcrumbLabel } from '@/config/routes/metadata';
import { toPortalRelativePath } from '@/shared/hooks/use-portal-path';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function useBreadcrumbs(portalLabel?: string, portalBase?: string): BreadcrumbItem[] {
  const [location] = useLocation();

  return useMemo(() => {
    const relative = toPortalRelativePath(location, portalBase);
    const segments = relative.split('/').filter(Boolean);
    if (segments.length === 0 && !portalLabel) {
      return [{ label: 'Home' }];
    }

    const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    if (portalLabel) {
      items.push({ label: portalLabel, href: relative === '/' ? undefined : '/' });
    }

    let path = '';
    segments.forEach((segment, index) => {
      path += `/${segment}`;
      const isLast = index === segments.length - 1;
      const fullPath = portalBase ? `${portalBase}${path}`.replace(/\/+/g, '/') : path;
      const isPortalRoot =
        segments.length === 1 ||
        (index === 0 && segments.length > 1 && portalBase && PORTAL_HOME_LABELS[portalBase]);

      let label =
        getRouteBreadcrumbLabel(fullPath) ?? formatBreadcrumbSegment(segment);

      if (isPortalRoot && portalBase && PORTAL_HOME_LABELS[portalBase] && index === 0) {
        label = PORTAL_HOME_LABELS[portalBase];
      }

      items.push({
        label,
        href: isLast ? undefined : path,
      });
    });

    return items;
  }, [location, portalLabel, portalBase]);
}
