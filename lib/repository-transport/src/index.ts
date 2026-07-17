export {
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
export { mapApiError } from './map-api-error.js';
export {
  appendQuery,
  type QueryParamValue,
  type QueryParams,
} from './query.js';
export { err, isErr, isOk, ok, tryCatch, type Result } from './result.js';
export { HttpTransport, httpTransport, invokeOrval } from './http-transport.js';
export type {
  RepositoryTransport,
  TransportRequestOptions,
} from './transport.js';
