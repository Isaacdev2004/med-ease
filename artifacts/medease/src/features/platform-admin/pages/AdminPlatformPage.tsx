import { useLocation } from 'wouter';

import { PlatformAdminShell } from '@/features/platform-admin/components/PlatformAdminShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment =
  | 'platform'
  | 'tenants'
  | 'hospital-setup'
  | 'facility-setup'
  | 'departments'
  | 'localization'
  | 'branding'
  | 'licenses'
  | 'storage'
  | 'feature-flags-admin'
  | 'system-jobs'
  | 'system-health'
  | 'backups'
  | 'maintenance'
  | 'platform-audit'
  | 'configurations';

function resolveSegment(location: string): Segment {
  const paths: Segment[] = [
    'feature-flags-admin',
    'platform-audit',
    'hospital-setup',
    'facility-setup',
    'system-health',
    'system-jobs',
    'departments',
    'localization',
    'maintenance',
    'configurations',
    'tenants',
    'branding',
    'licenses',
    'storage',
    'backups',
  ];
  for (const p of paths) {
    if (location.includes(`/${p}`)) return p;
  }
  return 'platform';
}

const TITLES: Record<Segment, string> = {
  platform: 'Platform Dashboard',
  tenants: 'Tenant Management',
  'hospital-setup': 'Hospital Setup',
  'facility-setup': 'Facility Setup',
  departments: 'Departments',
  localization: 'Localization',
  branding: 'Branding',
  licenses: 'Licenses',
  storage: 'Storage',
  'feature-flags-admin': 'Feature Flags',
  'system-jobs': 'System Jobs',
  'system-health': 'System Health',
  backups: 'Backups',
  maintenance: 'Maintenance',
  'platform-audit': 'Platform Audit',
  configurations: 'Configurations',
};

export default function AdminPlatformPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <PlatformAdminShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="admin"
      title={TITLES[segment]}
    />
  );
}
