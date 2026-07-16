import { Global, Module } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import { createLogger } from '@medease/logger';
import { SERVICE_NAME } from '@medease/constants';

import { MedeaseConfigService } from '../config/config.service';

export const MEDEASE_LOGGER = Symbol('MEDEASE_LOGGER');

@Global()
@Module({
  providers: [
    {
      provide: MEDEASE_LOGGER,
      inject: [MedeaseConfigService],
      useFactory: (configService: MedeaseConfigService) =>
        createLogger({
          service: SERVICE_NAME,
          nodeEnv: configService.app.nodeEnv,
        }),
    },
    Logger,
  ],
  exports: [MEDEASE_LOGGER, Logger],
})
export class MedeaseLoggerModule {}
