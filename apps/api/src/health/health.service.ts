import { Inject, Injectable, Optional } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  type HealthIndicatorResult,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import pg from 'pg';

import { createStorageClient } from '@medease/storage';
import type { DependencyCheck } from '@medease/types';
import { timed } from '@medease/utils';

import {
  DEPENDENCY_METRICS,
  type DependencyMetrics,
} from '../observability/observability.module';
import { MedeaseConfigService } from '../config/config.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly configService: MedeaseConfigService,
    @Optional()
    @Inject(DEPENDENCY_METRICS)
    private readonly dependencyMetrics?: DependencyMetrics,
  ) {}

  async checkPostgres(): Promise<DependencyCheck> {
    const client = new pg.Client({
      connectionString: this.configService.database.url,
      ssl: this.configService.database.url.includes('supabase')
        ? { rejectUnauthorized: false }
        : undefined,
    });
    try {
      const { latencyMs } = await timed(async () => {
        await client.connect();
        await client.query('SELECT 1');
      });
      return { name: 'postgresql', status: 'ok', latencyMs };
    } catch (error) {
      return {
        name: 'postgresql',
        status: 'error',
        message:
          error instanceof Error ? error.message : 'PostgreSQL unreachable',
      };
    } finally {
      await client.end().catch(() => undefined);
    }
  }

  async checkRedis(): Promise<DependencyCheck> {
    const redis = new Redis(this.configService.redis.url, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5_000,
      lazyConnect: true,
    });

    try {
      const { latencyMs } = await timed(async () => {
        await redis.connect();
        const pong = await redis.ping();
        if (pong !== 'PONG') {
          throw new Error(`Unexpected Redis response: ${pong}`);
        }
      });
      return { name: 'redis', status: 'ok', latencyMs };
    } catch (error) {
      return {
        name: 'redis',
        status: 'error',
        message: error instanceof Error ? error.message : 'Redis unreachable',
      };
    } finally {
      redis.disconnect();
    }
  }

  async checkStorage(): Promise<DependencyCheck> {
    const supabase = this.configService.supabase;
    const storageClient = createStorageClient({
      supabaseUrl: supabase.url,
      serviceRoleKey: supabase.serviceRoleKey,
      bucketDocuments: supabase.bucketDocuments,
      bucketExports: supabase.bucketExports,
    });

    try {
      const { latencyMs } = await timed(async () => {
        const result = await storageClient.checkBucketAccess(
          supabase.bucketDocuments,
        );
        if (!result.ok) {
          throw new Error(result.message ?? 'Supabase Storage unreachable');
        }
      });
      return { name: 'storage', status: 'ok', latencyMs };
    } catch (error) {
      return {
        name: 'storage',
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Supabase Storage unreachable',
      };
    }
  }

  async checkOpenSearch(): Promise<DependencyCheck> {
    const opensearchUrl = this.configService.opensearch?.url;
    if (!opensearchUrl) {
      return { name: 'opensearch', status: 'ok', message: 'not configured' };
    }

    try {
      const { latencyMs } = await timed(async () => {
        const response = await fetch(`${opensearchUrl}/_cluster/health`, {
          signal: AbortSignal.timeout(5_000),
        });
        if (!response.ok) {
          throw new Error(`OpenSearch returned ${response.status}`);
        }
        const body = (await response.json()) as { status?: string };
        if (body.status === 'red') {
          throw new Error('OpenSearch cluster status is red');
        }
      });
      return { name: 'opensearch', status: 'ok', latencyMs };
    } catch (error) {
      return {
        name: 'opensearch',
        status: 'error',
        message:
          error instanceof Error ? error.message : 'OpenSearch unreachable',
      };
    }
  }

  async checkAllDependencies(): Promise<DependencyCheck[]> {
    const checks = await Promise.all([
      this.checkPostgres(),
      this.checkRedis(),
      this.checkStorage(),
      this.checkOpenSearch(),
    ]);

    for (const check of checks) {
      this.dependencyMetrics?.setDependencyHealth(
        check.name,
        check.status === 'ok',
        check.latencyMs,
      );
    }

    return checks;
  }
}

@Injectable()
export class PostgresHealthIndicator extends HealthIndicator {
  constructor(private readonly healthService: HealthService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const check = await this.healthService.checkPostgres();
    if (check.status !== 'ok') {
      throw new HealthCheckError(
        'PostgreSQL check failed',
        this.getStatus(key, false, check),
      );
    }
    return this.getStatus(key, true, { latencyMs: check.latencyMs });
  }
}

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly healthService: HealthService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const check = await this.healthService.checkRedis();
    if (check.status !== 'ok') {
      throw new HealthCheckError(
        'Redis check failed',
        this.getStatus(key, false, check),
      );
    }
    return this.getStatus(key, true, { latencyMs: check.latencyMs });
  }
}

@Injectable()
export class StorageHealthIndicator extends HealthIndicator {
  constructor(private readonly healthService: HealthService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const check = await this.healthService.checkStorage();
    if (check.status !== 'ok') {
      throw new HealthCheckError(
        'Supabase Storage check failed',
        this.getStatus(key, false, check),
      );
    }
    return this.getStatus(key, true, { latencyMs: check.latencyMs });
  }
}

/** @deprecated Use StorageHealthIndicator */
export const MinioHealthIndicator = StorageHealthIndicator;

@Injectable()
export class OpenSearchHealthIndicator extends HealthIndicator {
  constructor(private readonly healthService: HealthService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const check = await this.healthService.checkOpenSearch();
    if (check.status !== 'ok') {
      throw new HealthCheckError(
        'OpenSearch check failed',
        this.getStatus(key, false, check),
      );
    }
    return this.getStatus(key, true, { latencyMs: check.latencyMs });
  }
}
