import type { SharedLink } from '@/services/documents/types';

export function isLinkActive(link: SharedLink): boolean {
  if (link.revoked) return false;
  if (link.expiresAt && new Date(link.expiresAt).getTime() < Date.now()) return false;
  return true;
}

export function activeSharedLinksCount(links: SharedLink[]): number {
  return links.filter(isLinkActive).length;
}
