import type { SdkPackage, SdkStatus } from '@/services/api-platform/types';

export function nextSdkStatus(
  current: SdkStatus,
  action: 'publish' | 'deprecate' | 'beta',
): SdkStatus {
  if (action === 'publish') return 'published';
  if (action === 'deprecate') return 'deprecated';
  return 'beta';
}

export function totalSdkDownloads(packages: SdkPackage[]): number {
  return packages.reduce((sum, p) => sum + p.downloadCount, 0);
}

export function publishedSdkCount(packages: SdkPackage[]): number {
  return packages.filter((p) => p.status === 'published').length;
}

export function compareSdkVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}
