import { useEffect, useState } from 'react';

export const MEGA_PROFILE_UPDATED = 'medease:mega-profile-updated';

export function notifyMegaProfileUpdated(
  patientId: string,
  profileId: string,
) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(MEGA_PROFILE_UPDATED, {
      detail: { patientId, profileId },
    }),
  );
}

/** Re-render views when a Mega Carnet section is saved. */
export function useMegaProfileRevision(
  patientId: string,
  profileId?: string,
): number {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (
        event as CustomEvent<{ patientId: string; profileId: string }>
      ).detail;
      if (detail.patientId !== patientId) return;
      if (profileId && detail.profileId !== profileId) return;
      setRevision((r) => r + 1);
    };
    window.addEventListener(MEGA_PROFILE_UPDATED, handler);
    return () => window.removeEventListener(MEGA_PROFILE_UPDATED, handler);
  }, [patientId, profileId]);

  return revision;
}
