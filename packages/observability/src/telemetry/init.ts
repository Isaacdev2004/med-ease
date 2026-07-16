import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

export interface TelemetryInitOptions {
  serviceName: string;
  serviceVersion?: string;
  enabled?: boolean;
  otlpEndpoint?: string;
  environment?: string;
}

let sdk: NodeSDK | undefined;

export function initTelemetry(options: TelemetryInitOptions): void {
  if (sdk) {
    return;
  }

  const enabled = options.enabled ?? process.env.OTEL_ENABLED !== 'false';
  if (!enabled) {
    return;
  }

  const endpoint =
    options.otlpEndpoint ??
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT ??
    'http://localhost:4318';

  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

  const serviceVersion =
    options.serviceVersion ??
    process.env.APP_VERSION ??
    process.env.OTEL_SERVICE_VERSION ??
    '0.0.0';

  sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: options.serviceName,
      [ATTR_SERVICE_VERSION]: serviceVersion,
      'deployment.environment': options.environment ?? process.env.NODE_ENV ?? 'development',
    }),
    traceExporter: new OTLPTraceExporter({
      url: `${endpoint.replace(/\/$/, '')}/v1/traces`,
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
        '@opentelemetry/instrumentation-dns': { enabled: false },
      }),
    ],
  });

  sdk.start();

  const shutdown = async () => {
    await sdk?.shutdown().catch(() => undefined);
  };

  process.on('SIGTERM', () => void shutdown());
  process.on('SIGINT', () => void shutdown());
}

export async function shutdownTelemetry(): Promise<void> {
  await sdk?.shutdown();
  sdk = undefined;
}
