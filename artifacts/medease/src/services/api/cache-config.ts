/** Cache stale-time strategy — feature hooks may override per query. */
export const CACHE_TIMES = {
  /** Reference / lookup data */
  reference: 24 * 60 * 60 * 1000,
  /** Patient lists */
  patientList: 5 * 60 * 1000,
  /** Dashboard widgets */
  dashboard: 60 * 1000,
  /** Notification feeds — near-realtime */
  notifications: 15 * 1000,
  /** User profile */
  profile: 10 * 60 * 1000,
  /** Patient timeline / activity */
  patientTimeline: 30 * 1000,
  /** Default fallback */
  default: 60 * 1000,
} as const;

export const REFETCH_INTERVALS = {
  dashboard: 60 * 1000,
  notifications: 15 * 1000,
  patientTimeline: 30 * 1000,
} as const;

export const SEARCH_DEBOUNCE_MS = 300;

export const DEFAULT_PAGE_SIZE = 25;
