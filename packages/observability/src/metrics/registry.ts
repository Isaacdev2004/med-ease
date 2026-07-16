import {
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
  Registry,
  type CounterConfiguration,
  type GaugeConfiguration,
  type HistogramConfiguration,
} from 'prom-client';

const METRIC_PREFIX = 'medease';

export class MetricsRegistry {
  readonly registry: Registry;

  constructor(serviceName: string) {
    this.registry = new Registry();
    this.registry.setDefaultLabels({ service: serviceName });
    collectDefaultMetrics({ register: this.registry, prefix: METRIC_PREFIX });
  }

  counter<T extends string>(config: CounterConfiguration<T>): Counter<T> {
    return new Counter({ ...config, registers: [this.registry] });
  }

  histogram<T extends string>(config: HistogramConfiguration<T>): Histogram<T> {
    return new Histogram({ ...config, registers: [this.registry] });
  }

  gauge<T extends string>(config: GaugeConfiguration<T>): Gauge<T> {
    return new Gauge({ ...config, registers: [this.registry] });
  }

  async renderMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}

export function createHttpMetrics(metrics: MetricsRegistry) {
  const requestsTotal = metrics.counter({
    name: `${METRIC_PREFIX}_http_requests_total`,
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status_code'] as const,
  });

  const requestDuration = metrics.histogram({
    name: `${METRIC_PREFIX}_http_request_duration_seconds`,
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'] as const,
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  });

  return {
    recordRequest(method: string, route: string, statusCode: number, durationSeconds: number) {
      const labels = {
        method,
        route,
        status_code: String(statusCode),
      } as const;
      requestsTotal.inc(labels);
      requestDuration.observe(labels, durationSeconds);
    },
  };
}

export function createQueueMetrics(metrics: MetricsRegistry) {
  const jobsProcessed = metrics.counter({
    name: `${METRIC_PREFIX}_queue_jobs_processed_total`,
    help: 'Total queue jobs processed successfully',
    labelNames: ['queue'] as const,
  });

  const jobsFailed = metrics.counter({
    name: `${METRIC_PREFIX}_queue_jobs_failed_total`,
    help: 'Total queue jobs failed',
    labelNames: ['queue'] as const,
  });

  const jobDuration = metrics.histogram({
    name: `${METRIC_PREFIX}_queue_job_duration_seconds`,
    help: 'Queue job processing duration in seconds',
    labelNames: ['queue'] as const,
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30, 60],
  });

  const retriesTotal = metrics.counter({
    name: `${METRIC_PREFIX}_queue_retries_total`,
    help: 'Total queue job retries',
    labelNames: ['queue'] as const,
  });

  const dlqTotal = metrics.counter({
    name: `${METRIC_PREFIX}_queue_dlq_total`,
    help: 'Total jobs moved to dead-letter queue',
    labelNames: ['queue'] as const,
  });

  const depth = metrics.gauge({
    name: `${METRIC_PREFIX}_queue_depth`,
    help: 'Current queue depth by state',
    labelNames: ['queue', 'state'] as const,
  });

  return {
    recordProcessed(queue: string, durationMs: number) {
      jobsProcessed.inc({ queue });
      jobDuration.observe({ queue }, durationMs / 1000);
    },
    recordFailed(queue: string) {
      jobsFailed.inc({ queue });
    },
    recordRetry(queue: string) {
      retriesTotal.inc({ queue });
    },
    recordDeadLetter(queue: string) {
      dlqTotal.inc({ queue });
    },
    setDepth(queue: string, state: string, value: number) {
      depth.set({ queue, state }, value);
    },
  };
}

export function createDependencyMetrics(metrics: MetricsRegistry) {
  const dependencyUp = metrics.gauge({
    name: `${METRIC_PREFIX}_dependency_up`,
    help: 'Dependency health (1 = up, 0 = down)',
    labelNames: ['dependency'] as const,
  });

  const dependencyLatency = metrics.gauge({
    name: `${METRIC_PREFIX}_dependency_latency_ms`,
    help: 'Dependency check latency in milliseconds',
    labelNames: ['dependency'] as const,
  });

  return {
    setDependencyHealth(dependency: string, up: boolean, latencyMs?: number) {
      dependencyUp.set({ dependency }, up ? 1 : 0);
      if (latencyMs !== undefined) {
        dependencyLatency.set({ dependency }, latencyMs);
      }
    },
  };
}

export { METRIC_PREFIX };
