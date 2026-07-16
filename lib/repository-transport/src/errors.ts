export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  [key: string]: unknown;
}

export class RepositoryError extends Error {
  override name = 'RepositoryError';
  readonly code: string;
  readonly status?: number;
  readonly details?: ProblemDetails | unknown;

  constructor(
    message: string,
    options: { code?: string; status?: number; details?: ProblemDetails | unknown; cause?: unknown } = {},
  ) {
    super(message, options.cause !== undefined ? { cause: options.cause } : undefined);
    Object.setPrototypeOf(this, new.target.prototype);
    this.code = options.code ?? 'repository_error';
    this.status = options.status;
    this.details = options.details;
  }
}

export class AuthenticationError extends RepositoryError {
  override name = 'AuthenticationError';

  constructor(message = 'Authentication required', options: { details?: unknown; cause?: unknown } = {}) {
    super(message, { code: 'authentication_error', status: 401, ...options });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthorizationError extends RepositoryError {
  override name = 'AuthorizationError';

  constructor(message = 'Insufficient permissions', options: { details?: unknown; cause?: unknown } = {}) {
    super(message, { code: 'authorization_error', status: 403, ...options });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends RepositoryError {
  override name = 'NotFoundError';

  constructor(message = 'Resource not found', options: { details?: unknown; cause?: unknown } = {}) {
    super(message, { code: 'not_found', status: 404, ...options });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConflictError extends RepositoryError {
  override name = 'ConflictError';

  constructor(message = 'Resource conflict', options: { details?: unknown; cause?: unknown } = {}) {
    super(message, { code: 'conflict', status: 409, ...options });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends RepositoryError {
  override name = 'ValidationError';

  constructor(message = 'Validation failed', options: { details?: unknown; cause?: unknown } = {}) {
    super(message, { code: 'validation_error', status: 422, ...options });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RateLimitError extends RepositoryError {
  override name = 'RateLimitError';

  constructor(message = 'Rate limit exceeded', options: { details?: unknown; cause?: unknown } = {}) {
    super(message, { code: 'rate_limit', status: 429, ...options });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NetworkError extends RepositoryError {
  override name = 'NetworkError';

  constructor(message = 'Network request failed', options: { details?: unknown; cause?: unknown } = {}) {
    super(message, { code: 'network_error', ...options });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnknownApiError extends RepositoryError {
  override name = 'UnknownApiError';

  constructor(message = 'Unexpected API error', options: { status?: number; details?: unknown; cause?: unknown } = {}) {
    super(message, { code: 'unknown_api_error', ...options });
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
