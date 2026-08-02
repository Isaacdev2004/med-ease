import { getApiBaseUrl } from '@/services/api/configure-api-client';

export interface InvitePreview {
  email: string;
  fullName: string;
  expiresAt: string;
}

function apiRoot(): string {
  const base = getApiBaseUrl().replace(/\/$/, '');
  if (!base) {
    throw new Error('network_error');
  }
  return `${base}/api`;
}

async function parseError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { code?: string; message?: string };
    if (body.code) return body.code;
  } catch {
    // fall through
  }
  if (response.status >= 500) return 'network_error';
  return 'unknown';
}

export async function previewInvite(token: string): Promise<InvitePreview> {
  const url = new URL(`${apiRoot()}/auth/invite`);
  url.searchParams.set('token', token);

  const response = await fetch(url.toString(), {
    headers: { accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as InvitePreview;
}

export async function acceptInvite(input: {
  token: string;
  password: string;
  fullName?: string;
}): Promise<void> {
  const response = await fetch(`${apiRoot()}/auth/accept-invite`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }
}
