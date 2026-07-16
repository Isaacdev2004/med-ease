import type { LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

import type { FeatureFlag } from '@/config/feature-flags';
import type { PortalId } from '@/config/routes';

export type RouteLayout = 'marketing' | 'auth' | 'portal' | 'none';

export interface RouteNavMeta {
  icon: LucideIcon;
  label?: string;
  badge?: string;
  order?: number;
}

export interface RouteDefinition {
  /** Portal-relative path (e.g. `/`, `/appointments`) or absolute for global routes. */
  path: string;
  title: string;
  description?: string;
  breadcrumb?: string;
  permission?: string;
  featureFlag?: FeatureFlag;
  analyticsName?: string;
  layout?: RouteLayout;
  lazy: () => Promise<{ default: ComponentType }>;
  nav?: RouteNavMeta;
}

export interface PortalRouteGroup {
  id: PortalId;
  portalTitle: string;
  roleName: string;
  userName: string;
  basePath: string;
  routes: RouteDefinition[];
}

export interface GlobalRouteDefinition extends RouteDefinition {
  /** Absolute application path. */
  path: string;
  layout: RouteLayout;
  public?: boolean;
  redirectTo?: string;
}
