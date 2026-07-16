import type { ReactNode } from 'react';

import type { PortalConfig } from '@/config/navigation/types';
import { PortalShell } from '@/shared/layout/PortalShell';

interface PortalLayoutProps {
  config: PortalConfig;
  children: ReactNode;
}

/** Portal layout — persistent dashboard frame for all role portals. */
export function PortalLayout({ config, children }: PortalLayoutProps) {
  return <PortalShell config={config}>{children}</PortalShell>;
}
