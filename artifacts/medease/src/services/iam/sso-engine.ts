export const SSO_PROTOCOLS = ['saml', 'oidc', 'oauth2'] as const;

export function buildSsoLoginUrl(
  providerId: string,
  redirectUri: string,
): string {
  return `/auth/sso/${providerId}?redirect=${encodeURIComponent(redirectUri)}`;
}

export function isSsoEnabled(providerStatus: string): boolean {
  return providerStatus === 'active';
}
