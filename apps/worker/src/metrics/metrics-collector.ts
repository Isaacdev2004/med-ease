import type { QueueMetricsSnapshot } from '@medease/queue';
import {
  createDependencyMetrics,
  createQueueMetrics,
  MetricsRegistry,
} from '@medease/observability';

export class MetricsCollector {
  private readonly registry: MetricsRegistry;
  private readonly queueMetrics: ReturnType<typeof createQueueMetrics>;
  private readonly dependencyMetrics: ReturnType<typeof createDependencyMetrics>;
  private readonly processed = new Map<string, number>();
  private readonly failed = new Map<string, number>();
  private readonly durationMs = new Map<string, number>();

  constructor(serviceName: string) {
    this.registry = new MetricsRegistry(serviceName);
    this.queueMetrics = createQueueMetrics(this.registry);
    this.dependencyMetrics = createDependencyMetrics(this.registry);
  }

  recordProcessed(queue: string, durationMs: number) {
    this.processed.set(queue, (this.processed.get(queue) ?? 0) + 1);
    this.durationMs.set(queue, (this.durationMs.get(queue) ?? 0) + durationMs);
    this.queueMetrics.recordProcessed(queue, durationMs);
  }

  recordFailed(queue: string) {
    this.failed.set(queue, (this.failed.get(queue) ?? 0) + 1);
    this.queueMetrics.recordFailed(queue);
  }

  recordRetry(queue: string) {
    this.queueMetrics.recordRetry(queue);
  }

  recordDeadLetter(queue: string) {
    this.queueMetrics.recordDeadLetter(queue);
  }

  setQueueDepth(queue: string, state: string, value: number) {
    this.queueMetrics.setDepth(queue, state, value);
  }

  setDependencyHealth(dependency: string, up: boolean, latencyMs?: number) {
    this.dependencyMetrics.setDependencyHealth(dependency, up, latencyMs);
  }

  snapshot(queue: string): QueueMetricsSnapshot {
    return {
      processedTotal: this.processed.get(queue) ?? 0,
      failedTotal: this.failed.get(queue) ?? 0,
      processingDurationMsTotal: this.durationMs.get(queue) ?? 0,
    };
  }

  allSnapshots(queueNames: string[]): Record<string, QueueMetricsSnapshot> {
    return Object.fromEntries(queueNames.map((queue) => [queue, this.snapshot(queue)]));
  }

  async renderPrometheus(): Promise<string> {
    return this.registry.renderMetrics();
  }
}
