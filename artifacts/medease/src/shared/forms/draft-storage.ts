const DRAFT_PREFIX = 'medease:draft:';

export interface StoredDraft<T> {
  data: T;
  savedAt: number;
}

/** Local draft persistence for large forms — survives refresh and offline use. */
export const draftStorage = {
  save<T>(key: string, data: T) {
    if (typeof window === 'undefined') return;
    const payload: StoredDraft<T> = { data, savedAt: Date.now() };
    localStorage.setItem(`${DRAFT_PREFIX}${key}`, JSON.stringify(payload));
  },

  load<T>(key: string): StoredDraft<T> | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${key}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredDraft<T>;
    } catch {
      return null;
    }
  },

  remove(key: string) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${DRAFT_PREFIX}${key}`);
  },

  has(key: string) {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`${DRAFT_PREFIX}${key}`) !== null;
  },
};
