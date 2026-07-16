import { initTelemetry } from '@medease/observability';
import { WORKER_SERVICE_NAME } from '@medease/constants';

initTelemetry({
  serviceName: WORKER_SERVICE_NAME,
  serviceVersion: process.env.APP_VERSION,
  enabled: process.env.OTEL_ENABLED !== 'false',
  otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  environment: process.env.NODE_ENV,
});
