export type AuthEventName =
  | 'login'
  | 'logout'
  | 'session_timeout'
  | 'password_reset'
  | 'permission_denied'
  | 'route_denied'
  | 'feature_unavailable'
  | 'session_refresh';

/** Frontend audit events — no sensitive data in payloads. */
export function trackAuthEvent(
  event: AuthEventName,
  metadata?: Record<string, string | boolean | number>,
): void {
  if (import.meta.env.DEV) {
    console.info('[auth-audit]', event, metadata ?? {});
  }

  // Wire to analytics provider when available.
  void event;
  void metadata;
}
