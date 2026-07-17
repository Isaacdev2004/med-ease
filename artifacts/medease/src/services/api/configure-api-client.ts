import { setAuthTokenGetter, setBaseUrl } from '@workspace/api-client-react';

import { env } from '@/config/env';

let configured = false;

/** Wire generated API client to auth session and base URL. Call once at bootstrap. */
export function configureApiClient(
  getAccessToken: () => string | null | undefined,
) {
  if (!configured) {
    const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';
    if (apiBase) {
      setBaseUrl(apiBase);
    }
    configured = true;
  }

  setAuthTokenGetter(async () => getAccessToken() ?? null);
}

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL ?? env.baseUrl;
}
