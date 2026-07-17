import type { QueryParams } from './query.js';

export interface TransportRequestOptions extends Omit<
  RequestInit,
  'method' | 'body'
> {
  query?: QueryParams;
  body?: unknown;
}

export interface RepositoryTransport {
  get<T>(url: string, options?: TransportRequestOptions): Promise<T>;
  post<T>(url: string, options?: TransportRequestOptions): Promise<T>;
  put<T>(url: string, options?: TransportRequestOptions): Promise<T>;
  patch<T>(url: string, options?: TransportRequestOptions): Promise<T>;
  delete<T>(url: string, options?: TransportRequestOptions): Promise<T>;
}
