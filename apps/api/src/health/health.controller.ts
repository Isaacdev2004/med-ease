import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthCheckService } from '@nestjs/terminus';
import type { Response } from 'express';

import { SERVICE_NAME } from '@medease/constants';
import type { LivenessResponse, ReadinessResponse } from '@medease/types';

import { Public } from '../authorization/decorators/require-permission.decorator';
import {
  HealthService,
  MinioHealthIndicator,
  OpenSearchHealthIndicator,
  PostgresHealthIndicator,
  RedisHealthIndicator,
} from './health.service';

const startTime = Date.now();

@ApiTags('health')
@Controller('healthz')
@Public()
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly healthCheckService: HealthCheckService,
    private readonly postgresIndicator: PostgresHealthIndicator,
    private readonly redisIndicator: RedisHealthIndicator,
    private readonly minioIndicator: MinioHealthIndicator,
    private readonly opensearchIndicator: OpenSearchHealthIndicator,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiOkResponse({ description: 'API process is alive' })
  liveness(): LivenessResponse {
    return {
      status: 'ok',
      service: SERVICE_NAME,
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    };
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Readiness probe — verifies infrastructure dependencies',
  })
  @ApiOkResponse({ description: 'All dependencies healthy' })
  @ApiServiceUnavailableResponse({
    description: 'One or more dependencies unhealthy',
  })
  async readiness(
    @Res({ passthrough: true }) response: Response,
  ): Promise<ReadinessResponse> {
    const checks = await this.healthService.checkAllDependencies();
    const allOk = checks.every((check) => check.status === 'ok');

    if (allOk) {
      await this.healthCheckService.check([
        () => this.postgresIndicator.isHealthy('postgresql'),
        () => this.redisIndicator.isHealthy('redis'),
        () => this.minioIndicator.isHealthy('minio'),
        () => this.opensearchIndicator.isHealthy('opensearch'),
      ]);
    }

    if (!allOk) {
      response.status(HttpStatus.SERVICE_UNAVAILABLE);
    }

    return {
      status: allOk ? 'ok' : 'degraded',
      service: SERVICE_NAME,
      checks,
    };
  }
}
