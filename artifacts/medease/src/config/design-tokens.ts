/** Design system tokens — never hardcode spacing, colors, or breakpoints in features. */

export const SPACING = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const TYPOGRAPHY = {
  h1: 'text-3xl font-bold tracking-tight',
  h2: 'text-2xl font-semibold tracking-tight',
  h3: 'text-xl font-semibold tracking-tight',
  h4: 'text-lg font-semibold',
  body: 'text-sm',
  caption: 'text-xs text-muted-foreground',
  label: 'text-sm font-medium leading-none',
} as const;

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
} as const;

export const ANIMATION = {
  fast: 150,
  default: 200,
} as const;

/** Minimum accessible touch target (WCAG). */
export const TOUCH_TARGET_MIN = 44;

export type HealthcareStatus =
  | 'critical'
  | 'stable'
  | 'observation'
  | 'discharged'
  | 'transferred'
  | 'pending'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

export const HEALTHCARE_STATUS_LABELS: Record<HealthcareStatus, string> = {
  critical: 'Critical',
  stable: 'Stable',
  observation: 'Observation',
  discharged: 'Discharged',
  transferred: 'Transferred',
  pending: 'Pending',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
  info: 'Information',
  neutral: 'Neutral',
};

export const HEALTHCARE_STATUS_VARIANT: Record<
  HealthcareStatus,
  'destructive' | 'success' | 'warning' | 'info' | 'secondary' | 'outline' | 'default'
> = {
  critical: 'destructive',
  stable: 'success',
  observation: 'warning',
  discharged: 'secondary',
  transferred: 'info',
  pending: 'info',
  success: 'success',
  warning: 'warning',
  error: 'destructive',
  info: 'info',
  neutral: 'outline',
};
