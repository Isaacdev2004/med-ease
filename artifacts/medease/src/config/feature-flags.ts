/**
 * Feature flags — toggle capabilities without code changes.
 * Disabled routes are hidden from navigation and routing.
 */
export const featureFlags = {
  telemedicine: true,
  billing: true,
  inventory: true,
  procurement: true,
  workforce: true,
  facilities: true,
  finance: true,
  quality: true,
  phm: true,
  cdss: true,
  interop: true,
  research: true,
  publicHealth: true,
  ai: true,
  executive: true,
  iam: true,
  documents: true,
  workflows: true,
  messaging: true,
  apiPlatform: true,
  reporting: true,
  platformAdmin: true,
  aiAssistant: false,
  insurance: false,
  laboratory: true,
  imaging: true,
  patientMonitoring: true,
  offlineMode: false,
  whiteLabel: false,
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag];
}
