import type { ApiError } from '@/types/api';

export type QueryErrorKind =
  'network' | 'validation' | 'permission' | 'not_found' | 'unknown';

export function classifyQueryError(error: unknown): QueryErrorKind {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return 'network';
  }

  const status = getErrorStatus(error);

  if (status === 403) return 'permission';
  if (status === 404) return 'not_found';
  if (status === 400 || status === 422) return 'validation';
  if (status === 0 || status === 502 || status === 503 || status === 504) {
    return 'network';
  }

  return 'unknown';
}

export function getErrorStatus(error: unknown): number | undefined {
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    typeof (error as { status: unknown }).status === 'number'
  ) {
    return (error as { status: number }).status;
  }

  if (error && typeof error === 'object' && 'status' in error) {
    return (error as ApiError).status;
  }

  return undefined;
}

export function getFriendlyQueryErrorMessage(error: unknown): string {
  const kind = classifyQueryError(error);

  switch (kind) {
    case 'network':
      return 'Unable to reach the server. Check your connection and try again.';
    case 'validation':
      return 'Some information is invalid. Please review and try again.';
    case 'permission':
      return 'You do not have permission to access this data.';
    case 'not_found':
      return 'The requested record could not be found.';
    default:
      return 'Something went wrong while loading data.';
  }
}

export function shouldRetryQuery(
  failureCount: number,
  error: unknown,
): boolean {
  const kind = classifyQueryError(error);
  if (kind === 'permission' || kind === 'validation' || kind === 'not_found') {
    return false;
  }
  return failureCount < 2;
}
