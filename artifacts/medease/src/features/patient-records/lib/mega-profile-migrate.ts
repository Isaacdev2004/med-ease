import {
  loadMegaProfile,
  type MegaProfileId,
} from '@/features/patient-records/components/MegaProfileEditor';

const PROFILE_IDS: MegaProfileId[] = [
  'general',
  'administratif',
  'urgence',
  'physique',
  'vaccination',
];

function storageKey(patientId: string, profileId: MegaProfileId) {
  return `medease.mega.v2.${patientId}.${profileId}`;
}

/** Copy Mega Carnet local data from auth user id → clinical patient id (one-time). */
export function migrateMegaProfileStorage(
  authUserId: string,
  clinicalPatientId: string,
) {
  if (!authUserId || !clinicalPatientId || authUserId === clinicalPatientId) {
    return;
  }
  for (const profileId of PROFILE_IDS) {
    const fromKey = storageKey(authUserId, profileId);
    const toKey = storageKey(clinicalPatientId, profileId);
    const existing = localStorage.getItem(toKey);
    const legacy = localStorage.getItem(fromKey);
    if (legacy && !existing) {
      localStorage.setItem(toKey, legacy);
    }
  }
}

export function isGeneralProfileComplete(patientId: string): boolean {
  const data = loadMegaProfile(patientId, 'general');
  if (!data) return false;
  return Boolean(
    data.firstName?.trim() &&
      data.lastName?.trim() &&
      data.birthDate?.trim() &&
      data.sex?.trim(),
  );
}
