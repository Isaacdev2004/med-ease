import { Global, Inject, Injectable, Module } from '@nestjs/common';

import { SERVICE_NAME } from '@medease/constants';
import {
  createDependencyMetrics,
  createHttpMetrics,
  MetricsRegistry,
} from '@medease/observability';

export const METRICS_REGISTRY = Symbol('METRICS_REGISTRY');
export const HTTP_METRICS = Symbol('HTTP_METRICS');
export const DEPENDENCY_METRICS = Symbol('DEPENDENCY_METRICS');

export type HttpMetrics = ReturnType<typeof createHttpMetrics>;
export type DependencyMetrics = ReturnType<typeof createDependencyMetrics>;

@Injectable()
export class MetricsService {
  constructor(@Inject(METRICS_REGISTRY) private readonly registry: MetricsRegistry) {}

  async render(): Promise<string> {
    return this.registry.renderMetrics();
  }
}

@Global()
@Module({
  providers: [
    {
      provide: METRICS_REGISTRY,
      useFactory: () => new MetricsRegistry(SERVICE_NAME),
    },
    {
      provide: HTTP_METRICS,
      inject: [METRICS_REGISTRY],
      useFactory: (registry: MetricsRegistry) => createHttpMetrics(registry),
    },
    {
      provide: DEPENDENCY_METRICS,
      inject: [METRICS_REGISTRY],
      useFactory: (registry: MetricsRegistry) => createDependencyMetrics(registry),
    },
    MetricsService,
  ],
  exports: [METRICS_REGISTRY, HTTP_METRICS, DEPENDENCY_METRICS, MetricsService],
})
export class ObservabilityModule {}
