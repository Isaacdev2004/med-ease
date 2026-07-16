import type { DocumentVersion } from '@/services/documents/types';

export function nextVersionNumber(versions: DocumentVersion[]): number {
  if (versions.length === 0) return 1;
  return Math.max(...versions.map((v) => v.versionNumber)) + 1;
}

export function latestVersion(versions: DocumentVersion[]): DocumentVersion | undefined {
  return versions.sort((a, b) => b.versionNumber - a.versionNumber)[0];
}
