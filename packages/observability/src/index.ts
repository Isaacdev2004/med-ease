export {
  runWithRequestContext,
  runWithContext,
  getRequestContext,
  getContext,
  mergeRequestContext,
  createBaseRequestContext,
  getLogBindings,
  requireRequestContext,
  requireTenantId,
  MissingRequestContextError,
  MissingTenantContextError,
  type RequestContext,
  type ObservabilityContext,
} from './context';

export {
  applyTenantContextFromJwt,
  envelopeFieldsFromRequestContext,
  requestContextFromJobEnvelope,
  tenantContextFromJwt,
  type JobEnvelopeContextSource,
  type JwtTenantClaims,
} from './request-context/tenant-context';

export {
  resolveRuntimeBuildInfo,
  type RuntimeBuildInfo,
} from './runtime/build-info';

export {
  MetricsRegistry,
  createHttpMetrics,
  createQueueMetrics,
  createDependencyMetrics,
  METRIC_PREFIX,
} from './metrics/registry';

export {
  initTelemetry,
  shutdownTelemetry,
  type TelemetryInitOptions,
} from './telemetry/init';

export {
  runWithSpan,
  enrichContext,
  getActiveTraceContext,
  injectTraceHeaders,
  extractTraceContext,
} from './telemetry/spans';
