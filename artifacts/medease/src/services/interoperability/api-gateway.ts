export function checkRateLimit(requestCount: number, limit: number): boolean {
  return requestCount < limit;
}

export function validateApiKeyPrefix(prefix: string): boolean {
  return prefix.startsWith('me_') && prefix.length >= 8;
}

export function buildJwtClaims(scopes: string[]): Record<string, unknown> {
  return { iss: 'med-ease', scopes, iat: Math.floor(Date.now() / 1000) };
}
