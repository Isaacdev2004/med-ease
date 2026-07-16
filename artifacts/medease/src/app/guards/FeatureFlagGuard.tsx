import { Redirect } from 'wouter';
import type { ReactNode } from 'react';

import { ROUTES } from '@/config/routes';
import { isFeatureEnabled, type FeatureFlag } from '@/config/feature-flags';
import { trackAuthEvent } from '@/services/auth/audit-events';

interface FeatureFlagGuardProps {
  flag?: FeatureFlag;
  children: ReactNode;
}

/** Blocks disabled features — returns 404 to avoid exposing unavailable modules. */
export function FeatureFlagGuard({ flag, children }: FeatureFlagGuardProps) {
  if (!flag || isFeatureEnabled(flag)) {
    return children;
  }

  trackAuthEvent('feature_unavailable', { feature: flag });
  return <Redirect to={ROUTES.notFound} />;
}
