const PREFERENCES_KEY = 'medease.preferences';

export const DEFAULT_USER_PREFERENCES = {
  emailAlerts: true,
  smsAlerts: false,
  darkMode: false,
  autoLogout: true,
} as const;

export function readLocalPreferences(): Record<string, unknown> | null {
  try {
    const raw = window.localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function writeLocalPreferences(preferences: Record<string, unknown>): void {
  try {
    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // Storage may be unavailable in private mode.
  }
}

export function resolvePreferences(
  remote?: Partial<Record<string, unknown>> | null,
): Record<string, unknown> {
  const local = readLocalPreferences();
  return {
    ...DEFAULT_USER_PREFERENCES,
    ...local,
    ...remote,
  };
}
