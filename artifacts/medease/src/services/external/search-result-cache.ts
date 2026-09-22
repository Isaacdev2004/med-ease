import type { DirectoryProvider } from '@/services/directory/directory.types';
import type { MedicationRecord } from '@/services/medical-library/medical-library.types';

const directoryCache = new Map<string, DirectoryProvider>();
const medicationCache = new Map<string, MedicationRecord>();

export function rememberDirectoryProviders(providers: DirectoryProvider[]) {
  for (const provider of providers) {
    directoryCache.set(provider.id, provider);
    if (provider.finessNumber) {
      directoryCache.set(`finess-ext-${provider.finessNumber}`, provider);
    }
  }
}

export function getCachedDirectoryProvider(
  id: string,
): DirectoryProvider | undefined {
  return directoryCache.get(id);
}

export function rememberMedications(medications: MedicationRecord[]) {
  for (const medication of medications) {
    medicationCache.set(medication.id, medication);
    if (medication.bdpmId) {
      medicationCache.set(`bdpm-${medication.bdpmId}`, medication);
      medicationCache.set(medication.bdpmId, medication);
    }
  }
}

export function getCachedMedication(id: string): MedicationRecord | undefined {
  return medicationCache.get(id) ?? medicationCache.get(`bdpm-${id}`);
}
