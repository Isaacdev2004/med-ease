import type { OAuthApp, OAuthAppStatus } from '@/services/api-platform/types';

export function generateClientId(appName: string): string {
  const slug = appName.toLowerCase().replace(/\s+/g, '-').slice(0, 20);
  return `medease_${slug}_${Date.now().toString(36)}`;
}

export function generateClientSecret(): string {
  return `sec_${Math.random().toString(36).slice(2, 18)}${Math.random().toString(36).slice(2, 18)}`;
}

export function nextOAuthAppStatus(current: OAuthAppStatus, action: 'publish' | 'suspend' | 'draft'): OAuthAppStatus {
  if (action === 'publish') return 'published';
  if (action === 'suspend') return 'suspended';
  return 'draft';
}

export function canPublishOAuthApp(app: OAuthApp): boolean {
  return app.status === 'draft' && app.redirectUris.length > 0 && app.scopes.length > 0;
}

export function publishedOAuthAppCount(apps: OAuthApp[]): number {
  return apps.filter((a) => a.status === 'published').length;
}
