import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () => import('@/features/api-platform/pages/ProfessionalApiPlatformPage');
const facilityPage = () => import('@/features/api-platform/pages/FacilityApiPlatformPage');
const adminPage = () => import('@/features/api-platform/pages/AdminApiPlatformPage');

export function createProfessionalApiPlatformRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  const flag = 'apiPlatform' as const;
  return [
    { path: '/developer', title: 'Developer Portal', breadcrumb: 'Developer', analyticsName: `${analyticsPrefix}_developer`, lazy: professionalPage, nav, permission: 'api.read', featureFlag: flag },
    { path: '/api-docs', title: 'API Documentation', breadcrumb: 'API Docs', analyticsName: `${analyticsPrefix}_api_docs`, lazy: professionalPage, permission: 'api.read', featureFlag: flag },
  ];
}

export function createFacilityApiPlatformRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  const flag = 'apiPlatform' as const;
  return [
    { path: '/developer', title: 'Developer Portal', breadcrumb: 'Developer', analyticsName: `${analyticsPrefix}_developer`, lazy: facilityPage, nav, permission: 'api.read', featureFlag: flag },
    { path: '/webhooks', title: 'Webhooks', breadcrumb: 'Webhooks', analyticsName: `${analyticsPrefix}_webhooks`, lazy: facilityPage, permission: 'api.webhooks', featureFlag: flag },
  ];
}

export function createAdminApiPlatformRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  const page = adminPage;
  const flag = 'apiPlatform' as const;
  return [
    { path: '/developer-portal', title: 'Developer Portal', breadcrumb: 'Portal', analyticsName: `${analyticsPrefix}_developer_portal`, lazy: page, nav, permission: 'api.read', featureFlag: flag },
    { path: '/api-keys', title: 'API Keys', breadcrumb: 'API Keys', analyticsName: `${analyticsPrefix}_api_keys`, lazy: page, permission: 'api.keys', featureFlag: flag },
    { path: '/oauth-apps', title: 'OAuth Applications', breadcrumb: 'OAuth', analyticsName: `${analyticsPrefix}_oauth_apps`, lazy: page, permission: 'api.oauth', featureFlag: flag },
    { path: '/webhooks', title: 'Webhooks', breadcrumb: 'Webhooks', analyticsName: `${analyticsPrefix}_webhooks`, lazy: page, permission: 'api.webhooks', featureFlag: flag },
    { path: '/sdk-management', title: 'SDK Management', breadcrumb: 'SDK', analyticsName: `${analyticsPrefix}_sdk_management`, lazy: page, permission: 'api.sdk', featureFlag: flag },
    { path: '/rate-limits', title: 'Rate Limits', breadcrumb: 'Rate Limits', analyticsName: `${analyticsPrefix}_rate_limits`, lazy: page, permission: 'api.admin', featureFlag: flag },
    { path: '/api-analytics', title: 'API Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_api_analytics`, lazy: page, permission: 'api.analytics', featureFlag: flag },
    { path: '/api-marketplace', title: 'API Marketplace', breadcrumb: 'Marketplace', analyticsName: `${analyticsPrefix}_api_marketplace`, lazy: page, permission: 'api.marketplace', featureFlag: flag },
    { path: '/sandbox', title: 'Sandbox Environments', breadcrumb: 'Sandbox', analyticsName: `${analyticsPrefix}_sandbox`, lazy: page, permission: 'api.write', featureFlag: flag },
    { path: '/partners', title: 'API Partners', breadcrumb: 'Partners', analyticsName: `${analyticsPrefix}_partners`, lazy: page, permission: 'api.admin', featureFlag: flag },
  ];
}
