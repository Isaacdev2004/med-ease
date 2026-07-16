import { ROUTES } from '@/config/routes';

/** Static labels for breadcrumb segments — fallback when route metadata is unavailable. */
export const BREADCRUMB_LABELS: Record<string, string> = {
  patient: 'Patient',
  professional: 'Healthcare Professional',
  facility: 'Facility',
  pharmacy: 'Pharmacy',
  transport: 'Medical Transport',
  admin: 'Administrator',
  about: 'About',
  features: 'Features',
  contact: 'Contact',
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  help: 'Help Center',
  status: 'System Status',
  login: 'Sign In',
  register: 'Register',
  'forgot-password': 'Forgot Password',
  'reset-password': 'Reset Password',
  'verify-email': 'Verify Email',
  'session-expired': 'Session Expired',
  'design-system': 'Design System',
};

export const PORTAL_HOME_LABELS: Record<string, string> = {
  [ROUTES.patient.root]: 'Overview',
  [ROUTES.professional.root]: 'Schedule',
  [ROUTES.facility.root]: 'Overview',
  [ROUTES.pharmacy.root]: 'Queue',
  [ROUTES.transport.root]: 'Live Dispatch',
  [ROUTES.admin.root]: 'System Health',
};

export function formatBreadcrumbSegment(segment: string): string {
  return (
    BREADCRUMB_LABELS[segment] ??
    segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}
