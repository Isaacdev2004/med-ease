export function generateClientSecret(): string {
  return `mc_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

export function validateRedirectUri(allowed: string[], uri: string): boolean {
  return allowed.some((a) => uri.startsWith(a));
}

export const DEFAULT_OAUTH_SCOPES = ['openid', 'profile', 'email', 'iam.read'];
