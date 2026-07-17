import { ApiError } from '@workspace/api-client-react';

import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  RepositoryError,
  UnknownApiError,
  ValidationError,
  type ProblemDetails,
} from './errors.js';

function asProblemDetails(data: unknown): ProblemDetails | undefined {
  if (!data || typeof data !== 'object') return undefined;
  return data as ProblemDetails;
}

function problemMessage(data: unknown, fallback: string): string {
  const problem = asProblemDetails(data);
  if (problem?.detail) return problem.detail;
  if (problem?.title) return problem.title;
  if (typeof data === 'string' && data.trim()) return data.trim();
  return fallback;
}

function mapStatusError(
  status: number,
  data: unknown,
  cause: unknown,
): RepositoryError {
  const details = asProblemDetails(data) ?? data;
  const message = problemMessage(data, `Request failed with status ${status}`);

  switch (status) {
    case 401:
      return new AuthenticationError(message, { details, cause });
    case 403:
      return new AuthorizationError(message, { details, cause });
    case 404:
      return new NotFoundError(message, { details, cause });
    case 409:
      return new ConflictError(message, { details, cause });
    case 422:
      return new ValidationError(message, { details, cause });
    case 429:
      return new RateLimitError(message, { details, cause });
    default:
      if (asProblemDetails(data)) {
        return new RepositoryError(message, { status, details, cause });
      }
      return new UnknownApiError(message, { status, details, cause });
  }
}

export function mapApiError(error: unknown): RepositoryError {
  if (error instanceof RepositoryError) {
    return error;
  }

  if (error instanceof ApiError) {
    return mapStatusError(error.status, error.data, error);
  }

  if (error instanceof TypeError) {
    return new NetworkError(error.message || 'Network request failed', {
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new UnknownApiError(error.message, { cause: error });
  }

  return new UnknownApiError('Unexpected repository error', { cause: error });
}
