import { customFetch } from '@workspace/api-client-react';

import { mapApiError } from './map-api-error.js';
import { appendQuery } from './query.js';
import type {
  RepositoryTransport,
  TransportRequestOptions,
} from './transport.js';

function serializeBody(
  body: unknown,
  headers: HeadersInit | undefined,
): { body?: BodyInit; headers?: HeadersInit } {
  if (body === undefined || body === null) {
    return { headers };
  }

  if (
    typeof body === 'string' ||
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof URLSearchParams
  ) {
    return { body: body as BodyInit, headers };
  }

  const nextHeaders = new Headers(headers);
  if (!nextHeaders.has('content-type')) {
    nextHeaders.set('content-type', 'application/json');
  }

  return { body: JSON.stringify(body), headers: nextHeaders };
}

export class HttpTransport implements RepositoryTransport {
  async get<T>(url: string, options: TransportRequestOptions = {}): Promise<T> {
    return this.request<T>(url, 'GET', options);
  }

  async post<T>(
    url: string,
    options: TransportRequestOptions = {},
  ): Promise<T> {
    return this.request<T>(url, 'POST', options);
  }

  async put<T>(url: string, options: TransportRequestOptions = {}): Promise<T> {
    return this.request<T>(url, 'PUT', options);
  }

  async patch<T>(
    url: string,
    options: TransportRequestOptions = {},
  ): Promise<T> {
    return this.request<T>(url, 'PATCH', options);
  }

  async delete<T>(
    url: string,
    options: TransportRequestOptions = {},
  ): Promise<T> {
    return this.request<T>(url, 'DELETE', options);
  }

  private async request<T>(
    url: string,
    method: string,
    options: TransportRequestOptions,
  ): Promise<T> {
    const { query, body, headers, ...init } = options;
    const targetUrl = appendQuery(url, query);
    const serialized = serializeBody(body, headers);

    try {
      return await customFetch<T>(targetUrl, {
        ...init,
        method,
        headers: serialized.headers,
        body: serialized.body,
      });
    } catch (error) {
      throw mapApiError(error);
    }
  }
}

export const httpTransport = new HttpTransport();

/** Wrap an Orval-generated client call with repository error translation. */
export async function invokeOrval<T>(call: () => Promise<T>): Promise<T> {
  try {
    return await call();
  } catch (error) {
    throw mapApiError(error);
  }
}
