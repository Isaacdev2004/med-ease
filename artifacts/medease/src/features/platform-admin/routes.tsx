import type { RouteDefinition } from '@/config/routes/types';

const adminPage = () =>
  import('@/features/platform-admin/pages/AdminPlatformPage');
const settingsPage = () =>
  import('@/features/platform-admin/pages/PlatformSettingsPage');

export function createAdminPlatformRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  const page = adminPage;
  const flag = 'platformAdmin' as const;
  return [
    {
      path: '/platform',
      title: 'Platform Dashboard',
      breadcrumb: 'Platform',
      analyticsName: `${analyticsPrefix}_platform`,
      lazy: page,
      nav,
      permission: 'platform.read',
      featureFlag: flag,
    },
    {
      path: '/tenants',
      title: 'Tenants',
      breadcrumb: 'Tenants',
      analyticsName: `${analyticsPrefix}_tenants`,
      lazy: page,
      permission: 'platform.tenants',
      featureFlag: flag,
    },
    {
      path: '/hospital-setup',
      title: 'Hospital Setup',
      breadcrumb: 'Hospitals',
      analyticsName: `${analyticsPrefix}_hospital_setup`,
      lazy: page,
      permission: 'platform.facilities',
      featureFlag: flag,
    },
    {
      path: '/facility-setup',
      title: 'Facility Setup',
      breadcrumb: 'Facilities',
      analyticsName: `${analyticsPrefix}_facility_setup`,
      lazy: page,
      permission: 'platform.facilities',
      featureFlag: flag,
    },
    {
      path: '/departments',
      title: 'Departments',
      breadcrumb: 'Departments',
      analyticsName: `${analyticsPrefix}_departments`,
      lazy: page,
      permission: 'platform.facilities',
      featureFlag: flag,
    },
    {
      path: '/localization',
      title: 'Localization',
      breadcrumb: 'Localization',
      analyticsName: `${analyticsPrefix}_localization`,
      lazy: page,
      permission: 'platform.localization',
      featureFlag: flag,
    },
    {
      path: '/branding',
      title: 'Branding',
      breadcrumb: 'Branding',
      analyticsName: `${analyticsPrefix}_branding`,
      lazy: page,
      permission: 'platform.branding',
      featureFlag: flag,
    },
    {
      path: '/licenses',
      title: 'Licenses',
      breadcrumb: 'Licenses',
      analyticsName: `${analyticsPrefix}_licenses`,
      lazy: page,
      permission: 'platform.admin',
      featureFlag: flag,
    },
    {
      path: '/storage',
      title: 'Storage',
      breadcrumb: 'Storage',
      analyticsName: `${analyticsPrefix}_storage`,
      lazy: page,
      permission: 'platform.admin',
      featureFlag: flag,
    },
    {
      path: '/feature-flags-admin',
      title: 'Feature Flags',
      breadcrumb: 'Flags',
      analyticsName: `${analyticsPrefix}_feature_flags`,
      lazy: page,
      permission: 'platform.admin',
      featureFlag: flag,
    },
    {
      path: '/system-jobs',
      title: 'System Jobs',
      breadcrumb: 'Jobs',
      analyticsName: `${analyticsPrefix}_system_jobs`,
      lazy: page,
      permission: 'platform.jobs',
      featureFlag: flag,
    },
    {
      path: '/system-health',
      title: 'System Health',
      breadcrumb: 'Health',
      analyticsName: `${analyticsPrefix}_system_health`,
      lazy: page,
      permission: 'platform.health',
      featureFlag: flag,
    },
    {
      path: '/backups',
      title: 'Backups',
      breadcrumb: 'Backups',
      analyticsName: `${analyticsPrefix}_backups`,
      lazy: page,
      permission: 'platform.admin',
      featureFlag: flag,
    },
    {
      path: '/maintenance',
      title: 'Maintenance',
      breadcrumb: 'Maintenance',
      analyticsName: `${analyticsPrefix}_maintenance`,
      lazy: page,
      permission: 'platform.admin',
      featureFlag: flag,
    },
    {
      path: '/platform-audit',
      title: 'Platform Audit',
      breadcrumb: 'Audit',
      analyticsName: `${analyticsPrefix}_platform_audit`,
      lazy: page,
      permission: 'platform.audit',
      featureFlag: flag,
    },
    {
      path: '/configurations',
      title: 'Configurations',
      breadcrumb: 'Config',
      analyticsName: `${analyticsPrefix}_configurations`,
      lazy: page,
      permission: 'platform.write',
      featureFlag: flag,
    },
  ];
}

export function createPlatformSettingsRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/platform-settings',
      title: 'Platform Settings',
      breadcrumb: 'Platform Settings',
      analyticsName: `${analyticsPrefix}_platform_settings`,
      lazy: settingsPage,
      nav,
      permission: 'platform.read',
      featureFlag: 'platformAdmin',
    },
  ];
}
