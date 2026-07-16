import { useLocation } from 'wouter';

import { PlatformAdminShell } from '@/features/platform-admin/components/PlatformAdminShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

export default function PlatformSettingsPage() {
  const [location] = useLocation();
  return (
    <PlatformAdminShell
      basePath={resolveModuleBasePath(location, 'platform-settings')}
      variant="readonly"
      title="Platform Settings"
      tenantId="ten-0001"
      facilityId="fac-001"
    />
  );
}
