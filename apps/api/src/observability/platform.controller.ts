import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { resolveRuntimeBuildInfo } from '@medease/observability';
import { SERVICE_NAME } from '@medease/constants';

import { MedeaseConfigService } from '../config/config.service';
import { Public } from '../authorization/decorators/require-permission.decorator';

@ApiTags('platform')
@Controller('platform')
@Public()
export class PlatformController {
  constructor(private readonly configService: MedeaseConfigService) {}

  @Get('info')
  @ApiOperation({
    summary: 'Runtime platform metadata for deployments and debugging',
  })
  @ApiOkResponse({ description: 'Application build and schema metadata' })
  info() {
    const observability = this.configService.observability;

    return {
      service: SERVICE_NAME,
      ...resolveRuntimeBuildInfo({
        serviceVersion: observability.appVersion,
        gitCommit: observability.gitCommit,
        buildTimestamp: observability.buildTimestamp,
        environment: this.configService.app.nodeEnv,
        schemaVersion: observability.schemaVersion,
        migrationVersion: observability.migrationVersion,
      }),
    };
  }
}
