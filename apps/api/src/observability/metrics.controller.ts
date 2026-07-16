import { Controller, Get, Header } from '@nestjs/common';
import { ApiExcludeController, ApiOperation, ApiTags } from '@nestjs/swagger';

import { MetricsService } from './observability.module';
import { Public } from '../authorization/decorators/require-permission.decorator';

@ApiTags('observability')
@ApiExcludeController(false)
@Controller('metrics')
@Public()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  @ApiOperation({ summary: 'Prometheus metrics scrape endpoint' })
  async metrics(): Promise<string> {
    return this.metricsService.render();
  }
}
