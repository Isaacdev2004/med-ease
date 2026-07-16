import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () => import('@/features/iam/pages/ProfessionalSecurityPage');
const facilityPage = () => import('@/features/iam/pages/FacilitySecurityPage');
const adminPage = () => import('@/features/iam/pages/AdminSecurityPage');

export function createProfessionalIamRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/security', title: 'Security', breadcrumb: 'Security', analyticsName: `${analyticsPrefix}_security`, lazy: professionalPage, nav, permission: 'iam.read', featureFlag: 'iam' },
    { path: '/my-access', title: 'My Access', breadcrumb: 'My Access', analyticsName: `${analyticsPrefix}_my_access`, lazy: professionalPage, permission: 'iam.read', featureFlag: 'iam' },
    { path: '/my-devices', title: 'My Devices', breadcrumb: 'My Devices', analyticsName: `${analyticsPrefix}_my_devices`, lazy: professionalPage, permission: 'iam.read', featureFlag: 'iam' },
    { path: '/my-sessions', title: 'My Sessions', breadcrumb: 'My Sessions', analyticsName: `${analyticsPrefix}_my_sessions`, lazy: professionalPage, permission: 'iam.sessions', featureFlag: 'iam' },
  ];
}

export function createFacilityIamRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/security', title: 'Security', breadcrumb: 'Security', analyticsName: `${analyticsPrefix}_security`, lazy: facilityPage, nav, permission: 'iam.read', featureFlag: 'iam' },
    { path: '/users', title: 'Users', breadcrumb: 'Users', analyticsName: `${analyticsPrefix}_iam_users`, lazy: facilityPage, permission: 'iam.users', featureFlag: 'iam' },
    { path: '/roles', title: 'Roles', breadcrumb: 'Roles', analyticsName: `${analyticsPrefix}_iam_roles`, lazy: facilityPage, permission: 'iam.roles', featureFlag: 'iam' },
    { path: '/mfa', title: 'MFA', breadcrumb: 'MFA', analyticsName: `${analyticsPrefix}_iam_mfa`, lazy: facilityPage, permission: 'iam.mfa', featureFlag: 'iam' },
    { path: '/audit', title: 'Audit', breadcrumb: 'Audit', analyticsName: `${analyticsPrefix}_iam_audit`, lazy: facilityPage, permission: 'iam.audit', featureFlag: 'iam' },
  ];
}

export function createAdminIamRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  const page = adminPage;
  const flag = 'iam' as const;
  return [
    { path: '/security', title: 'Security Hub', breadcrumb: 'Security', analyticsName: `${analyticsPrefix}_security`, lazy: page, nav, permission: 'iam.read', featureFlag: flag },
    { path: '/identity', title: 'Identity', breadcrumb: 'Identity', analyticsName: `${analyticsPrefix}_identity`, lazy: page, permission: 'iam.users', featureFlag: flag },
    { path: '/roles', title: 'Roles', breadcrumb: 'Roles', analyticsName: `${analyticsPrefix}_iam_roles`, lazy: page, permission: 'iam.roles', featureFlag: flag },
    { path: '/permissions', title: 'Permissions', breadcrumb: 'Permissions', analyticsName: `${analyticsPrefix}_iam_permissions`, lazy: page, permission: 'iam.permissions', featureFlag: flag },
    { path: '/policies', title: 'Policies', breadcrumb: 'Policies', analyticsName: `${analyticsPrefix}_iam_policies`, lazy: page, permission: 'iam.policies', featureFlag: flag },
    { path: '/organizations', title: 'Organizations', breadcrumb: 'Organizations', analyticsName: `${analyticsPrefix}_organizations`, lazy: page, permission: 'iam.admin', featureFlag: flag },
    { path: '/sessions', title: 'Sessions', breadcrumb: 'Sessions', analyticsName: `${analyticsPrefix}_iam_sessions`, lazy: page, permission: 'iam.sessions', featureFlag: flag },
    { path: '/oauth-clients', title: 'OAuth Clients', breadcrumb: 'OAuth', analyticsName: `${analyticsPrefix}_oauth_clients`, lazy: page, permission: 'iam.oauth', featureFlag: flag },
    { path: '/iam-api-keys', title: 'IAM API Keys', breadcrumb: 'IAM API Keys', analyticsName: `${analyticsPrefix}_iam_api_keys`, lazy: page, permission: 'iam.apiKeys', featureFlag: flag },
    { path: '/sso', title: 'SSO', breadcrumb: 'SSO', analyticsName: `${analyticsPrefix}_sso`, lazy: page, permission: 'iam.sso', featureFlag: flag },
    { path: '/saml', title: 'SAML', breadcrumb: 'SAML', analyticsName: `${analyticsPrefix}_saml`, lazy: page, permission: 'iam.sso', featureFlag: flag },
    { path: '/openid', title: 'OpenID Connect', breadcrumb: 'OpenID', analyticsName: `${analyticsPrefix}_openid`, lazy: page, permission: 'iam.sso', featureFlag: flag },
    { path: '/mfa', title: 'MFA', breadcrumb: 'MFA', analyticsName: `${analyticsPrefix}_iam_mfa`, lazy: page, permission: 'iam.mfa', featureFlag: flag },
    { path: '/device-trust', title: 'Device Trust', breadcrumb: 'Device Trust', analyticsName: `${analyticsPrefix}_device_trust`, lazy: page, permission: 'iam.sessions', featureFlag: flag },
    { path: '/consent', title: 'Consent', breadcrumb: 'Consent', analyticsName: `${analyticsPrefix}_consent`, lazy: page, permission: 'iam.consent', featureFlag: flag },
    { path: '/delegation', title: 'Delegation', breadcrumb: 'Delegation', analyticsName: `${analyticsPrefix}_delegation`, lazy: page, permission: 'iam.write', featureFlag: flag },
    { path: '/break-glass', title: 'Break-Glass', breadcrumb: 'Break-Glass', analyticsName: `${analyticsPrefix}_break_glass`, lazy: page, permission: 'iam.breakGlass', featureFlag: flag },
    { path: '/security-incidents', title: 'Security Incidents', breadcrumb: 'Incidents', analyticsName: `${analyticsPrefix}_security_incidents`, lazy: page, permission: 'iam.admin', featureFlag: flag },
    { path: '/security-analytics', title: 'Security Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_security_analytics`, lazy: page, permission: 'iam.analytics', featureFlag: flag },
    { path: '/audit-events', title: 'Audit Events', breadcrumb: 'Audit', analyticsName: `${analyticsPrefix}_audit_events`, lazy: page, permission: 'iam.audit', featureFlag: flag },
  ];
}
