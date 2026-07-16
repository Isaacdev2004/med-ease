export function buildSamlMetadata(entityId: string, acsUrl: string) {
  return { entityId, acsUrl, protocol: 'SAML 2.0' };
}

export function validateSamlAssertion(assertion: string): boolean {
  return assertion.length > 0;
}
