import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import {
  HealthService,
  MinioHealthIndicator,
  OpenSearchHealthIndicator,
  PostgresHealthIndicator,
  RedisHealthIndicator,
} from './health.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [
    HealthService,
    PostgresHealthIndicator,
    RedisHealthIndicator,
    MinioHealthIndicator,
    OpenSearchHealthIndicator,
  ],
})
export class HealthModule {}
