import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { ApiError } from '@workspace/api-client-react';

import {
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  NotFoundError,
  RateLimitError,
  RepositoryError,
  ValidationError,
} from './errors.js';
import { mapApiError } from './map-api-error.js';

function mockResponse(status: number, statusText: string): Response {
  return new Response(null, { status, statusText });
}

describe('mapApiError', () => {
  it('maps 401 to AuthenticationError', () => {
    const error = mapApiError(
      new ApiError(mockResponse(401, 'Unauthorized'), { title: 'Unauthorized' }, { method: 'GET', url: '/api/iam/users' }),
    );
    assert.ok(error instanceof AuthenticationError);
  });

  it('maps 403 to AuthorizationError', () => {
    const error = mapApiError(
      new ApiError(mockResponse(403, 'Forbidden'), { detail: 'Denied' }, { method: 'GET', url: '/api/iam/users' }),
    );
    assert.ok(error instanceof AuthorizationError);
    assert.equal(error.message, 'Denied');
  });

  it('maps 404 to NotFoundError', () => {
    const error = mapApiError(
      new ApiError(mockResponse(404, 'Not Found'), null, { method: 'GET', url: '/api/iam/users/1' }),
    );
    assert.ok(error instanceof NotFoundError);
  });

  it('maps 409 to ConflictError', () => {
    const error = mapApiError(
      new ApiError(mockResponse(409, 'Conflict'), null, { method: 'POST', url: '/api/iam/users' }),
    );
    assert.ok(error instanceof ConflictError);
  });

  it('maps 422 to ValidationError', () => {
    const error = mapApiError(
      new ApiError(mockResponse(422, 'Unprocessable Entity'), { detail: 'Invalid email' }, { method: 'POST', url: '/api/iam/users' }),
    );
    assert.ok(error instanceof ValidationError);
  });

  it('maps 429 to RateLimitError', () => {
    const error = mapApiError(
      new ApiError(mockResponse(429, 'Too Many Requests'), null, { method: 'GET', url: '/api/iam/users' }),
    );
    assert.ok(error instanceof RateLimitError);
  });

  it('maps RFC7807 payloads to RepositoryError', () => {
    const error = mapApiError(
      new ApiError(
        mockResponse(500, 'Internal Server Error'),
        { type: 'about:blank', title: 'Server error', status: 500, detail: 'Unexpected failure' },
        { method: 'GET', url: '/api/iam/users' },
      ),
    );
    assert.ok(error instanceof RepositoryError);
    assert.equal(error.message, 'Unexpected failure');
  });

  it('passes through existing RepositoryError instances', () => {
    const original = new NotFoundError('Missing user');
    assert.equal(mapApiError(original), original);
  });
});
