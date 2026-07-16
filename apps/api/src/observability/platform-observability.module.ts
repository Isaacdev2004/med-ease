import { Module } from '@nestjs/common';

import { ObservabilityModule } from '../observability/observability.module';
import { MetricsController } from './metrics.controller';
import { PlatformController } from './platform.controller';

@Module({
  imports: [ObservabilityModule],
  controllers: [MetricsController, PlatformController],
})
export class PlatformObservabilityModule {}
